require("dotenv").config()
const path = require("path")
const { Op } = require('sequelize')
const cloudinary = require("../config/cloudinaryConfig")
const Letter_Document = require("../models/letterDocumentModel")
const Ingoing_Letter = require("../models/ingoingModel")
const Outgoing_Letter = require("../models/outgoingModel")
const { Department, User_Department } = require('../models/many_to_many_models/user_department_relation')
const DepartmentService = require("../services/departmentServices")
const Document_Department_Access = require("../models/docDepAccessModel")
const uploadFileToCloudinary = require("./file-services/cloudinaryBufferUploader")
const allowedExtensions = require("./file-services/allowedFileTypes")
const IngoingServices = require("./ingoingServices")
const OutgoingServices = require('./outgoingServices')
const delete_file_from_cloudinary = require('./file-services/delete_file')


class LetterService {

    async upload_letter_to_cloudinary(letter_file, metadata){
        if (!letter_file){
            const error = new Error("No file uploaded");
            error.status = 400;
            throw error;
        }
        const fileExtension = path.extname(letter_file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            const error = new Error(`Unsupported file type: ${fileExtension}`);
            error.status = 400;
            throw error;
        }
        const folder = "letters"
        const result = await uploadFileToCloudinary(letter_file.buffer, folder)
        if(!result){
            const error = new Error("The file couldn't be uploaded to cloud");
            error.status = 500;
            throw error;
        }
        //Saving to file metadata and link to database
        const file_path = result.secure_url
        const cloudinary_public_id = result.public_id
        const document_type = result.format

        const file_name = letter_file.originalname

        const title = metadata.title || path.parse(letter_file.originalname).name;
        const description = metadata.description || "No description"
        const direction = metadata.direction || "In"
        const new_letter = await Letter_Document.create({
            title, description, file_name, file_path, cloudinary_public_id, document_type, direction
        })
        if (!new_letter){
            const error = new Error("The letter couldn't be created");
            error.status = 500;
            throw error;
        }

        // Creating An Ingoing/Outgoing Row
        const document_id = new_letter.document_id
        if (direction === "In"){
            //Create an ingoing letter here
            const ingoing_letter = await IngoingServices.create_ingoing(metadata, document_id)
        } else {
            //Create an outgoing letter here
            const outgoing_letter = await OutgoingServices.create_outgoing(metadata, document_id)
        }

        // Document Department Access
        let department_list = metadata.department_list
        department_list = JSON.parse(department_list.replace(/(\w+)/g, '"$1"'))
        async function processDocAccess(department) {
            let department_result = await DepartmentService.get_department_details(department)
            const department_id = department_result[0].department_id
            const new_doc_dep_access = await Document_Department_Access.create({
                document_id, department_id, privileged_user_within_department: [], access_level: "Own" 
            })
        }
        for (let i = 0;  i < department_list.length; i++) {
            await processDocAccess(department_list[i])

        }

        return result
    }

    async get_letter_from_cloudinary(public_id){

        //Sends a time limited private URL
        const letter_doc = await Letter_Document.findOne({where: {cloudinary_public_id: public_id}})
        if (!letter_doc){
            const error = new Error("The letter couldn't be found");
            error.status = 404;
            throw error;
        }
        const format = letter_doc.document_type
        const privateUrl = cloudinary.utils.private_download_url(public_id, format);
        return privateUrl
    }

    async get_all_letters(user_id, role_name, departments, page, page_size){
        const offset = (page - 1) * page_size;
        const limit = page_size;
        let count, rows;

        if (role_name === "record_official" || role_name === "admin"){
            ({ count, rows } = await Letter_Document.findAndCountAll({
                offset,
                limit,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: Document_Department_Access,
                        attributes: ['department_id', 'access_level'], 
                        as: 'DocDepartmentAccess',
                    }
                ]
            }));
            
        }
        else if (role_name === "department_head" || role_name === "staff"){
            ({ count, rows } = await Letter_Document.findAndCountAll({
                include: {
                    model: Document_Department_Access,
                    required: true, // Ensures only matching letters are selected
                    where: {
                        privileged_user_within_department: {
                            [Op.contains]: [user_id] // Checks if user_id exists in privileged_user_within_department array
                        }
                    }
                },
                offset,
                limit,
                order: [['created_at', 'DESC']]
              }));
        }
        else {
            const error = new Error("You have no acccess to any documents")
            error.status = 403; throw error 
        }

          
        if (count === 0) { const error = new Error("No letter document found.");
            error.status = 404; throw error;}

        const unique_counts = rows.length     // One document may have more than one count, however the rows are still unique
        return { count: unique_counts, rows }
    }

    async request_letter_deletion(public_id) {
        // TODO - Send Letter to the Record Official Requesting for Letter Deletion.
    }

    async delete_letter(public_id) {
        try {
            await delete_file_from_cloudinary(public_id)
            const letter_doc = await Letter_Document.findOne({where: {cloudinary_public_id: public_id}})
            if(!letter_doc) {const error = new Error("Letter could not be found.")
                error.status = 404; throw error
            }
            if (letter_doc.direction === "In") {
                await Ingoing_Letter.destroy({
                    where: { document_id: letter_doc.document_id }})
            } else if (letter_doc.direction === "Out") {
                await Outgoing_Letter.destroy({
                    where: { document_id: letter_doc.document_id }})
            }
            const result = await Letter_Document.destroy({
                where: { cloudinary_public_id: public_id }});
                
            }
        catch (error){
            throw error
        }
    }

    async grant_access(granter_user, users_id_list, letter_id) {
        if (!(['admin', 'record_official', 'department_head'].includes(granter_user.role_name))) {
            console.log(granter_user.role_name)
            const error = new Error('Unauthorized. Only admin, record official, or department head can grant access to a document.' )
            error.status = 401; throw error
        }
        let granted_users = []
        let grant_failed_users = []
        let has_access_before_users = []
        for(let i = 0; i < users_id_list.length; i++) {
            if (granter_user.role_name === 'department_head') {
                let departments_headed_by_granter = await Department.findAll({
                    attributes: ['department_id'],
                    where: {
                        department_head_id: granter_user.user_id,
                    },
                    raw: true, // To return plain JSON objects
                });
                departments_headed_by_granter = departments_headed_by_granter.map(dept => dept.department_id);

                let departments_of_user =  await User_Department.findAll({
                    attributes: ['department_id'],
                    where: { user_id: users_id_list[i] },
                    raw: true  
                });
                departments_of_user = departments_of_user.map(item => item.department_id);
            
                let common_departments = departments_headed_by_granter.filter(dep => departments_of_user.includes(dep));
                if (common_departments.length === 0) {
                    grant_failed_users.push(users_id_list[i]);
                    continue;
                }

                let record = await Document_Department_Access.findOne({
                    where: {
                      document_id: letter_id,
                      department_id: common_departments[0]
                    }
                  });
                
                  if (record) {
                    let currentPrivileged = record.privileged_user_within_department || [];
                    if (!currentPrivileged.includes(users_id_list[i])) {
                      currentPrivileged.push(users_id_list[i]);
                      record.privileged_user_within_department = currentPrivileged;
                      await record.save();
                    }
                    else {
                        has_access_before_users.push(users_id_list[i]);
                    }
                 }
                 else {
                    grant_failed_users.push(users_id_list[i]);
                 }
            }
            else if (['record_official', 'admin'].includes(granter_user.role_name)) {
                let record = await Document_Department_Access.findOne({
                    where: {
                      document_id: letter_id,
                    }
                  });
                
                  if (record) {
                    let currentPrivileged = record.privileged_user_within_department || [];
                    if (!currentPrivileged.includes(users_id_list[i])) {
                      currentPrivileged.push(users_id_list[i]);
                      record.privileged_user_within_department = currentPrivileged;
                      await record.save();
                    }
                    else {
                        has_access_before_users.push(users_id_list[i]);
                    }
                 }
                 else {
                    grant_failed_users.push(users_id_list[i]);
                 }
                } 
            else {
                grant_failed_users.push(users_id_list[i]);
            }
            // add it to the list in the database if not already on the list
            // append the user_id to the granted_users list

        }
        // return the success and failed lists. {granted_users, grant_failed_users.}
    } 

    async revoke_access(revoker_user, users_id_list, letter_id) {
        // TODO
    }
}

module.exports = new LetterService();


//Sample Cloudinary Response
// {
//     asset_id: 'f2b992a46e34b5f410106817238ba194',
//     public_id: 'letters/wrrwyjafdwo3uykdi5lc',
//     version: 1734745591,
//     version_id: 'cdeea761614d835da3a9f1cce058288f',
//     signature: '10c353c1a7f4bbd8a90cdd598a81c3f703f120a1',
//     width: 612,
//     height: 792,
//     format: 'pdf',
//     resource_type: 'image',
//     created_at: '2024-12-21T01:46:31Z',
//     tags: [],
//     pages: 114,
//     bytes: 2725107,
//     type: 'private',
//     etag: '5e0c608b081a49dfa24b607d9fac4a8f',
//     placeholder: false,
//     url: 'http://res.cloudinary.com/drerhuy62/image/private/s--DLdeZ4qE--/v1734745591/letters/wrrwyjafdwo3uykdi5lc.pdf',
//     secure_url: 'https://res.cloudinary.com/drerhuy62/image/private/s--DLdeZ4qE--/v1734745591/letters/wrrwyjafdwo3uykdi5lc.pdf',
//     asset_folder: 'letters',
//     display_name: 'wrrwyjafdwo3uykdi5lc',
//     original_filename: 'file',
//     api_key: '859535459334377'
//   }

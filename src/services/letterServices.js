require("dotenv").config()
const path = require("path")
const cloudinary = require("../config/cloudinaryConfig")
const Letter_Document = require("../models/letterDocumentModel")
const DepartmentService = require("../services/departmentServices")
const Document_Department_Access = require("../models/docDepAccessModel")
const uploadFileToCloudinary = require("./file-services/cloudinaryBufferUploader")
const allowedExtensions = require("./file-services/allowedFileTypes")
const IngoingServices = require("./ingoingServices")
const OutgoingServices = require('./outgoingServices')


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
            const error = new Error("The file couldn't uploaded to cloud");
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
        if (direction === "In"){
            //Create an ingoing letter here
            const document_id = new_letter.document_id
            const ingoing_letter = await IngoingServices.create_ingoing(metadata, document_id)
        } else {
            //Create an outgoing letter here
        }

        // Document Department Access
        const document_id = new_letter.document_id
        let department_list = metadata.department_list
        department_list = JSON.parse(department_list.replace(/(\w+)/g, '"$1"'))
        async function processDocAccess(department) {
            let department_result = await DepartmentService.get_department_details(department)
            const department_id = department_result[0].department_id
            const new_doc_dep_access = await Document_Department_Access.create({
                document_id, department_id
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
    async get_all_letters(page, page_size){
        const offset = (page - 1) * page_size;
        const limit = page_size;

        const { count, rows } = await Letter_Document.findAndCountAll({
            offset,
            limit,
          });
        if (count === 0) { const error = new Error("No letter document found.");
            error.status(404); throw error;}

        return {count, rows}
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

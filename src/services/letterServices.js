require("dotenv").config()
const path = require("path")
const cloudinary = require("../config/cloudinaryConfig")
const Letter_Document = require("../models/letterDocumentModel")
const Ingoing = require("../models//ingoingModel")
const Outgoing = require("../models/outgoingModel")
const uploadFileToCloudinary = require("./file-services/cloudinaryBufferUploader")
const allowedExtensions = require("./file-services/allowedFileTypes")


class LetterService {
    
    async upload_letter_to_cloudinary(letter_file, metadata){
        
        try {
            //Checking if file is uploaded
            if (!letter_file) {
                return {"status": false, "error": 'No file uploaded' };
              }
              
            //Checking if file type is supported
            const fileExtension = path.extname(letter_file.originalname).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return {"status": false, "error": `Unsupported file type: ${fileExtension}` };
              }

              //Uploading to cloudinary
            const folder = "letters"
            const result = await uploadFileToCloudinary(letter_file.buffer, folder)
            
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

            // Creating An Ingoing/Outgoing Row
            if (direction === "In"){
                //Create an ingoing letter here
            } else {
                //Create an outgoing letter here
            }
            
            return {"success": true, "status":200, result }
            
        } catch (error) {
            return {"success": false, error}
        }
        
    }
    
    async get_letter_from_cloudinary(public_id){

        //Sends a time limited private URL
        try {
            const letter_doc = await Letter_Document.findOne({where: {cloudinary_public_id: public_id}})
            if (!letter_doc){
                return {"success": false, "error": "Public ID of the document is invalid."}
            }
            const format = letter_doc.document_type
            const privateUrl = cloudinary.utils.private_download_url(public_id, format);
            return {"status": true, privateUrl}
        } catch (error) {
            return {"status": false, error}
        }
    
    
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
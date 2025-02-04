const cloudinary = require('../../config/cloudinaryConfig');

const delete_file_from_cloudinary = async function (public_id) {
    try {
        const result = await cloudinary.uploader.destroy(public_id, {type: "private"});
        if(result.result == 'ok') {
            console.log(public_id, "deleted from cloudinary successfully.");
        }
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}   

module.exports = delete_file_from_cloudinary 
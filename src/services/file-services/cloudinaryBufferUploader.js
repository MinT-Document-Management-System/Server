const cloudinary = require('../../config/cloudinaryConfig');
const streamifier = require('streamifier');

const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder,
        type: 'private',
       },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const uploadFileToCloudinary = async (fileBuffer, folder) => {
    try {
      const result = await uploadBuffer(fileBuffer, folder);
      return result;
    } catch (error) {
      throw new Error(`Upload Service Error: ${error.message}`);
    }
  };

module.exports = uploadFileToCloudinary;

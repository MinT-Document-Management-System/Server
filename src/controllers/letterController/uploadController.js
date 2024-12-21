const LetterService = require("../../services/letterServices.js")


const upload_letter = async function (req, res) {

    const letter_file = req.file
    const metadata =  req.body

    const result = await LetterService.upload_letter_to_cloudinary(letter_file, metadata)

    res.send(result)
    
}

module.exports = upload_letter
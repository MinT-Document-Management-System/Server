const LetterService = require("../../services/letterServices.js")


const upload_letter = async function (req, res) {

    const letter_file = req.file
    const metadata =  req.body

    const result = await LetterService.upload_letter_to_cloudinary(letter_file, metadata)

    res.send(result)
    
}

const get_letter = async function (req, res) {
    const public_id = req.params.public_id

    const private_url = await LetterService.get_letter_from_cloudinary(public_id)

    res.send(private_url)
    
}

module.exports = { upload_letter, get_letter }
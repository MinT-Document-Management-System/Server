const LetterService = require("../../services/letterServices.js")


const upload_letter = async function (req, res) {

    try {
        const letter_file = req.file
        const metadata =  req.body

        const result = await LetterService.upload_letter_to_cloudinary(letter_file, metadata)

        res.status(201).json(result)
    } catch (error) {
        res.status(error.status|| 500).json({error: error.message})
    }

}

const get_letter = async function (req, res) {
    try {
        const public_id = req.params.public_id

        const private_url = await LetterService.get_letter_from_cloudinary(public_id)

        res.status(200).json(private_url)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }


}

module.exports = { upload_letter, get_letter }
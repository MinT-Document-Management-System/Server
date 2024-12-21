const LetterService = require("../../services/letterServices")

const get_letter = async function (req, res) {
    const public_id = req.params.public_id

    const private_url = await LetterService.get_letter_from_cloudinary(public_id)

    res.send(private_url)
    
}

module.exports = get_letter
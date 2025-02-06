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

const get_all_letters = async function (req,res){
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;

        const all_letters = await LetterService.get_all_letters(page, pageSize);
        res.status(200).json(all_letters)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const upload_letter_version = async function (req, res) {
    try {
        const letter_file = req.file
        const metadata =  req.body

        // TODO
        const result = await LetterService.upload_letter_to_cloudinary(letter_file, metadata)

        res.status(201).json(result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const delete_letter = async function (req, res){
    try {
        const public_id = req.params.public_id

        const result = await LetterService.delete_letter(public_id);
        res.status(200).json({"message": "File deleted successfully!", result})
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const grant_access = async function (req, res){
    try {
        const user_id = req.body.user_id
        const letter_id = req.body.letter_id

        const grant_result = await LetterService.grant_access(user_id, letter_id)

        res.status(200).json(grant_result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const revoke_access = async function (req, res) {
    try {
        const user_id = req.body.user_id
        const letter_id = req.body.letter_id

        const revoke_result = await LetterService.revoke_access(user_id, letter_id)

        res.status(200).json(revoke_result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}
module.exports = { upload_letter, get_letter, get_all_letters, delete_letter, grant_access, revoke_access}

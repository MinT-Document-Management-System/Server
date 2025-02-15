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
        const user_id = req.user.user_id
        const role_name = req.user.role_name
        const departments = req.user.departments

        const all_letters = await LetterService.get_all_letters(user_id, role_name, departments, page, pageSize);
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

const request_letter_deletion = async function (req, res) {
    try {
        const public_id = req.params.public_id
        
        const deletion_request = await LetterService.request_letter_deletion(public_id)

        res.status(200).json({ message: "Letter Deletion Request has been successfully sent to Record Officials. You will be notified soon."})

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
        const granter_user = req.user
        const users_id_list = req.body.users_id_list
        const letter_id = req.body.letter_id

        const grant_result = await LetterService.grant_access(granter_user, users_id_list, letter_id)

        res.status(200).json(grant_result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const revoke_access = async function (req, res) {
    try {
        const revoker_user = req.user
        const users_id_list = req.body.users_id_list
        const letter_id = req.body.letter_id

        const revoke_result = await LetterService.revoke_access(revoker_user, users_id_list, letter_id)

        res.status(200).json(revoke_result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}
module.exports = { upload_letter, get_letter, get_all_letters, request_letter_deletion, delete_letter, upload_letter_version, grant_access, revoke_access}

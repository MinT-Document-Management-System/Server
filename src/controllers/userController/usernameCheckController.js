const UserService = require("../../services/userServices")

const usernameChecker = async function (req, res) {
    try {
        const username = req.params.username;
        const username_check = await UserService.username_check(username)
        res.status(200).json({message: "username is not taken"})
    } catch (error) {
        res.status(error.status || 400).json({error: error.message})
    }
}


module.exports = usernameChecker
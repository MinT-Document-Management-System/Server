const Userservice = require('../../services/userServices')

const login = async function (req, res) {
    try {
        const userdata = req.body
        const email = userdata.email
        const password = userdata.password

        const result = await Userservice.login_with_email(email, password)
        if(!(result.success)){
            if(result.error === "Temporary password is not reset."){
                res.redirect("http://frontend_web:3000/reset_password_page")
            }
        }

        res.status(200).json(result)
    } catch (error) {
        res.status(error.status||500).json({error: error.message})
    }


}

const signup = async function (req, res) {
    try {
        const userdata = req.body

        const newUser = await Userservice.createUser(userdata)

        res.status(201).json(newUser)
    } catch (error) {
        res.status(error.status||500).json({error: error.message})
    }

}

const reset_password = async function (req, res) {
    try {
        const userdata = req.body

        const token = await Userservice.reset_password(userdata)

        res.status(200).json(token)
    } catch (error) {
        res.status(error.status||500).json({error: error.message})
    }


}

const username_checker = async function (req, res) {
    try {
        const username = req.params.username;
        const username_check = await UserService.username_check(username)
        res.status(200).json({message: "username is not taken"})
    } catch (error) {
        res.status(error.status || 400).json({error: error.message})
    }
}

module.exports = { login, signup, reset_password, username_checker }

const Userservice = require('../../services/userServices')

const login = async function (req, res) {
    const userdata = req.body
    const email = userdata.email
    const password = userdata.password

    const result = await Userservice.login_with_email(email, password)
    if(!(result.success)){
        if(result.error === "Temporary password is not reset."){
            res.redirect("http://frontend_web:3000/reset_password_page")
        }
    }

    res.send(result)
}

module.exports = login

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Userservice = require('../../services/userServices')

const login = async function (req, res) {
    userdata = req.body
    email = userdata.email
    password = userdata.password

    token = await Userservice.login_with_email(email, password)

    res.send(token)
}

module.exports = login

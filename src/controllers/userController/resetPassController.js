const Userservice = require('../../services/userServices')

const reset_password = async function (req, res) {
    const userdata = req.body

    const token = await Userservice.reset_password(userdata)

    res.send(token)
}

module.exports = reset_password

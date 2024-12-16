const Userservice = require('../../services/userServices')

const signup = async function (req, res) {
    userdata = req.body

    newUser = await Userservice.createUser(userdata)

    res.send(newUser)
}

module.exports = signup

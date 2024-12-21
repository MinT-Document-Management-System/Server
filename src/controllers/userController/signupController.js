const Userservice = require('../../services/userServices')

const signup = async function (req, res) {
    const userdata = req.body

    const newUser = await Userservice.createUser(userdata)

    res.send(newUser)
}

module.exports = signup

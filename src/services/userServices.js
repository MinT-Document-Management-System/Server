const User = "../models/userModel"

const loginService = async (username) => User.findOne({
    where: {username}
})

module.exports = loginService
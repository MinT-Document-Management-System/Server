const User = "../models/userModel"

class UserService {

    async createUser({username, fullname, email}){
        User.create({
            username, 
            fullname,
            email,

        })
    }

    async login(username){
        User.findOne({
            where: {username} 
        })
    }
}

module.exports = UserService
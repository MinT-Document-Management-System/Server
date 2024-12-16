const jwt = require("jsonwebtoken")
require("dotenv").config()
const Role = require("../models/roleModel")
const Department = require("../models/departmentModel")
const User = require("../models/userModel")
const { generate_temp_password, hash_password } = require("./password-service/passwordGenerator")

class UserService {

    async createUser(userdata){
        // Destructuring the received data
        const {username, full_name, email, phone_number, role_name, department_name} = userdata
        if(!username) {return {"success": false, "error": "Username is required"}}
        if(!full_name) {return {"success": false, "error": "Full name is required"}}
        if(!email) {return {"success": false, "error": "Email is required"}}
        if(!role_name) {return {"success": false, "error": "Role is required"}}
        if(!department_name) {return {"success": false, "error": "Department is required"}}

        // Fetching role_id and department_id
        const role = await Role.findOne({where: {role_name: role_name}})
        if (!role){
            return {"success": false, "error": "Role is not found in the database"}
        }
        const department = await Department.findOne({where: {department_name: department_name}})
        if (!department){
            return {"success": false, "error": "Department is not found in the database"}
        }

        //Creating Temporary Password
        password = generate_temp_password(8)

        //Creating user
        try {
            newUser = await User.create({
                username, email, password, full_name, email,
                role_id: role.role_id,
                department_id: department.department_id,
                is_pass_temp: true })
            return {"success": true, user: newUser}
            
        } catch (error) {
            return {"success": false, "error": error}
        }   
    }



    async update_password_OTP(userdata){
        const {username, email, old_password, new_password} = userdata
        const user = await User.findOne({
            where: {
                username: username,
                email: email,
                password: old_password,
                is_pass_temp: true,
            }})
        
            if(user) {
                user.password = hash_password(new_password)
                await user.save()

                user_id = user.user_id
                full_name = user.full_name
                jwt_token = jwt.sign({user_id, full_name, email, username}, process.env.JWT_SECRET_KEY, {"expiresIn": '3d'})
                
                return {"success": true, "message": "Password has been changed successfully.", jwt_token}
            }
            else {
                return {"success": false, "error": "User does not exist"}
            }
    }



    async login_with_username(username){
        const user = User.findOne({
            where: {username} 
        })
        if (!user){
            return {"success": false, "error": "Username can not be found"}
        }
        else {
            user_id = user.user_id
            full_name = user.full_name
            email = user.email
            jwt_token = jwt.sign({user_id, full_name, email, username}, process.env.JWT_SECRET_KEY, {"expiresIn": '3d'})
            return {"success": true, jwt_token}            
        }
    }



    async login_with_email(email, password) {
        const user = User.findOne({
            where: {email}
        })
        if (!user){
            return {"success": false, "error": "Email can not be found."}
        }
        else {
            user_id = user.user_id
            full_name = user.full_name
            username = user.username
            role_id = user.role_id
            stored_password = user.password
            const is_valid = await bcrypt.compare(password, stored_password)
            if (!is_valid){
                return {"success": false, "error": "Wrong password!"}
            }
            jwt_token = jwt.sign({user_id, full_name, email, username, role_id}, process.env.JWT_SECRET_KEY, {"expiresIn": '1h'})
            return {"success": true, jwt_token}
        }
    }



    async get_user_data(user_identifier) {
        const user = await User.findOne({where: {user_id: user_identifier}})
        if (!user) {
            return {"success": false, "error": "User can not be found"}
        }
        else {
            try {
                role_name = (await Role.findOne({where: {role_id}})).role_name
                department_name = (await Department.findOne({where: {department_id}})).department_name
            } catch {
                role_name = "Could not be fetched"
                department_name = "Could not be fetched"
            }
            const {user_id, username, email, full_name, phone_number, account_status, created_at, updated_at} = user
            userData = {user_id, username, email, full_name, phone_number, account_status, created_at, updated_at, role_name, department_name}
            return {"success": true, userData}
        }
    }



    /**** TBD: user_identifier is filtered on 1) service side, or 2) controller side ****/
    
    async update_user_data(user_identifier, update_data) {
        //Removing user_identifier id from update_data
        const {user_id, ...updateAttributes} = update_data
        if (Object.keys(updateAttributes).length === 0) {
            return {"success": false, "error":'No valid attributes provided for update'}
          }
        
        try {
            await user.update(updateAttributes, {where: {user_id}})
            await this.user_row_updated(user_id)
            return { "success": true, message: 'User data updated successfully' };
        } catch (error) {
            return {"success": false, error}
        } 
    }



    async delete_user(user_identifier){
        const user = await User.findByPk(user_identifier)
        if (!user) return {"success": false, error: "User can not be found"}

        try {
            await user.destroy()
            return {"success": true, message: "User has been deleted successfully"}
        } catch (error) {
            return {"success": false, error}
        }

    }



    async user_row_updated(user_id){
        updated_user = await User.findOne({where: {user_id}})
        if (updated_user) {
            updated_user.updated_at = new Date()
            await updated_user.save() 
        }
    }
}

module.exports = UserService
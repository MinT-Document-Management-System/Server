const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt")
const Role = require("../models/roleModel")
const { User, Department, User_Department } = require("../models/many_to_many_models/user_department_relation")
const { generate_temp_password, hash_password } = require("./password-service/passwordGenerator")
const sendResetPasswordEmailService = require("./emailService")
const redis = require('./redisService')

class UserService {

    async createUser(userdata){
        // Destructuring the received data
        const {username, full_name, email, phone_number, role_name, department_name} = userdata
        if(!username) {const error = new Error("Username is required");
            error.status = 400; throw error;}
        if(!full_name) {const error = new Error("Full name is required");
            error.status = 400; throw error;}
        if(!email) {const error = new Error("Email is required");
            error.status = 400; throw error;}
        if(!role_name) {const error = new Error("Role is required");
            error.status = 400; throw error;}
        if(!department_name) {const error = new Error("Department is required");
            error.status = 400; throw error;}
        if(!phone_number) {const error = new Error("Phone number is required");
            error.status = 400; throw error;}

        // Fetching role_id and department_id
        const role = await Role.findOne({where: {role_name: role_name}})
        if (!role){
            const error = new Error("Role is not found in the database");
            error.status = 404; throw error;
        }
        const department = await Department.findOne({where: {department_name: department_name}})
        if (!department){
            const error = new Error("Department is not found in the database");
            error.status = 404; throw error;
        }

        //Creating Temporary Password
        const password = await generate_temp_password(8)
        const hashed_temporary_password = await hash_password(password)

        //Creating user
        const newUser = await User.create({
            username, email, full_name, email, phone_number,
            password: hashed_temporary_password,
            role_id: role.role_id,
            department_id: department.department_id,
            is_pass_temp: true })

        if (!newUser){
            const error = new Error("User can not be created");
            error.status = 500; throw error;}
        const newUserDepartment = await User_Department.create({
            user_id: newUser.user_id,
            department_id: department.department_id 
        })
        const link = "http://localhost:5173/reset_password"
        const emailService = await sendResetPasswordEmailService(email,link,password)

    }



    async reset_password(userdata){
        const {email, old_password, new_password, confirm_password} = userdata
        if (new_password !== confirm_password){
            const error = new Error("Confirm password does not match");
            error.status = 400; throw error;
        }

        const user = await User.findOne({
            where: {
                email: email,
                is_pass_temp: true,
            }})

        if(user) {
            const is_same = await bcrypt.compare(old_password, user.password)
            if(is_same){
                user.password = await hash_password(new_password)
                user.is_pass_temp=false
                await user.save()
    
                const user_id = user.user_id
                const full_name = user.full_name
                const username = user.username
                const jwt_token = jwt.sign({user_id, full_name, email, username}, process.env.JWT_SECRET_KEY, {"expiresIn": '3d'})
    
                return {jwt_token}
            }
            else {
                const error = new Error("Password is incorrect.")
                error.status = 400; throw error
            }
            
        }
        else {
            const error = new Error("User does not exist");
            error.status = 404; throw error;
        }
    }

    
    
    async check_user_email(user_email){
        if(!user_email){ const error = new Error("Email is not provided");
            error.status = 400; throw error;}
        const users = await User.findAll({where: {email: user_email}})
        if(users.length === 1){return }
        else{const error = new Error("Email does not exist");
            error.status = 404; throw error;
        }
    }



    async forget_password_send_otp(user_email){
        // Prevent OTP spam
        const existingOtp = await redis.get(`forget_password_otp:${user_email}`);
        if (existingOtp) {
            const error = new Error("An OTP was already sent. Try later.");
            error.status = 429; throw error;
        }


        const otp = await generate_temp_password(8)
        const otp_hashed = await hash_password(otp)
        const expiryTime = 10 * 60; // 10 minutes
        await redis.set(`forget_password_otp:${user_email}`, otp_hashed, "EX", expiryTime);        

        const link = "http://localhost:5173/reset_password"
        const emailService = await sendResetPasswordEmailService(user_email, link, otp)
    }
    
    
    
    async forget_password(user_data){
        const {email, user_otp, new_password,confirm_password} = user_data
        if (new_password !== confirm_password){
            const error = new Error("Password does not match");
            error.status = 400; throw error;
        }
        const storedOtp = await redis.get(`forget_password_otp:${email}`);
        if (!storedOtp) {
            const error = new Error("OTP expired or invalid")
            error.status = 400; throw error}
        
        // Throwing Errors in Asynchronous Callbacks: If an error is thrown inside the third parameter function of compare, it will crash your application because it won't be handled properly. This is because bcrypt.compare() is asynchronous, and errors thrown inside its callback are not propagated to the outer scope.
        
        const is_same = await bcrypt.compare(user_otp, storedOtp);
        if(!is_same){
            const error = new Error("Incorrect OTP") 
            error.status = 400; throw error
        }

        await redis.del(`forget_password_otp:${email}`);

        const user = await User.findOne({
            where: {
                email: email,
            }})

        if(user) {
            user.password = await hash_password(new_password)
            await user.save()

            const user_id = user.user_id
            const full_name = user.full_name
            const username = user.username
            const jwt_token = jwt.sign({user_id, full_name, email, username}, process.env.JWT_SECRET_KEY, {"expiresIn": '3d'})

            return {jwt_token}
        }
        else {
            const error = new Error("User does not exist");
            error.status = 404; throw error;
        }
    }



//      TBD
    async login_with_username(username){
        const user = User.findOne({
            where: {username}
        })
        if (!user){
            const error = new Error("Username can not be found");
            error.status = 404; throw error;
        }
        else {
            const user_id = user.user_id
            const full_name = user.full_name
            const email = user.email
            const jwt_token = jwt.sign({user_id, full_name, email, username}, process.env.JWT_SECRET_KEY, {"expiresIn": '3d'})
            return { jwt_token }
        }
    }



    async login_with_email(email, password) {
        const user = await User.findOne({
            where: {email}
        })
        if (!user){
            const error = new Error("Email can not be found.");
                error.status = 404; throw error;
        }
        else {
            const is_pass_temp = user.is_pass_temp;
            if (is_pass_temp){
                const error = new Error("Temporary password is not reset.");
                error.status = 409; throw error;}
            const user_id = user.user_id
            const full_name = user.full_name
            const username = user.username
            const role_id = user.role_id
            const stored_password = user.password
            const is_valid = await bcrypt.compare(password, stored_password)
            if (!is_valid){
                const error = new Error("Wrong password.");
                error.status = 401; throw error;}
            const role = await Role.findOne({where: {role_id} })
            const role_name = role.role_name
            const jwt_token = jwt.sign({user_id, full_name, email, username, role_id, role_name}, process.env.JWT_SECRET_KEY, {"expiresIn": '1h'})
            return {jwt_token}
        }
    }



    async get_user_data(user_id) {

        const user = await User.findOne({
            where: { user_id },
            include: [
                { model: Role, attributes: ['role_name'] },
                { model: Department, as: 'Departments', attributes: ['department_name'] }
             ]
          });
          
        if (!user) {
            const error = new Error("User can not be found");
            error.status = 404; throw error;        
        }

        user.departments =  user.Departments.map(dept => dept.dataValues.department_name);
        user.role_name   =  user.Role.dataValues.role_name;

        const { username, email, full_name, phone_number, account_status, role_name, departments, created_at, updated_at, is_pass_temp} = user
        const userData = {user_id, username, email, full_name, phone_number, role_name, departments, account_status, created_at, updated_at, is_pass_temp}
            
        return userData
    }


    
    async get_recently_created_users(num_of_users) {
        const users = await User.findAll({order: [['created_at', 'DESC']], limit: num_of_users});
        return users
    }



    async get_all_users(page, pageSize) {

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const { count, rows } = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            offset,
            limit,
          });

        if (count === 0) { const error = new Error("No users found.");
            error.status = 404; throw error;}

        return {count, rows}
    }


    async update_user_data(update_data) {
        //Removing user_identifier id from update_data
        const {user_id, ...updateAttributes} = update_data
        if (Object.keys(updateAttributes).length === 0) {
            const error = new Error('No valid attributes provided for update');
            error.status = 400; throw error;
          }

        await User.update(updateAttributes, {where: {user_id}})
        await this.user_row_updated(user_id)
        return { message: 'User data has been updated successfully' };
    }



    async delete_user(user_id){
        const user = await User.findByPk(user_id)
        if (!user) {const error = new Error("User can not be found");
            error.status = 404; throw error;
        }

        // Recommended Deletion: deleting associated User_Department records (Not explicitly necessary)
        await User_Department.destroy({
            where: { user_id }
        });
        
        const destroyed_user = await user.destroy()

        return {message: "User has been deleted successfully"}
    }



    async username_check(username){
        if(!username){ const error = new Error("Username is not provided");
            error.status = 400; throw error;}
        const users = await User.findAll({where: {username}})
        if(users.length === 0){return }
        else{const error = new Error("Username is already taken");
            error.status = 409; throw error;
        }
    }



    async user_row_updated(user_id){
        const updated_user = await User.findOne({where: {user_id}})
        if (updated_user) {
            updated_user.updated_at = new Date()
            await updated_user.save()
        }
    }

    
}

module.exports = new UserService()

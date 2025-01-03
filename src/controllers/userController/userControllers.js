const Userservice = require('../../services/userServices')

const login = async function (req, res) {
    try{
        const userdata = req.body
        const email = userdata.email
        const password = userdata.password
    
        const result = await Userservice.login_with_email(email, password)
    
        res.status(200).json(result)

    } catch(error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const signup = async function (req, res) {
    try {
        const userdata = req.body
    
        const newUser = await Userservice.createUser(userdata)
    
        res.status(201).json(newUser)

    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const reset_password = async function (req, res) {
    try {
        const userdata = req.body
    
        const token = await Userservice.reset_password(userdata)
    
        res.status(200).json(token)

    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const username_checker = async function (req, res) {
    try {
        const username = req.params.username;
        const username_check = await Userservice.username_check(username)
        res.status(200).json({message: "username is not taken"})
    } catch (error) {
        res.status(error.status || 400).json({error: error.message})
    }
}

const get_user_data = async function (req, res) {
    try {
        const user_id = req.params.user_id;
        const result = await Userservice.get_user_data(user_id)
        res.status(200).json(result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

const get_recently_created_users = async function (req, res) {
    try {
        const num_of_users = parseInt(req.query.number) || 5;
        const recent_users = await Userservice.get_recently_created_users(num_of_users);
        res.status(200).json({recent_users});
    } catch (error) {
        res.status(error.status || 400).json({error: error.message})
    }
}

const get_all_users = async function (req, res) {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.page_size) || 10;

        const result = await Userservice.get_all_users(page, pageSize);
        res.status(200).json(result);

    } catch (error) {
        res.status(error.status || 500).json({error: error.message})        
    }
}

const delete_user = async function (req, res) {
    try {
        const user_id = req.params.user_id;
        const result = await User.delete_user(user_id);
        res.status(204).json(result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})        
    }
}

module.exports = { login, signup, reset_password, username_checker, get_user_data, get_all_users, get_recently_created_users, delete_user }

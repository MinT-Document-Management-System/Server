const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginService = require('../../services/userServices')

const login = async function (req, res) {
    userdata = req.body
    username = userdata.username
    password = userdata.password

    user = await loginService(username)

    if (user) {

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            console.log('Authentication successful');
            console.log('User exists:', user.dataValues);
            token = jwt.sign({username, role}, process.env.JWT_SECRET_KEY, {expiresIn: '2d', httpOnly: true})
            res.cookie('authToken', token)
            res.json({  fullname: user.full_name, 
                        email: user.email, 
                        username: user.username, 
                        userId: user.user_id})
        
        } else {
            console.log('Incorrect password');
            res.json({"error": "Incorrect password"})
        }

      } else {
        console.log('User does not exist');
        res.json({'error': "User does not exist"})
        }
    }

module.exports = login


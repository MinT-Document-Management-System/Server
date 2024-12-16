const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Userservice = require('../../services/userServices')

const login = async function (req, res) {
    userdata = req.body
    email = userdata.email
    password = userdata.password


    token = await Userservice.login_with_email(email, password)

    res.send(token)
    // if (!user.success) {

    //     // const isPasswordValid = await bcrypt.compare(password, user.password);
    //     // if (isPasswordValid) {
    //     //     console.log('Authentication successful');
    //     //     console.log('User exists:', user.dataValues);
    //     //     token = jwt.sign({username, role}, process.env.JWT_SECRET_KEY, {expiresIn: '2d', httpOnly: true})
    //     //     res.cookie('authToken', token)
    //     //     res.json({  fullname: user.full_name, 
    //     //                 email: user.email, 
    //     //                 username: user.username, 
    //     //                 userId: user.user_id})
        
    //     // } else {
    //     //     console.log('Incorrect password');
    //     //     res.json({"error": "Incorrect password"})
    //     // }

    //   } else {
    //     // console.log('User does not exist');
    //     // res.json({'error': "User does not exist"})
    //     }
    }

module.exports = login


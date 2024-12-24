const express = require('express');
const login = require('../controllers/userController/loginController');
const signup = require('../controllers/userController/signupController')
const reset_password = require('../controllers/userController/resetPassController')
const username_checker = require('../controllers/userController/usernameCheckController')


const router = express.Router();

// Login route
router.post('/login', login);
// Signup route
router.post('/signup', signup);
// Reset password route
router.post('/reset_password',reset_password)
// Unused username checker Route
router.get('/username_check/:username', username_checker)

module.exports = router;

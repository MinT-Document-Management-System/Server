const express = require('express');
const { login, signup, reset_password, username_checker, get_user_data, get_all_users } = require('../controllers/userController/userControllers');


const router = express.Router();

// Login route
router.post('/login', login);
// Signup route
router.post('/signup', signup);
// Reset password route
router.post('/reset_password',reset_password)
// Unused username checker Route
router.get('/username_check/:username', username_checker)
// Fetch a user
router.get('/get_user_data/:user_id', get_user_data)
// Fetch all users
router.get('/get_all_users', get_all_users)

module.exports = router;

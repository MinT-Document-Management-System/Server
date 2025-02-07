const express = require('express');
const { login, signup, reset_password, check_user_email, forget_password_send_otp, forget_password, username_checker, get_user_data, get_all_users, delete_user, get_recently_created_users } = require('../controllers/userController/userControllers');


const router = express.Router();

// Login route
router.post('/login', login);
// Signup route
router.post('/signup', signup);
// Reset password route
router.post('/reset_password', reset_password)
// Check if user exists route
router.post('/check_user_email/:user_email', check_user_email)
// Forget Password Send OTP
router.post('/forget_password_send_otp', forget_password_send_otp)
// Forget password route
router.post('/forget_password', forget_password)
// Unused username checker Route
router.get('/username_check/:username', username_checker)
// Fetch a user
router.get('/get_user_data/:user_id', get_user_data)
// Fetch five recently created users
router.get('/get_recently_created_users', get_recently_created_users)
// Fetch all users
router.get('/get_all_users', get_all_users)
// Delete a user
router.get('/delete_user/:user_id', delete_user)

module.exports = router;

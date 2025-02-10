const express = require('express');
const authenticateJWT = require('../middlewares/authN_Middleware')
const { login, signup, reset_password, check_user_email, forget_password_send_otp, forget_password, username_checker, get_user_data, get_all_users, delete_user, get_recently_created_users } = require('../controllers/userController/userControllers');


const router = express.Router();

const router_public = express.Router();
const router_restricted = express.Router();
router_restricted.use(authenticateJWT)

// Login route
router_public.post('/login', login);
// Reset password route
router_public.post('/reset_password', reset_password)
// Check if user exists route
router_public.post('/check_user_email/:user_email', check_user_email)
// Forget Password Send OTP
router_public.post('/forget_password_send_otp', forget_password_send_otp)
// Forget password route
router_public.post('/forget_password', forget_password)

// Signup route
router_restricted.post('/signup', signup);
// Unused username checker Route
router_restricted.get('/username_check/:username', username_checker)
// Fetch a user
router_restricted.get('/get_user_data/:user_id', get_user_data)
// Fetch five recently created users
router_restricted.get('/get_recently_created_users', get_recently_created_users)
// Fetch all users
router_restricted.get('/get_all_users', get_all_users)
// Delete a user
router_restricted.get('/delete_user/:user_id', delete_user)


router.use(router_public)
router.use(router_restricted)

module.exports = router;

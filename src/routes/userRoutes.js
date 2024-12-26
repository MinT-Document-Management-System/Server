const express = require('express');
const { login, signup, reset_password, username_checker } = require('../controllers/userController/userControllers');


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

const express = require('express');
const login = require('../controllers/login/loginController');
const { resetPassword } = require('./controllers/resetPasswordController');

const router = express.Router();

// Login route
router.post('/', login);

// Reset password route
// router.post('/reset-password', resetPassword);

module.exports = router;

const express = require('express');
const { login } = require('./controllers/authController');
const { resetPassword } = require('./controllers/resetPasswordController');

const router = express.Router();

// Login route
router.post('/login', login);

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;

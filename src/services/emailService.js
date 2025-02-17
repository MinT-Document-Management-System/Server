require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Function to send a password reset email
const sendPasswordResetEmail = async (recipientEmail, resetLink, temp_password) => {
  const sendEmail = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>This is your temporary password: <em>${temp_password}</em></p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
    if (!sendEmail){
      const error = new Error("The email couldn't be send");
      error.status = 500;
      throw error;
    }
    return sendEmail
};

module.exports = sendPasswordResetEmail;

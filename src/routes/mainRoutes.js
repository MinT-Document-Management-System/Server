const express = require("express")
const authenticateJWT = require('../middlewares/authN_Middleware')
const role_routes = require("./roleRoutes")
const department_routes = require("./departmentRoutes")
const user_routes = require("./userRoutes")
const letter_routes = require("./letterRoutes")

const main_router = express.Router()

// Main Router
main_router.use('/role', authenticateJWT, role_routes)
// User Router
main_router.use('/user', user_routes)
// Letter Router
main_router.use('/letter', authenticateJWT, letter_routes)
// Department Router
main_router.use('/department', authenticateJWT, department_routes)

module.exports = main_router

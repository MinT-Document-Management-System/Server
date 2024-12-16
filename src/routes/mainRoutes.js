const express = require("express")
const role_routes = require("./roleRoutes")
const department_routes = require("./departmentRoutes")
const user_routes = require("./userRoutes")

const main_router = express.Router()

// Main Router
main_router.use('/role', role_routes)
// main_router.use('/department', department_routes)
main_router.use('/user', user_routes)

module.exports = main_router

const express = require("express")
const role_routes = require("./roleRoutes")
const department_routes = require("./departmentRoutes")
const login_routes = require("./loginRoutes")

const main_router = express.Router()

// Main Router
main_router.use('/role', role_routes)
// main_router.use('/department', department_routes)
main_router.use('/login', login_routes)

module.exports = main_router
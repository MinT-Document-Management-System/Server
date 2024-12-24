const express = require("express")
const add_department = require("../controllers/departmentController/addDepartmentController")
const get_all_departments = require("../controllers/departmentController/getAllDepartmentsController")
const get_department_details = require("../controllers/departmentController/getDepartmentController")

const router = express.Router()

// Add Department Route
router.post("/add_department", add_department)
// Fetch All Departments Route
router.get("/get_all_departments", get_all_departments)
// Fetch Details of a Department Route
router.get("/get_department_detail:department_name", get_department_details)

module.exports = router;
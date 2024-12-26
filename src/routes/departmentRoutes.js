const express = require("express")
const { add_department, get_all_departments, get_department_details , delete_department} = require("../controllers/departmentController/departmentControllers")
const { delete_department } = require("../services/departmentServices")

const router = express.Router()

// Add Department Route
router.post("/add_department", add_department)
// Fetch All Departments Route
router.get("/get_all_departments/:page/:pageSize", get_all_departments)
// Fetch Details of a Department Route
router.get("/get_department_detail/:department_name", get_department_details)
// Delete a department
router.post("/delete_department",delete_department)

module. exports = router;

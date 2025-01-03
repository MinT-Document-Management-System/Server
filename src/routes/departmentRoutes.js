const express = require("express")
const { add_department, get_all_departments, get_department_details , delete_department, get_user_count_by_department} = require("../controllers/departmentController/departmentControllers")


const router = express.Router()

// Add Department Route
router.post("/add_department", add_department)
// Fetch All Departments Route
router.get("/get_all_departments/:page/:pageSize", get_all_departments)
// Fetch Details of a Department Route
router.get("/get_department_details/:department_name", get_department_details)
// Delete a department
router.delete("/delete_department/:department_id",delete_department)
// Get user count from a department
router.get("/get_user_count_by_department/:department_name",get_user_count_by_department)
module. exports = router;

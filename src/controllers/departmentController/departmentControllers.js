const DepartmentService = require("../../services/departmentServices")

const add_department = async function (req, res) {
    try {
        const department_data = req.body

        const newDepartment = await DepartmentService.createDeparment(department_data)

        res.status(201).json(newDepartment)

    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }

}

const get_all_departments = async function (req, res) {
    try {
        const {page, pageSize} = req.params;
        const result = await DepartmentService.get_all_departments(page,pageSize)

        res.status(200).json(result)

    } catch (error) {
        if(error.message === "No departments found"){
            res.status(404).json({error: "No departments found in the database"})
        } else {
            res.status(500).json({error: error.message})
        }
    }

}

const get_department_details = async function (req, res) {
    try {
        const department_name = req.params.department_name;

        const result = await DepartmentService.get_department_details(department_name)

        res.status(200).json(result)

    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}
const delete_department  = async function(req,res){
    try {
        const department_id = req.params.department_id
        const result = await DepartmentService.delete_department(department_id)
        res.status(204).json(result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}
const get_user_count_by_department = async function(req,res){
    try {
        const department_name = req.params.department_name
        const result = await DepartmentService.getUserCountByDepartment(department_name)
        res.status(200).json(result)
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}
module.exports = { add_department, get_all_departments, get_department_details,delete_department,get_user_count_by_department}

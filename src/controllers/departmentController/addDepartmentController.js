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

module.exports = add_department
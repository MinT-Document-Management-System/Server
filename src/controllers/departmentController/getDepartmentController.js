const DepartmentService = require("../../services/departmentServices")

const get_department_details = async function (req, res) {
    try {
        const department_name = req.params.department_name;
    
        const result = await DepartmentService.get_department_details(department_name)
    
        res.status(200).send(result)
        
    } catch (error) {
        res.status(error.status || 500).json({error: error.message})
    }
}

module.exports = get_department_details
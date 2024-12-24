const DepartmentService = require("../../services/departmentServices")

const get_all_departments = async function (req, res) {
    try {
        const result = await DepartmentService.get_all_departments()
    
        res.status(200).json(result)

    } catch (error) {
        if(error.message === "No departments found"){
            res.status(404).json({error: "No departments found in the database"})
        } else {
            res.status(500).json({error: error.message})
        }
    }
    
}   

module.exports = get_all_departments
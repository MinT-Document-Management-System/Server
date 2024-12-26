const sequelize = require("../config/db");
const Department = require("../models/departmentModel")
const User = require("../models/userModel")

class DepartmentService {
    async create_department(department_data){
        try {
            const {department_name, department_head_id, department_description} = department_data
            if(!department_name){ const error = new Error("Department name is required");
                error.status = 400; throw error;}
            if(!department_head_id){ const error = new Error("Department-head id is required");
                error.status = 400; throw error;}
            const existing_department = await Department.findOne({where: {department_name}})
            if(existing_department){const error = new Error("Department already exists");
                error.status = 409; throw error}

            if(!department_description) department_description = "No description"
            const department = await Department.create({department_name, department_head_id, department_description})
            return department

        } catch (error) {
            error.message = `Department creation failed: ${error.message}`
            throw error
        }

    }

    async get_department_details(department_name){
        if(!department_name){const error = new Error("Department name is required");
            error.status = 400; throw error;}
        const query = `SELECT
    d.department_id,
    d.department_name,
    d.department_description,
    created_at,
    updated_at,
    u.full_name AS department_head_name
FROM
    department AS d
LEFT JOIN
    users AS u
ON
    d.department_head_id = u.user_id
WHERE
    d.department_name = department_name
`
        const department = await sequelize.query(query);

        if(!department){const error = new Error("Department can not be found");
            error.status = 404; throw error;}
        return department;
    }

    async get_all_departments(page , pageSize){
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        // Fetch the departments with pagination
        const all_departments = await Department.findAndCountAll({
            offset: offset,
            limit: limit,
        });
        if(all_departments.length === 0){ const error = new Error("No departments found");
            error.status = 404; throw error;}
        return all_departments
    }
}

module.exports = new DepartmentService()

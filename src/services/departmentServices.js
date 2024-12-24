const Department = require("../models/departmentModel")

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
        const department = Department.findOne({where: {department_name}})
        if(!department){const error = new Error("Department can not be found");
            error.status = 404; throw error;}
        return department;
    }

    async get_all_departments(){
        const all_departments = await Department.findAll()
        if(all_departments.length === 0){ const error = new Error("No departments found");
            error.status = 404; throw error;}
        return all_departments
    }
}

module.exports = new DepartmentService()
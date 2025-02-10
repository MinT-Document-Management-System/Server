const sequelize = require("../config/db");
const { User, Department } = require("../models/many_to_many_models/user_department_relation")

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

        let department = await Department.findOne({
            where: { department_name: department_name }, // Filtering by department_name
            attributes: [
                'department_id',
                'department_name',
                'department_description',
                'created_at',
                'updated_at'
            ],
            include: [
                {
                    model: User,
                    as: 'DepartmentHead', // This alias should match your association
                    attributes: ['full_name']
                }
            ],
            raw: true, // Flatten results into a plain object
            nest: true // Ensures nested objects remain structured
        });

        department.department_head_name = department.DepartmentHead.full_name
        delete department.DepartmentHead
        
        if(!department){const error = new Error("Department can not be found");
            error.status = 404; throw error;}
        return [department];
    }

    async get_all_departments(page, pageSize){
        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        let all_departments = await Department.findAll({
            attributes: [
                'department_id',
                'department_name',
                'department_description',
                'created_at',
                'updated_at'
            ],
            include: [
                {
                    model: User,
                    as: 'DepartmentHead',
                    attributes: ['full_name']
                }
            ],
            order: [['department_id', 'ASC']], 
            limit: limit,
            offset: offset,
            raw: true, // Flatten results into plain objects
            nest: true // Keep nested structures intact
        });
        

        if(all_departments.length === 0){ const error = new Error("No departments found");
            error.status = 404; throw error;}

        all_departments = all_departments.map((department) => {
            department.department_head_name = department.DepartmentHead.full_name
            delete department.DepartmentHead
            return department
        })

        return all_departments
    }

    async delete_department(department_id){
        const department = await Department.findByPk(department_id)
        if(!department){
            const error = new Error("The department is not found")
            error.status = 404
            throw error
        }
        const deleted_department = await department.destroy(department)
        if(!deleted_department){
            const error = new Error("The department couldn't be deleted")
            error.status = 500
            throw error
        }
        return deleted_department
    }

    async getUserCountByDepartment(department_name) {
        try {

            const department = await Department.findOne({
                where: { department_name: department_name },
                attributes: [
                    'department_name',
                    [sequelize.fn('COUNT', sequelize.col('Users.user_id')), 'userCount'] // Counting users
                ],
                include: [
                    {
                        model: User,
                        as: 'Users',  // Alias for the many-to-many relation
                        through: {
                            attributes: []  // Exclude fields from join table
                        },
                        attributes: []  // Exclude user details, just counting
                    }
                ],
                group: ['Department.department_name'],  // Ensures count is accurate
                raw: true  // Returns plain JSON result
            });            

            if (!department) {
                throw new Error('Department not found');
            }

            return [department];
            
        } catch (err) {
            const error = new Error('Error fetching user count:', err.message);
            throw error;
        }
    };

}


module.exports = new DepartmentService()

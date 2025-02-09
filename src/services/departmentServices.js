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
        const query = `SELECT
        d.department_id,
        d.department_name,
        d.department_description,
        d.created_at,
        d.updated_at,
        u.full_name AS department_head_name
        FROM
            department AS d
        LEFT JOIN
            users AS u
        ON
            d.department_head_id = u.user_id
        WHERE
            d.department_name = :department_name

        `
        const department = await sequelize.query(query, {
            replacements: { department_name },
            type: sequelize.QueryTypes.SELECT,
        });

        if(!department){const error = new Error("Department can not be found");
            error.status = 404; throw error;}
        return department;
    }

    async get_all_departments(page,pageSize){
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const query = `SELECT
        d.department_id,
        d.department_name,
        d.department_description,
        d.created_at,
        d.updated_at,
        u.full_name AS department_head_name
        FROM
            department AS d
        LEFT JOIN
            users AS u
        ON
            d.department_head_id = u.user_id
         ORDER BY
                d.department_id
            LIMIT :limit
            OFFSET :offset;
        `
        const all_departments = await sequelize.query( query, {
            replacements: { limit, offset },
            type: sequelize.QueryTypes.SELECT,
        });
        if(all_departments.length === 0){ const error = new Error("No departments found");
            error.status = 404; throw error;}
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
            const query = `
            SELECT
                d.department_name,
                COUNT(u.user_id) AS userCount
            FROM
                department AS d
            LEFT JOIN
                users AS u
            ON
                d.department_id = u.department_id
            WHERE
                d.department_name = :department_name
            GROUP BY
                d.department_id
            `
            const department = await sequelize.query(query,
            {
                replacements: { department_name },
                type: sequelize.QueryTypes.SELECT,
            })

            if (!department) {
                throw new Error('Department not found');
            }

            return department;
        } catch (error) {
            console.error('Error fetching user count:', error.message);
            throw error;
        }
    };

}


module.exports = new DepartmentService()

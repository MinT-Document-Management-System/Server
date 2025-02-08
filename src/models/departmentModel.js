const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const User = require('./userModel')
const User_Department = require('./userDepartmentModel')

const Department = sequelize.define('Department', {
        department_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        department_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        department_head_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        department_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, 
    {
        tableName : 'department',
        timestamps : false
    }
)

// Define Relationship
Department.belongsTo(User, { foreignKey: 'department_head_id', as: 'DepartmentHead' });
User.hasOne(Department, { foreignKey: 'department_head_id', as: 'ManagedDepartment' });

Department.belongsToMany(User, {
    through: User_Department, 
    foreignKey: 'department_id',
    otherKey: 'user_id',
    as: 'Users'  // Alias for department's users
});

// Department.sync({alter: false})

module.exports = Department



// Querying Example

/*

    const department = await Department.findOne({
        where: { department_id: someDeptId },
        include: [
            { model: User, as: 'DepartmentHead' },  // The single head of the department
            { model: User, as: 'Users' }  // All users belonging to the department
        ]
    });
    console.log(department.DepartmentHead); // Returns the department head (User)
    console.log(department.Users); // Returns an array of Users in the department

*/
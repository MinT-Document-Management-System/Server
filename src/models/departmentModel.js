const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

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
                model: 'User',
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
// Department.sync({alter: false})

module.exports = Department
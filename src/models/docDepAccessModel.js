const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Document_Department_Access = sequelize.define("Document_Department_Access", 
    {
        access_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Letter_Document",
                key: 'letter_id'
            }
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Department",
                key: 'department_id'
            }
        },
        privileged_user_within_department: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true
        },
        access_level: {
            type: DataTypes.STRING(20),
            defaultValue: "Read",
            allowNull: true
        }
    }, 
    {
        tableName: 'document_department_access',
        timestamps: false
    })

// Document_Department_Access.sync({alter: false})

module.exports = Document_Department_Access
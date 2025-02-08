const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')
const Letter_Document = require('./letterDocumentModel.js')
const Department = require('./departmentModel.js')

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
                model: Letter_Document,
                key: 'letter_id'
            }
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Department,
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

// Define Relationship
Document_Department_Access.belongsTo(Letter_Document, { foreignKey: 'document_id' });
Letter_Document.hasMany(Document_Department_Access, { foreignKey: 'document_id' });

Document_Department_Access.belongsTo(Department, { foreignKey: 'department_id' });
Department.hasMany(Document_Department_Access, { foreignKey: 'department_id' });

// Document_Department_Access.sync({alter: false})

module.exports = Document_Department_Access

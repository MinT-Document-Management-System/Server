const {DataTypes} = require('sequelize')
const sequelize = require("../config/db")

const Letter_Document = sequelize.define("Letter_Document", 
    {
        document_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
            
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        filepath: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        document_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        direction: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: "Draft",
            allowNull: true
        },
        approval_status: {
            type: DataTypes.STRING(50),
            defaultValue: "Pending",
            allowNull: true
        }
    },
    {
        tableName: 'letter_document',
        timestamps: false
    }
)

// Letter_Document.sync({alter: false})


module.expors = Letter_Document
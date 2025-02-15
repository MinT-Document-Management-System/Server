const {DataTypes} = require("sequelize")
const sequelize = require("../config/db")
const Letter_Document = require('./letterDocumentModel')
const { User } = require('./many_to_many_models/user_department_relation')

const Version_Control = sequelize.define("Version_Control", 
    {
        version_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        document_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Letter_Document,
                key: "document_id"
            }
        },
        version_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "user_id"
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        changes_summary: {
            type: DataTypes.TEXT
        }
    }, 
    {
        tableName: "version_control",
        timestamps: false
    }
)

// Defining Relationships
Version_Control.belongsTo(Letter_Document, { foreignKey: 'document_id', onDelete: 'CASCADE' })
Letter_Document.hasOne(Version_Control, { foreignKey: 'document_id' })

Version_Control.belongsTo(User, { foreignKey: 'created_by', onDelete: 'SET NULL' })
User.hasMany(Version_Control, { foreignKey: 'created_by' })

// Version_Control.sync({alter: false})

module.exports = Version_Control
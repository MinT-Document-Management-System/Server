const {DataTypes} = require("sequelize")
const sequelize = require("../config/db")
const Letter_Document = require('./letterDocumentModel')
const { Department } = require('./many_to_many_models/user_department_relation')
const Comment = require('./commentModel')

const Outgoing = sequelize.define("Outgoing", 
    {
        outgoing_id: {
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
        receiver_body: {
            type: DataTypes.TEXT,
        },
        date_written: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        date_sent: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
        },
        sender_department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Department,
                key: "department_id"
            }
        },
    }, 
    {
        tableName: 'outgoing',
        timestamps: false
    }
)

// Defining Relationship
Outgoing.belongsTo(Letter_Document, { foreignKey: 'document_id', onDelete: 'CASCADE' });
Letter_Document.hasOne(Outgoing, { foreignKey: 'document_id' });

Outgoing.belongsTo(Department, { foreignKey: 'sender_department_id', onDelete: 'SET NULL' });
Department.hasOne(Outgoing, { foreignKey: 'sender_department_id' });

// Outgoing.sync({alter: false})

module.exports = Outgoing
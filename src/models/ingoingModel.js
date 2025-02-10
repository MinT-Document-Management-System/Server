const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')
const Letter_Document = require('./letterDocumentModel')
const Comment = require('./commentModel')

const Ingoing = sequelize.define("Ingoing", 
    {
        ingoing_id: {
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
        letter_id: {
            type: DataTypes.STRING(50),
            allowNUll: true
        },
        sender_body: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date_written: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        date_forwarded: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        date_received: {
            type: DataTypes.DATE,
            allowNull: true

        },
    },
    {
        tableName: 'ingoing',
        timestamps: false  
    }
)

// Defining Relationship
Ingoing.belongsTo(Letter_Document, { foreignKey: 'document_id', onDelete: 'CASCADE' });
Letter_Document.hasOne(Ingoing, { foreignKey: 'document_id' });

// Ingoing.sync({alter: false})

module.exports = Ingoing
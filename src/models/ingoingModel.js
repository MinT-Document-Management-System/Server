const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

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
                model: "Letter_Document",
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
            allowNull: true
        },
        date_forwarded: {
            type: DataTypes.DATE,
            allowNull: true
        },
        date_received: {
            type: DataTypes.DATE,
            allowNull: true

        },
        comment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Comment",
                key: "comment_id"
            }
        },
    },
    {
        tableName: 'ingoing',
        timestamps: false  
    }
)

// Ingoing.sync({alter: false})

module.exports = Ingoing
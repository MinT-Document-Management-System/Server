const {DataTypes} = require("sequelize")
const sequelize = require("../config/db")

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
                model: "Letter_Document",
                key: "document_id"
            }
        },
        receiver_body: {
            type: DataTypes.TEXT,
        },
        date_written: {
            type: DataTypes.DATE,
        },
        date_sent: {
            type: DataTypes.DATE,
        },
        sender_department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Department",
                key: "department_id"
            }
        },
        comment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Comment",
                key: "comment_id"
            }
        }
    }, 
    {
        tableName: 'outgoing',
        timestamps: false
    }
)

// Outgoing.sync({alter: false})

module.exports = Outgoing
const {DataTypes} = require('sequelize')
const sequelize = require("../confif/db")

const Message = sequelize.define("Message", 
    {
        message_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        notification_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Notification",
                key: "notification_id"
            }
        },
        sender_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: 'user_id'
            }
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: 'user_id'
            }
        },
        message_content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date_created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: "Unread"
        },
        date_seen: {
            type: DataTypes.DATE,
            allowNull: true

        }
    }, 
    {
        tableName: 'message',
        timestamps: false
    })

    // Message.sync({alter: false})

    module.exports = Message
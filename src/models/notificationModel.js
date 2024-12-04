const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Notification = sequelize.define('Notification', 
    {
        notification_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "user_id"
            }
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "user_id"
            }
        },
        notification_content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        }
    }, 
    {
        tableName : 'notification',
        timestamps: false``
    })

// Notification.sync({alter: false})

module.exports = Notification
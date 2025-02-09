const {DataTypes} = require('sequelize')
const sequelize = require("../confif/db")
const Notification = require('./notificationModel')
const { User } = require('./many_to_many_models/user_department_relation')

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
                model: Notification,
                key: "notification_id"
            }
        },
        sender_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
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

// Define Relationship
Message.belongsTo(Notification, { foreignKey: 'notification_id', onDelete: 'SET NULL' });
Notification.hasOne(Message, { foreignKey: 'notification_id' });

// Define Self-referencing Relationships
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender', onDelete: 'SET NULL' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver', onDelete: 'SET NULL' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });
    
// Message.sync({alter: false})

module.exports = Message
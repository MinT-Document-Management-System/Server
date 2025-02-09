const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const { User } = require('./many_to_many_models/user_department_relation')

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
                model: User,
                key: "user_id"
            }
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
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

// Defining Self-referencing Relationships
Notification.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender', onDelete: 'SET NULL' });
Notification.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver', onDelete: 'SET NULL' });

User.hasMany(Notification, { foreignKey: 'sender_id', as: 'SentMessages' });
User.hasMany(Notification, { foreignKey: 'receiver_id', as: 'ReceivedMessages' });


// Notification.sync({alter: false})

module.exports = Notification
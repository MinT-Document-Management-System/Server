const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const Comment = sequelize.define("Comment", 
    {
        comment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        document_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "Letter_Document",
                key: "document_id"
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "User",
                key: "user_id"
            }
        },
        comment_text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        }
    }, 
    {
        tableName: 'comment',
        timestamps: false
    })

// Comment.sync({alter: false})

module.exports = Comment
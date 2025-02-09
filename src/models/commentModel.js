const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')
const Letter_Document = require('./letterDocumentModel')
const { User } = require('./many_to_many_models/user_department_relation')

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
                model: Letter_Document,
                key: "document_id"
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
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

// Define Relationship
Comment.belongsTo(Letter_Document, { foreignKey: 'document_id', onDelete: 'CASCADE' });
Letter_Document.hasMany(Comment, { foreignKey: 'document_id' });

Comment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: 'user_id' });

// Comment.sync({alter: false})

module.exports = Comment
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Role = sequelize.define('Role', // The model name
  {
    role_id: {
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING(50), 
      allowNull: false, 
      unique: true, 
    },
    role_description: {
      type: DataTypes.TEXT, 
      allowNull: true, 
    },
    created_at: {
      type: DataTypes.DATE, 
      allowNull: true, 
      defaultValue: DataTypes.NOW, 
    },
  },
  {
    // Options for the model/table
    tableName: 'roles', // Name of the database table
    schema: 'public', // Schema of the table
    timestamps: false, 
  }
);

// Role.sync({alter: false})

module.exports = Role;

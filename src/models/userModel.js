const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Role = require('./roleModel');
const Department = require('./departmentModel')
const User_Department = require('./userDepartmentModel')

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'role_id',
    },
    allowNull: true,
  },
  account_status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Active',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  is_pass_temp: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: false, // Sequelize's built-in timestamps is avoided
});

// Defining Relationships
User.belongsToMany(Department, {
  through: User_Department, 
  foreignKey: 'user_id',
  otherKey: 'department_id',
  as: 'Departments'  // Alias for user's departments
});

User.belongsTo(Role, { foreignKey: 'role_id', onDelete: 'SET NULL' });
Role.hasMany(User, { foreignKey: 'role_id' })

// User.sync({alter: false}) 

module.exports = User;

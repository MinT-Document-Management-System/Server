const User = require('../userModel')
const Department = require('../departmentModel')
const User_Department = require('../userDepartmentModel')



// Defining Relationships
Department.belongsTo(User, { foreignKey: 'department_head_id', as: 'DepartmentHead' });
User.hasOne(Department, { foreignKey: 'department_head_id', as: 'ManagedDepartment' });

User.belongsToMany(Department, {
    through: User_Department, 
    foreignKey: 'user_id',
    otherKey: 'department_id',
    as: 'Departments'  // Alias for user's departments
});

Department.belongsToMany(User, {
    through: User_Department, 
    foreignKey: 'department_id',
    otherKey: 'user_id',
    as: 'Users'  // Alias for department's users
});

module.exports = { User, Department, User_Department }
const {DataTypes} = require("sequelize")
const sequelize = require("../config/db")

const User_Department = sequelize.define("User_Department", 
    {
        user_id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "User",
                key: "user_id"
            }
        },
        department_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "Department",
                key: "department_id"
            }
        },
        role_in_department: {
            type: DataTypes.STRING(50),
        },
        start_date: {
            type: DataTypes.DATE
        },
        end_date: {
            type: DataTypes.DATE
        }
    }, 
    {
        tableName: "user_department",
        timestamps: false
    }
)

// User_Department.sync({alter: false})

module.exports = User_Department


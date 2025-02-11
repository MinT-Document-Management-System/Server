require("dotenv").config()
const jwt = require("jsonwebtoken");
const { User, Department } = require('../models/many_to_many_models/user_department_relation')
const Role = require('../models/roleModel')

const authenticateJWT = async (req, res, next) => {
    // const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
    let token = req.cookies.jwt_token

    if (!token) {
        token = extractToken(req) 
    }
    if (!token) {
        return res.status(401).json({ message: "Unauthorized. You must login first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


        // Checking if user exists
        const user = await User.findOne({
            where: { user_id: decoded.user_id },
            include: [
                { model: Role, attributes: ['role_name'] },
                { model: Department, as: 'Departments', attributes: ['department_name'] }
             ]
          });
          
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        user.departments =  user.Departments.map(dept => dept.dataValues.department_name);
        user.role_name   =  user.Role.dataValues.role_name;
      
        req.user = user; // Attach user data to request object
        next();
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
};


const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null; // Return null if no token is found
    }

    return authHeader.split(' ')[1]; // Extract the token part
};

module.exports = authenticateJWT;

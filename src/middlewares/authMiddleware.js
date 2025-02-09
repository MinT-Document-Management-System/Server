require("dotenv").config()
const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    // const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
    const token = req.cookies.jwt_token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. You must login first." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (err) {
        return res.status(403).json({ message: "Forbidden. Your token is invalid." });
    }
};

module.exports = authenticateJWT;

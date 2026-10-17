// backend/LoginPage/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No valid token provided."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.name);
    return res.status(401).json({
      success: false,
      message: error.name === "TokenExpiredError" 
        ? "Token has expired. Please login again." 
        : "Invalid token"
    });
  }
};

module.exports = authMiddleware;
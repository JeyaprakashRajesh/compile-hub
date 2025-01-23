// middleware/middleware.js
const jwt = require("jsonwebtoken"); 

const Middleware = (req, res, next) => {
  const token = req.body.token || req.headers["authorization"]; 
  if (!token) return res.status(401).json({ message: "Access denied, no token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.decoded_data = decoded; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = { Middleware };

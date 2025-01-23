// middleware/middleware.js
const jwt = require("jsonwebtoken"); 

const Middleware = (req, res, next) => {
  console.log("Middleware called");
  const header =  req.headers["authorization"]; 
  const token = header && header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied, no token provided." });

  try {
    console.log("Verifying token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.decoded_data = decoded; 
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = { Middleware };

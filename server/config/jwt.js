const jwt = require("jsonwebtoken");

function generateToken(email, res) {
  const JWT_TOKEN = process.env.JWT_SECRET;

  try {
    const token = jwt.sign({ email: email }, JWT_TOKEN);
    console.log("Generated Token:", token);
    return token; 
  } catch (err) {
    console.log("error while creating token", err);
    return res.status(500).json({ message: "Internal Server Error: " + err }); 
  }
}

module.exports = {
  generateToken,
};
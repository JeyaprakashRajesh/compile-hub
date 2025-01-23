

const User = require("../models/UserModel")

async function getUserDetails(req, res) {
    try {
      const email = req.decoded_data.email;
      const data = await User.findOne({"email" : email})
      res.status(200).json(data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      res.status(500).json({ message: "Server error." });
    }
  }
  
  module.exports = {
    getUserDetails,
  };
  
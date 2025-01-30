const fs = require("fs");
const path = require("path");
const User = require("../models/UserModel");
const { exec } = require("child_process");

async function getUserDetails(req, res) {
  try {
    const email = req.decoded_data.email;
    const data = await User.findOne({ email: email });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error." });
  }
}

async function updatePlatforms(req, res) {
  const { platform, username } = req.body;
  const email = req.decoded_data.email;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { [platform]: username },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating platform:", err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getUserDetails,
  updatePlatforms,
};

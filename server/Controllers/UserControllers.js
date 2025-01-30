
const User = require("../models/UserModel");  
const axios = require('axios');


function extractTitleSlug(problemLink) {
  try {
    return new URL(problemLink).pathname.split("/").filter(Boolean).pop();
  } catch (err) {
    console.error("Error extracting titleSlug from problem link:", err);
    return "";
  }
}
async function updateTaskStatus(userData) {
  try {
    const username = userData.leetcode;
    const recentSubmissions = await getRecentSubmissions(username);

    for (const task of userData.tasks) {  
      for (const taskDetail of task.tasks) {
        const problemTitleSlug = extractTitleSlug(taskDetail.problemlink);
        const recentSubmission = recentSubmissions.find(sub => sub.titleSlug === problemTitleSlug);

        if (recentSubmission) { 
          taskDetail.status = recentSubmission.statusDisplay === "Accepted" ? "complete" : "incomplete";
        }
      }
    }

    await userData.save();
  } catch (err) {
    console.error('Error updating task status:', err);
  }
}
async function getRecentSubmissions(username) {
  try {
    const response = await axios.get(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
    return response.data.recentSubmissions;
  } catch (err) {
    console.error('Error fetching recent submissions:', err);
    return [];
  }
}

async function getUserDetails(req, res) {
  try {
    const email = req.decoded_data.email;
    const data = await User.findOne({ email: email });

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    await updateTaskStatus(data);

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

const { generateToken } = require("../config/jwt");
const User = require("../models/UserModel");
const { getAndIncrementCustomerId } = require("../models/AutoIncrementer");

async function Login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
    }

    const token = generateToken(email, res);
    console.log("Generated Token:", token);

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

async function Signup(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const customer_id = await getAndIncrementCustomerId();

    const newUser = new User({
      customer_id,
      username,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = {
  Login,
  Signup,
};

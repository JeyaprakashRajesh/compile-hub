const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const { getAndIncrementAdminId } = require("../models/AutoIncrementer");
const User = require("../models/UserModel")

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const admin_id = await getAndIncrementAdminId();
        const newAdmin = new Admin({
            username : name,
            email,
            password, 
            admin_id
        });

        await newAdmin.save();
        const token = jwt.sign({ id: newAdmin._id, admin_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "Admin registered successfully", token, admin: { name, email, admin_id } });
    } catch (err) {
        console.error("Error registering admin:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (admin.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ "email" : email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, admin: { name: admin.name, email: admin.email, admin_id: admin.admin_id } });
    } catch (err) {
        console.error("Error logging in admin:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const AddUsers = async (req, res) => {
    try {
        const { user_id } = req.body;
        const adminEmail = req.decoded_data.email; 
        console.log(adminEmail)
        let admin = await Admin.findOne({ email: adminEmail });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (!admin.Users.includes(user_id)) {
            admin.Users.push(user_id);
            await admin.save();
            return res.status(200).json({ message: "User added successfully", Users: admin.Users });
        }
        res.status(400).json({ message: "User already exists in the list" });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ message: "Server error" });
    }
};
const AddTask = async (req, res) => {
    const { date, problemlink, name, platform } = req.body;
    const adminEmail = req.decoded_data.email;

    try {
        const admin = await Admin.findOne({ email: adminEmail });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        for (const userId of admin.Users) {
            const user = await User.findOne({ customer_id: userId });
            if (!user) {
                continue; 
            }
            let dateEntry = user.tasks.find(task => task.date === date);

            if (!dateEntry) {
                dateEntry = {
                    date,
                    tasks: [],
                };
                user.tasks.push(dateEntry);
            }
            dateEntry.tasks.push({
                problemlink,
                name,
                status: "incomplete",
                platform,
            });
            await user.save();
        }

        res.status(200).json({ message: "Task added successfully" });
    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerAdmin, loginAdmin , AddUsers , AddTask };

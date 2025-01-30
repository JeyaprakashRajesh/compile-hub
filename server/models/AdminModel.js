const { Schema, model } = require("mongoose");

const AdminSchema = new Schema({
    username: {
        type: String,
        required: true,  
    },
    admin_id: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    Users: [
        {
            type: Number,
        }
    ]
});

const Admin = model("Admin", AdminSchema);
module.exports = Admin;

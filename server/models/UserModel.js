const mongoose = require("mongoose")
const schema = mongoose.Schema

const UserModel = new schema( {
    customer_id : {
        type : Number,
        require : true,
        unique : true
    },
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    leetcode : {
        type : String,
    },
    github : {
        type : String,
    },
})

const User = mongoose.model("User" , UserModel)

module.exports = User
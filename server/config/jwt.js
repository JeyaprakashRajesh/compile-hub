const jwt = require("jsonwebtoken")
const { model } = require("mongoose")

function generateToken(email , res) {
    const JWT_TOKEN = process.env.JWT_TOKEN
    try {
      const token = jwt.sign({"email" : email}, JWT_TOKEN)
    console.log("Generated Token : ",token)
    return token  
    }catch(err) {
        console.log("error while creating token")
        return res.status(500).message("Internal Server Error : ", err)
    }
    
}

module.exports = {
    generateToken
}
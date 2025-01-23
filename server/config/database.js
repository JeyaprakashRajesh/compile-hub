const mongoose = require("mongoose")

const mongo_uri = process.env.MONGO_URI

function db() {
    mongoose.connect(mongo_uri)
        .then((response)=> {
            console.log("Connected to MongoDB")
        })
        .catch((err)=> {
            console.log("Error connecting to MongoDB : " , err.message)
        })
}


module.exports = db
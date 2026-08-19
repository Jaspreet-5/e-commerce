const mongoose = require('mongoose')

const connectDB = async () => {

    try {
        console.log("Starting DB connections...")
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connection Successful")

    }
    catch (err) {
        console.error("DB Connection Failed! ")
        console.log(err)
        process.exit()
    }
}

module.exports = connectDB
const mongoose = require("mongoose");
const connectDB = async (url) => {
    try {
        const con = await mongoose.connect(url);
        console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch (error) {
        console.log(`Error in connecting to database`);
        process.exit(1);
    }
}
module.exports = connectDB
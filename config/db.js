const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");
        console.log("Database:", conn.connection.name);
        console.log("Ready State:", mongoose.connection.readyState);

        return conn;

    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
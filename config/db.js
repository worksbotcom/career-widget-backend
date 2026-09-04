const mongoose = require("mongoose");

let connectionPromise;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI)
        .then((conn) => {
            console.log("MongoDB connected successfully");
            console.log("Database:", conn.connection.name);
            console.log("Ready State:", mongoose.connection.readyState);
            return conn;
        })
        .catch((error) => {
            connectionPromise = undefined;
            console.error("MongoDB Connection Error:", error);
            throw error;
        });

    return connectionPromise;
};

module.exports = connectDB;
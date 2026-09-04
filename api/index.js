const app = require("../app");
const connectDB = require("../config/db");

let databaseReady;

module.exports = async (req, res) => {
    try {
        databaseReady ??= connectDB();
        await databaseReady;
        return app(req, res);
    } catch (error) {
        databaseReady = undefined;
        console.error("Database initialization failed:", error);
        return res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
};
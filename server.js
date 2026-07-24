require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedSubscriptions = require("./seed/subscriptionSeeder");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect MongoDB
        await connectDB();

        // Seed default subscriptions
        await seedSubscriptions();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
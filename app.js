const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/auth.router");
const companyRouter = require("./routers/company.router");
const superadminRouter = require("./routers/superadmin.router");
const subscriptionRouter = require("./routers/subscription.router");
const dashboardRoutes = require("./routers/dashboard.router");
const departmentRoutes = require("./routers/department.router");
const locationRoutes = require("./routers/location.router");
const jobRoutes = require("./routers/job.router");
const widgetRoutes = require("./routers/widget.router");
const teamMemberRoutes = require("./routers/teamMember.router");
const applicationRoutes = require("./routers/application.router");
const planRoutes = require("./routers/plan.router");
const companySubscriptionRoutes = require("./routers/companySubscription.router");

const errorMiddleware = require("./middleware/error.middleware");
const notFoundMiddleware = require("./middleware/notFound.middleware");

const app = express();
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
].filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API is running");
});

const fs = require("fs");
app.get("/api/debug/apply-controller", (req, res) => {
    try {
        const src = fs.readFileSync(require.resolve("./controllers/application.controller"), "utf8");
        res.type("text").send(src);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.use("/api/auth", authRouter);
app.use("/api/company", companyRouter);
app.use("/api/superadmin", superadminRouter);
app.use("/api/subscriptions",subscriptionRouter);
app.use("/api/company/dashboard",dashboardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/widget", widgetRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/company-subscriptions", companySubscriptionRoutes);

// Handle unknown routes
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

module.exports = app;
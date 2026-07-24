const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

const authMiddleware = async (req, res, next) => {
    try {
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required (or) Access Denied"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const company = await Company.findById(decoded.id).select("-password");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        if (!company.isActive) {
            return res.status(403).json({
                success: false,
                message: "Company account is inactive"
            });
        }

        req.company = company;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
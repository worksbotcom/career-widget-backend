const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const superAdmin = require("../models/SuperAdmin");
const AdminLog = require("../models/SuperAdminLog");
const generateSuperAdminToken = require("../utils/generateSuperAdminToken");

const superadminLogger = require("../utils/superadminLogger");

const Company = require("../models/Company");

function buildCompanyQueryById(id) {
    const query = { $or: [{ companyId: id }] };

    if (mongoose.Types.ObjectId.isValid(id)) {
        query.$or.push({ _id: id });
    }

    return query;
}

exports.login = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                errors: errors.array()
            });

        }

        const { email, password } = req.body;

        const admin = await superAdmin.findOne({ email });

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });

        }

        const token = generateSuperAdminToken(admin);

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            data: {

                token,

                admin: {

                    id: admin._id,

                    name: admin.name,

                    email: admin.email,

                    role: admin.role

                }

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};


exports.getAllCompanies = async (req, res) => {
    try {

        const companies = await Company.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: companies.length,
            data: companies
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const { search = "", module = "" } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { adminEmail: { $regex: search, $options: "i" } },
                { action: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { "details.description": { $regex: search, $options: "i" } }
            ];
        }

        if (module) {
            query.$or = query.$or || [];
            query.$or.push(
                { "details.module": module },
                { "details.module": { $regex: module, $options: "i" } }
            );
        }

        const logs = await AdminLog.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: logs.length,
            data: logs
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

exports.getCompanyById = async (req, res) => {

    try {

        const company = await Company.findOne(buildCompanyQueryById(req.params.id)).select("-password");

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }

        return res.status(200).json({
            success: true,
            data: company
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

exports.updateCompanyStatus = async (req, res) => {
    try {

        const { isActive } = req.body;

        const company = await Company.findOneAndUpdate(
            buildCompanyQueryById(req.params.id),
            { isActive },
            {
                returnDocument: "after"
            }
        ).select("-password");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        await superadminLogger({
            admin: req.admin,
            action: "Updated Company Status",
            company,
            details: {
                isActive: company.isActive
            }
        });

        return res.status(200).json({
            success: true,
            message: "Company status updated.",
            data: company
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateSubscription = async (req, res) => {

    try {

        const { subscription } = req.body;

        const company = await Company.findOneAndUpdate(
            buildCompanyQueryById(req.params.id),
            {
                subscription
            },
            {
                returnDocument: "after"
            }
        ).select("-password");

        

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }
        

        await superadminLogger({
            admin: req.admin,
            action: "Updated Subscription",
            company,
            details: {
                subscription: company.subscription
            }
        });

        return res.status(200).json({
            success: true,
            message: "Subscription updated successfully.",
            data: company
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.deleteCompany = async (req, res) => {

    try {

        const company = await Company.findOneAndDelete(buildCompanyQueryById(req.params.id));

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }

        await superadminLogger({
            admin: req.admin,
            action: "Deleted Company",
            company
        });

        return res.status(200).json({
            success: true,
            message: "Company deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.dashboard = async (req, res) => {

    try {

        const totalCompanies = await Company.countDocuments();

        const verifiedCompanies = await Company.countDocuments({
            isVerified: true
        });

        const unverifiedCompanies = await Company.countDocuments({
            isVerified: false
        });

        const activeCompanies = await Company.countDocuments({
            isActive: true
        });

        const inactiveCompanies = await Company.countDocuments({
            isActive: false
        });

        const freePlan = await Company.countDocuments({
            subscription: "Free"
        });

        const basicPlan = await Company.countDocuments({
            subscription: "Basic"
        });

        const proPlan = await Company.countDocuments({
            subscription: "Pro"
        });

        const enterprisePlan = await Company.countDocuments({
            subscription: "Enterprise"
        });

        return res.status(200).json({

            success: true,

            data: {

                totalCompanies,

                verifiedCompanies,

                unverifiedCompanies,

                activeCompanies,

                inactiveCompanies,

                subscriptions: {

                    freePlan,

                    basicPlan,

                    proPlan,

                    enterprisePlan

                }

            }

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getAllCompanies = async (req, res) => {

    try {

        let {
            page = 1,
            limit = 10,
            search = "",
            status,
            verified,
            subscription,
            sort = "newest"
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const query = {};

        // Search
        if (search) {
            query.$or = [
                {
                    companyName: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    website: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Active / Inactive Filter
        if (status === "active") {
            query.isActive = true;
        }

        if (status === "inactive") {
            query.isActive = false;
        }

        // Verified Filter
        if (verified === "true") {
            query.isVerified = true;
        }

        if (verified === "false") {
            query.isVerified = false;
        }

        // Subscription Filter
        if (subscription) {
            query.subscription = subscription;
        }

        // Sorting
        const sortOption = {};

        if (sort === "oldest") {
            sortOption.createdAt = 1;
        } else {
            sortOption.createdAt = -1;
        }

        const total = await Company.countDocuments(query);

        const companies = await Company.find(query)
            .select("-password")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({

            success: true,

            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCompanies: total,
                limit
            },

            data: companies

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.analytics = async (req, res) => {

    try {

        const today = new Date();

        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const totalCompanies =
            await Company.countDocuments();

        const todayRegistrations =
            await Company.countDocuments({
                createdAt: {
                    $gte: startOfToday
                }
            });

        const monthlyRegistrations =
            await Company.countDocuments({
                createdAt: {
                    $gte: startOfMonth
                }
            });

        const activeCompanies =
            await Company.countDocuments({
                isActive: true
            });

        const inactiveCompanies =
            await Company.countDocuments({
                isActive: false
            });

        const verifiedCompanies =
            await Company.countDocuments({
                isVerified: true
            });

        const unverifiedCompanies =
            await Company.countDocuments({
                isVerified: false
            });

        const freePlan =
            await Company.countDocuments({
                subscription: "Free"
            });

        const basicPlan =
            await Company.countDocuments({
                subscription: "Basic"
            });

        const proPlan =
            await Company.countDocuments({
                subscription: "Pro"
            });

        const enterprisePlan =
            await Company.countDocuments({
                subscription: "Enterprise"
            });

        return res.json({

            success: true,

            analytics: {

                totalCompanies,

                todayRegistrations,

                monthlyRegistrations,

                activeCompanies,

                inactiveCompanies,

                verifiedCompanies,

                unverifiedCompanies,

                subscriptions: {

                    freePlan,

                    basicPlan,

                    proPlan,

                    enterprisePlan

                }

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.monthlyRegistrations = async (req, res) => {

    try {

        const data = await Company.aggregate([

            {

                $group: {

                    _id: {

                        year: {
                            $year: "$createdAt"
                        },

                        month: {
                            $month: "$createdAt"
                        }

                    },

                    companies: {
                        $sum: 1
                    }

                }

            },

            {

                $sort: {

                    "_id.year": 1,
                    "_id.month": 1

                }

            }

        ]);

        res.json({

            success: true,

            data

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
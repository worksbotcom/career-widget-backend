const bcrypt = require("bcryptjs");
const Company = require("../models/Company")
const Job = require("../models/Job")
const Subscription = require("../models/Subscriptions")
const AdminLog = require("../models/SuperAdminLog")
const generateApiKey = require("../utils/apiKey")
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier");

// Get Company Profile
exports.getCompanyProfile = async (req, res) => {
    try {

        const company = await Company.findById(req.company.id)
            .select("-password");

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        const actualJobsCount = await Job.countDocuments({ companyId: company.id });
        if (actualJobsCount !== company.jobsCount) {
            company.jobsCount = actualJobsCount;
            await Company.findByIdAndUpdate(company.id, { jobsCount: actualJobsCount });
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


// Update Company Profile
exports.updateCompanyProfile = async (req, res) => {
    try {

        const company = await Company.findByIdAndUpdate(
            req.company.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

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

// Regenerate API Key
exports.regenerateApiKey = async (req, res) => {
    try {

        const apiKey = generateApiKey();

        await Company.findByIdAndUpdate(
            req.company.id,
            { apiKey }
        );

        return res.status(200).json({
            success: true,
            data: {
                apiKey
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

// Get Widget Script
exports.getWidgetScript = async (req, res) => {
    try {

        const company = await Company.findById(req.company.id);

        const script = `
<script src="https://career-widget-backend.vercel.app/widget.js"></script>

<div id="career-widget"></div>

<script>
CareerWidget.init({
    companyId: "${company.companyId}"
});
</script>`;

        return res.status(200).json({
            success: true,
            data: {
                script
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

exports.uploadCompanyLogo = async (req, res) => {

    console.log(req.file);
    console.log(req.body);

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Logo is required."
            });
        }

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "career-widget/company-logos"
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);

        });

        const company = await Company.findByIdAndUpdate(
            req.company.id,
            {
                logo: result.secure_url
            },
            {
                returnDocument: "after"
            }
        );

        return res.json({
            success: true,
            logo: company.logo
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getSubscription = async (req, res) => {

    try {

        const company = await Company.findById(req.company.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        const plans = await Subscription.find({ isActive: true })
            .sort({ price: 1 })
            .lean();

        const currentPlan = company.subscriptionId
            ? await Subscription.findById(company.subscriptionId).lean()
            : null;

        const normalizedPlans = plans.map((plan) => ({
            ...plan,
            jobsLimit: plan.maxJobs ?? plan.jobsLimit ?? 0
        }));

        const normalizedCurrentPlan = currentPlan
            ? {
                ...currentPlan,
                jobsLimit: currentPlan.maxJobs ?? currentPlan.jobsLimit ?? 0
            }
            : {
                _id: null,
                name: company.subscription || "Free",
                price: 0,
                jobsLimit: company.jobsCount || 0
            };

        return res.status(200).json({

            success: true,

            data: {

                companyId: company.companyId,

                companyName: company.companyName,

                currentPlan: normalizedCurrentPlan,

                plans: normalizedPlans

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

exports.getCompanyAuditLogs = async (req, res) => {
    try {
        const { search = "", module = "" } = req.query;
        const query = {
            companyId: req.company.companyId
        };

        if (search) {
            query.$or = [
                { action: { $regex: search, $options: "i" } },
                { adminEmail: { $regex: search, $options: "i" } },
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

exports.changePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword,

            confirmPassword

        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match."

            });

        }

        const company = await Company.findById(req.company.id);

        if (!company) {

            return res.status(404).json({

                success: false,

                message: "Company not found."

            });

        }

        const isMatch = await bcrypt.compare(

            currentPassword,

            company.password

        );

        if (!isMatch) {

            return res.status(400).json({

                success: false,

                message: "Current password is incorrect."

            });

        }

        company.password = await bcrypt.hash(newPassword, 10);

        await company.save();

        return res.status(200).json({

            success: true,

            message: "Password updated successfully."

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
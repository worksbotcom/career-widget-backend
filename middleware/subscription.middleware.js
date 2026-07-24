const Company = require("../models/Company");
const Job = require("../models/Job");

exports.checkJobLimit = async (req, res, next) => {

    try {

        const company = await Company.findById(req.company.id)
            .populate("subscription");

        if (!company) {

            return res.status(404).json({

                success: false,

                message: "Company not found."

            });

        }

        if (!company.subscription) {

            return res.status(403).json({

                success: false,

                message: "No active subscription found."

            });

        }

        // Unlimited Jobs
        if (company.subscription.maxJobs === -1) {

            return next();

        }

        const totalJobs = await Job.countDocuments({

            company: company._id,

            isDeleted: false // Remove if you don't use soft delete

        });

        if (totalJobs >= company.subscription.maxJobs) {

            return res.status(403).json({

                success: false,

                message: `Your ${company.subscription.name} plan allows only ${company.subscription.maxJobs} jobs. Please upgrade your subscription.`

            });

        }

        next();

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
const Job = require("../models/Job");
const Company = require("../models/Company");

// Get all published jobs for a company
exports.getPublishedJobs = async (req, res) => {

    try {

        const { companyId } = req.params;

        // Find company using public companyId (e.g. COMP_29F148)
        const company = await Company.findOne({ companyId });

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }

        const jobs = await Job.find({
            companyId: company._id,
            status: "Published"
        })
            .populate("departmentId", "name")
            .populate("locationId", "name city country")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: jobs
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch published jobs."
        });

    }

};

// Get single published job
exports.getPublishedJob = async (req, res) => {

    try {

        const { companyId, id } = req.params;

        // Find company using public companyId
        const company = await Company.findOne({ companyId });

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }

        const job = await Job.findOne({
            _id: id,
            companyId: company._id,
            status: "Published"
        })
            .populate("departmentId", "name")
            .populate("locationId", "name city state country type")
            .populate(
                "companyId",
                "companyName logo website industry companySize headquarters description"
            );

        if (!job) {

            return res.status(404).json({
                success: false,
                message: "Job not found."
            });

        }

        res.status(200).json({
            success: true,
            data: job
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch job."
        });

    }

};
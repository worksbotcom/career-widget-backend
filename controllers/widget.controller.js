const Job = require("../models/Job");
const Company = require("../models/Company");

// Get all published jobs for a company
exports.getPublishedJobs = async (req, res) => {

    try {

        const { companyId } = req.params;
        const company = companyId ? await Company.findOne({ companyId }) : null;

        if (companyId && !company) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        const query = { status: "Published" };
        if (company) {
            query.companyId = company._id;
        }

        const jobs = await Job.find(query)
            .populate("departmentId", "name")
            .populate("locationId", "name city country")
            .populate("companyId", "companyName companyId logo")
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
        const company = companyId ? await Company.findOne({ companyId }) : null;

        if (companyId && !company) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        const query = { _id: id, status: "Published" };
        if (company) {
            query.companyId = company._id;
        }

        const job = await Job.findOne(query)
            .populate("departmentId", "name")
            .populate("locationId", "name city state country type")
            .populate(
                "companyId",
                "companyId companyName logo website industry companySize headquarters description"
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
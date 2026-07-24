const Job = require("../models/Job");
const Company = require("../models/Company");
const Department = require("../models/Department");
const Location = require("../models/Location");


// CREATE JOB
exports.createJob = async (req, res) => {

    try {

        const companyId = req.company.id;

        const {
            departmentId,
            locationId
        } = req.body;

        // Validate Department
        const department = await Department.findOne({
            _id: departmentId,
            companyId
        });

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found."
            });
        }

        // Validate Location
        const location = await Location.findOne({
            _id: locationId,
            companyId
        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found."
            });
        }

        const job = await Job.create({
            ...req.body,
            companyId
        });

        await Company.findByIdAndUpdate(companyId, {
            $inc: { jobsCount: 1 }
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully.",
            data: job
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create job."
        });

    }

};


// GET ALL JOBS
exports.getJobs = async (req, res) => {

    try {

        const filter = { companyId: req.company.id };

        const baseQuery = () =>
            Job.find(filter)
                .populate("companyId", "companyName logo")
                .populate("departmentId", "name")
                .populate("locationId", "name city country")
                .sort({ createdAt: -1 });

        // Pagination is opt-in: callers that pass no page/limit (e.g. the
        // applications job filter) keep receiving the full list.
        const hasPagination =
            req.query.page !== undefined || req.query.limit !== undefined;

        if (!hasPagination) {

            const jobs = await baseQuery();

            return res.status(200).json({
                success: true,
                data: jobs,
            });

        }

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

        const skip = (page - 1) * limit;

        const [jobs, total] = await Promise.all([
            baseQuery().skip(skip).limit(limit),
            Job.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: jobs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs."
        });

    }

};


// GET JOB BY ID
exports.getJobById = async (req, res) => {

    try {

        const job = await Job.findOne({
            _id: req.params.id,
            companyId: req.company.id
        })

        .populate("departmentId", "name")

        .populate("locationId", "name city state country type");

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


// UPDATE JOB
exports.updateJob = async (req, res) => {

    try {

        const job = await Job.findOneAndUpdate(

            {
                _id: req.params.id,
                companyId: req.company.id
            },

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!job) {

            return res.status(404).json({
                success: false,
                message: "Job not found."
            });

        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully.",
            data: job
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update job."
        });

    }

};


// DELETE JOB
exports.deleteJob = async (req, res) => {

    try {

        const job = await Job.findOneAndDelete({

            _id: req.params.id,

            companyId: req.company.id

        });

        if (!job) {

            return res.status(404).json({

                success: false,

                message: "Job not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Job deleted successfully."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to delete job."

        });

    }

};


// PUBLISH JOB
exports.publishJob = async (req, res) => {

    try {

        const job = await Job.findOneAndUpdate(

            {
                _id: req.params.id,
                companyId: req.company.id
            },

            {
                status: "Published"
            },

            {
                new: true
            }

        );

        if (!job) {

            return res.status(404).json({

                success: false,

                message: "Job not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Job published successfully.",

            data: job

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to publish job."

        });

    }

};


// CLOSE JOB
exports.closeJob = async (req, res) => {

    try {

        const job = await Job.findOneAndUpdate(

            {
                _id: req.params.id,
                companyId: req.company.id
            },

            {
                status: "Closed"
            },

            {
                new: true
            }

        );

        if (!job) {

            return res.status(404).json({

                success: false,

                message: "Job not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Job closed successfully.",

            data: job

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to close job."

        });

    }

};


// ARCHIVE JOB
exports.archiveJob = async (req, res) => {

    try {

        const job = await Job.findOneAndUpdate(

            {
                _id: req.params.id,
                companyId: req.company.id
            },

            {
                status: "Archived"
            },

            {
                new: true
            }

        );

        if (!job) {

            return res.status(404).json({

                success: false,

                message: "Job not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Job archived successfully.",

            data: job

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to archive job."

        });

    }

};
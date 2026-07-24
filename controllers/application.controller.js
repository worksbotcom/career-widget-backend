const Application = require("../models/Application");
const Job = require("../models/Job");

const {
    createApplicationValidation,
    updateApplicationStatusValidation,
} = require("../validations/application.validation");

// Proxy download resume for company (sets Content-Disposition)
exports.downloadApplicationResume = async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            companyId: req.company._id,
        });

        if (!application || !application.resumeData) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }

        const filename = application.resumeFilename || "resume";

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", application.resumeMimeType || "application/octet-stream");
        res.send(application.resumeData);

    } catch (err) {
        console.error("downloadApplicationResume error:", err);
        return res.status(500).json({ success: false, message: "Failed to download resume." });
    }
};

/*
|--------------------------------------------------------------------------
| Apply For Job
|--------------------------------------------------------------------------
*/

exports.applyForJob = async (req, res) => {

    try {

        const { error } = createApplicationValidation(req.body);

        if (error) {

            return res.status(400).json({

                success: false,

                message: error.details[0].message,

            });

        }

        const job = await Job.findById(req.body.jobId);

        if (!job) {

            return res.status(404).json({

                success: false,

                message: "Job not found.",

            });

        }

        const exists = await Application.findOne({

            jobId: req.body.jobId,

            email: req.body.email,

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "You have already applied for this job.",

            });

        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required."
            });
        }

        const application = await Application.create({
            ...req.body,
            companyId: job.companyId,
            resumeData: req.file.buffer,
            resumeMimeType: req.file.mimetype,
            resumeFilename: req.file.originalname || "resume"
        });
        
        return res.status(201).json({

            success: true,

            message: "Application submitted successfully.",

            data: application,

        });

    } catch (err) {

        console.error("applyForJob error:", err);

        return res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| Get All Applications
|--------------------------------------------------------------------------
*/

exports.getApplications = async (req, res) => {

    try {

        const { jobId, status } = req.query;

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

        const limit = Math.max(parseInt(req.query.limit, 10) || 15, 1);

        const skip = (page - 1) * limit;

        const filter = { companyId: req.company._id };

        if (jobId) filter.jobId = jobId;

        if (status) filter.status = status;

        const [applications, total] = await Promise.all([

            Application.find(filter)

                .select("-resumeData")

                .populate("jobId", "title")

                .sort({ createdAt: -1 })

                .skip(skip)

                .limit(limit),

            Application.countDocuments(filter),

        ]);

        res.json({

            success: true,

            data: applications,

            pagination: {

                total,

                page,

                limit,

                totalPages: Math.ceil(total / limit),

                hasMore: page * limit < total,

            },

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| Export Applications (CSV / Excel) — respects jobId & status filters
|--------------------------------------------------------------------------
*/

exports.exportApplications = async (req, res) => {

    try {

        const { jobId, status } = req.query;

        const filter = { companyId: req.company._id };

        if (jobId) filter.jobId = jobId;

        if (status) filter.status = status;

        const applications = await Application.find(filter)

            .select("-resumeData")

            .populate("jobId", "title")

            .sort({ createdAt: -1 });

        const toDate = (value) =>
            value ? new Date(value).toISOString().slice(0, 10) : "";

        const columns = [
            { header: "First Name", value: (a) => a.firstName },
            { header: "Last Name", value: (a) => a.lastName },
            { header: "Email", value: (a) => a.email },
            { header: "Phone", value: (a) => a.phone },
            { header: "Job", value: (a) => a.jobId?.title || "" },
            { header: "Status", value: (a) => a.status },
            { header: "Experience (Years)", value: (a) => a.experience },
            { header: "Current Location", value: (a) => a.currentLocation },
            { header: "Current Company", value: (a) => a.currentCompany },
            { header: "Current Designation", value: (a) => a.currentDesignation },
            { header: "Current CTC", value: (a) => a.currentCTC },
            { header: "Expected CTC", value: (a) => a.expectedCTC },
            { header: "Notice Period", value: (a) => a.noticePeriod },
            { header: "LinkedIn", value: (a) => a.linkedin },
            { header: "Portfolio", value: (a) => a.portfolio },
            { header: "Available From", value: (a) => toDate(a.availableFrom) },
            { header: "Applied On", value: (a) => toDate(a.createdAt) },
        ];

        const escape = (val) => {
            const str = val === null || val === undefined ? "" : String(val);
            return `"${str.replace(/"/g, '""')}"`;
        };

        const lines = [
            columns.map((c) => escape(c.header)).join(","),
            ...applications.map((a) =>
                columns.map((c) => escape(c.value(a))).join(",")
            ),
        ];

        // Prepend a UTF-8 BOM so Excel opens the file with correct encoding.
        const csv = "﻿" + lines.join("\r\n");

        const stamp = new Date().toISOString().slice(0, 10);

        res.setHeader("Content-Type", "text/csv; charset=utf-8");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="applications-${stamp}.csv"`
        );

        res.send(csv);

    } catch (err) {

        console.error("exportApplications error:", err);

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| Get Single Application
|--------------------------------------------------------------------------
*/

exports.getApplicationById = async (req, res) => {

    try {

        const application = await Application.findOne({

            _id: req.params.id,

            companyId: req.company._id,

        }).select("-resumeData").populate("jobId");

        if (!application) {

            return res.status(404).json({

                success: false,

                message: "Application not found.",

            });

        }

        res.json({

            success: true,

            data: application,

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| Get Applications By Job
|--------------------------------------------------------------------------
*/

exports.getApplicationsByJob = async (req, res) => {

    try {

        const applications = await Application.find({

            companyId: req.company._id,

            jobId: req.params.jobId,

        }).select("-resumeData").sort({ createdAt: -1 });

        res.json({

            success: true,

            data: applications,

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| Update Application Status
|--------------------------------------------------------------------------
*/

exports.updateApplicationStatus = async (req, res) => {

    try {

        const { error } = updateApplicationStatusValidation(req.body);

        if (error) {

            return res.status(400).json({

                success: false,

                message: error.details[0].message,

            });

        }

        const application = await Application.findOne({

            _id: req.params.id,

            companyId: req.company._id,

        });

        if (!application) {

            return res.status(404).json({

                success: false,

                message: "Application not found.",

            });

        }

        application.status = req.body.status;

        application.recruiterNotes = req.body.recruiterNotes || "";

        await application.save();

        res.json({

            success: true,

            message: "Application updated successfully.",

            data: application,

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| Delete Application
|--------------------------------------------------------------------------
*/

exports.deleteApplication = async (req, res) => {

    try {

        const application = await Application.findOne({

            _id: req.params.id,

            companyId: req.company._id,

        });

        if (!application) {

            return res.status(404).json({

                success: false,

                message: "Application not found.",

            });

        }

        await application.deleteOne();

        res.json({

            success: true,

            message: "Application deleted successfully.",

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};
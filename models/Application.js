const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true,
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        currentLocation: {
            type: String,
            default: "",
        },

        resumeData: {
            type: Buffer,
            required: true,
        },

        resumeMimeType: {
            type: String,
            default: "application/octet-stream",
        },

        resumeFilename: {
            type: String,
            required: true,
        },

        coverLetter: {
            type: String,
            default: "",
        },

        linkedin: {
            type: String,
            default: "",
        },

        portfolio: {
            type: String,
            default: "",
        },

        currentCompany: {
            type: String,
            default: "",
        },

        currentDesignation: {
            type: String,
            default: "",
        },

        experience: {
            type: Number,
            default: 0,
        },

        currentCTC: {
            type: Number,
            default: 0,
        },

        expectedCTC: {
            type: Number,
            default: 0,
        },

        noticePeriod: {
            type: String,
            default: "",
        },

        availableFrom: {
            type: Date,
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Shortlisted",
                "Interview",
                "Offered",
                "Hired",
                "Rejected",
                "Withdrawn",
            ],
            default: "Applied",
        },

        recruiterNotes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Application", applicationSchema);
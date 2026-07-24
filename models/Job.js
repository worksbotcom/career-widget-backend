const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(

    {

        companyId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Company",

            required: true

        },

        departmentId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Department",

            required: true

        },

        locationId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Location",

            required: true

        },

        title: {

            type: String,

            required: true,

            trim: true

        },

        employmentType: {

            type: String,

            enum: [

                "Full-time",

                "Part-time",

                "Contract",

                "Internship",

                "Temporary"

            ],

            required: true

        },

        experienceLevel: {

            type: String,

            enum: [

                "Fresher",

                "Junior",

                "Mid",

                "Senior",

                "Lead"

            ],

            required: true

        },

        degree: {

            type: String,

            trim: true

        },

        ageLimit: {

            type: String,

            trim: true

        },

        gender: {

            type: String,

            trim: true

        },

        salaryMin: {

            type: Number,

            default: 0

        },

        salaryMax: {

            type: Number,

            default: 0

        },

        currency: {

            type: String,

            default: "USD"

        },

        description: {

            type: String,

            required: true

        },

        requirements: [

            {

                type: String

            }

        ],

        responsibilities: [

            {

                type: String

            }

        ],

        benefits: [

            {

                type: String

            }

        ],

        skills: [

            {

                type: String

            }

        ],

        applicationDeadline: {

            type: Date

        },

        openings: {

            type: Number,

            default: 1

        },

        status: {

            type: String,

            enum: [

                "Draft",

                "Published",

                "Closed",

                "Archived"

            ],

            default: "Draft"

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model(
    "Job",
    jobSchema
);
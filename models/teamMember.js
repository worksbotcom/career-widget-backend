const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(

    {

        companyId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Company",

            required: true

        },

        name: {

            type: String,

            required: true,

            trim: true

        },

        email: {

            type: String,

            required: true,

            lowercase: true,

            trim: true

        },

        role: {

            type: String,

            enum: [

                "Admin",

                "Recruiter",

                "Hiring Manager"

            ],

            default: "Recruiter"

        },

        permissions: {

            jobs: {

                type: Boolean,

                default: true

            },

            candidates: {

                type: Boolean,

                default: false

            },

            analytics: {

                type: Boolean,

                default: false

            },

            settings: {

                type: Boolean,

                default: false

            }

        },

        status: {

            type: String,

            enum: [

                "Pending",

                "Active",

                "Inactive"

            ],

            default: "Pending"

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model(
    "TeamMember",
    teamMemberSchema
);
const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(

    {

        name: {

            type: String,

            required: true,

            unique: true,

            trim: true

        },

        description: {

            type: String,

            default: ""

        },

        monthlyPrice: {

            type: Number,

            required: true,

            default: 0

        },

        yearlyPrice: {

            type: Number,

            required: true,

            default: 0

        },

        maxJobs: {

            type: Number,

            required: true,

            default: 5

        },

        maxDepartments: {

            type: Number,

            required: true,

            default: 5

        },

        maxLocations: {

            type: Number,

            required: true,

            default: 5

        },

        maxTeamMembers: {

            type: Number,

            required: true,

            default: 2

        },

        maxApplications: {

            type: Number,

            required: true,

            default: 100

        },

        widgetEnabled: {

            type: Boolean,

            default: true

        },

        analyticsEnabled: {

            type: Boolean,

            default: false

        },

        apiAccess: {

            type: Boolean,

            default: false

        },

        customBranding: {

            type: Boolean,

            default: false

        },

        prioritySupport: {

            type: Boolean,

            default: false

        },

        isActive: {

            type: Boolean,

            default: true

        },

        displayOrder: {

            type: Number,

            default: 1

        },

        createdBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "SuperAdmin",

            default: null

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model("Plan", planSchema);
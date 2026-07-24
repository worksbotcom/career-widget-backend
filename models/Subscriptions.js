const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(

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

        price: {
            type: Number,
            required: true,
            default: 0
        },

        billingCycle: {
            type: String,
            enum: ["Monthly", "Yearly"],
            default: "Monthly"
        },

        currency: {
            type: String,
            default: "USD"
        },

        maxJobs: {
            type: Number,
            default: 5
        },

        maxRecruiters: {
            type: Number,
            default: 1
        },

        widgetBranding: {
            type: Boolean,
            default: true
        },

        apiAccess: {
            type: Boolean,
            default: true
        },

        analytics: {
            type: Boolean,
            default: false
        },

        prioritySupport: {
            type: Boolean,
            default: false
        },

        customDomain: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        }

    },

    {
        timestamps: true
    }

);

module.exports = mongoose.model(
    "Subscription",
    subscriptionSchema
);
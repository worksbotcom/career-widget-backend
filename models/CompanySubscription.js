const mongoose = require("mongoose");

const companySubscriptionSchema = new mongoose.Schema(

    {

        company: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Company",

            required: true,

            unique: true

        },

        subscription: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Subscription",

            required: true

        },

        billingCycle: {

            type: String,

            enum: [

                "Monthly",

                "Yearly"

            ],

            default: "Monthly"

        },

        status: {

            type: String,

            enum: [

                "Pending",

                "Trial",

                "Active",

                "Expired",

                "Cancelled"

            ],

            default: "Pending"

        },

        paymentStatus: {

            type: String,

            enum: [

                "Pending",

                "Paid",

                "Failed",

                "Refunded"

            ],

            default: "Pending"

        },

        paymentProvider: {

            type: String,

            enum: [

                "None",

                "Razorpay",

                "Stripe"

            ],

            default: "None"

        },

        transactionId: {

            type: String,

            default: ""

        },

        amountPaid: {

            type: Number,

            default: 0

        },

        currency: {

            type: String,

            default: "USD"

        },

        startDate: {

            type: Date,

            default: Date.now

        },

        endDate: {

            type: Date,

            required: true

        },

        autoRenew: {

            type: Boolean,

            default: true

        },

        cancelledAt: {

            type: Date,

            default: null

        },

        notes: {

            type: String,

            default: ""

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model(

    "CompanySubscription",

    companySubscriptionSchema

);
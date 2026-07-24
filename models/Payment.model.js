const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(

    {

        company: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Company",

            required: true

        },

        subscription: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Subscription",

            required: true

        },

        companySubscription: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "CompanySubscription",

            default: null

        },

        razorpayOrderId: {

            type: String,

            required: true

        },

        razorpayPaymentId: {

            type: String,

            default: ""

        },

        razorpaySignature: {

            type: String,

            default: ""

        },

        amount: {

            type: Number,

            required: true

        },

        currency: {

            type: String,

            default: "INR"

        },

        paymentMethod: {

            type: String,

            default: ""

        },

        status: {

            type: String,

            enum: [

                "Pending",

                "Paid",

                "Failed",

                "Refunded"

            ],

            default: "Pending"

        },

        invoiceNumber: {

            type: String,

            default: ""

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model(

    "Payment",

    paymentSchema

);
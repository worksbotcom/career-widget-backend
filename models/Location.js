const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(

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

        city: {

            type: String,

            required: true,

            trim: true

        },

        state: {

            type: String,

            default: ""

        },

        country: {

            type: String,

            required: true

        },

        type: {

            type: String,

            enum: ["Onsite", "Remote", "Hybrid"],

            default: "Onsite"

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
    "Location",
    locationSchema
);
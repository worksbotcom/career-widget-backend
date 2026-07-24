const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    token: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "RefreshToken",
    refreshTokenSchema
);
const mongoose = require("mongoose");

const superadminLogSchema = new mongoose.Schema({

    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SuperAdmin",
        required: true
    },

    adminEmail: {
        type: String,
        required: true
    },

    action: {
        type: String,
        required: true
    },

    companyId: {
        type: String
    },

    companyName: {
        type: String
    },

    details: {
        type: Object,
        default: {}
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("AdminLog", superadminLogSchema);
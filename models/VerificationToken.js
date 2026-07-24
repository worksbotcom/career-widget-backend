const mongoose = require("mongoose");

const verificationTokenSchema = new mongoose.Schema({

    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },

    token:String,

    expiresAt:Date

},{
    timestamps:true
});

module.exports = mongoose.model("VerificationToken",verificationTokenSchema);
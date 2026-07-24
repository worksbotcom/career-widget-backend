const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({

    companyId:{
        type:String,
        unique:true
    },

    companyName:{
        type:String,
        required:true
    },

    website:String,

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    logo:{
        type:String,
        default:""
    },

    industry:String,

    companySize:String,

    headquarters:String,

    description:String,

    socialLinks: {
        linkedin: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        },
        facebook: {
            type: String,
            default: ""
        },
        instagram: {
            type: String,
            default: ""
        },
        youtube: {
            type: String,
            default: ""
        },
        github: {
            type: String,
            default: ""
        }
    },

    subscription: {
    type: String,
    default: "Free"
    },

    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null
    },

    jobsCount: {
        type: Number,
        default: 0
    },

    apiKey:String,

    isVerified:{
        type:Boolean,
        default:false
    },

    lastVerificationEmailSentAt: {
        type: Date,
        default: null
    },

    isActive:{
        type:Boolean,
        default:true
    }
    

},

{
    timestamps:true
});

module.exports = mongoose.model("Company",companySchema);
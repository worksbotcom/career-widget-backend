const Subscription = require("../models/Subscriptions");

const { validationResult } = require("express-validator");
const Company = require("../models/Company");
const superadminLogger = require("../utils/superadminLogger");

exports.createSubscription = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json(errors.array());

        }

        const {

            name,

            description,

            price,

            billingCycle,

            currency,

            maxJobs,

            maxRecruiters,

            widgetBranding,

            apiAccess,

            analytics,

            prioritySupport,

            customDomain

        } = req.body;

        const exists = await Subscription.findOne({
            name
        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Subscription already exists."

            });

        }

        const subscription = await Subscription.create({

            name,

            description,

            price,

            billingCycle,

            currency,

            maxJobs,

            maxRecruiters,

            widgetBranding,

            apiAccess,

            analytics,

            prioritySupport,

            customDomain

        });

        await superadminLogger({
        admin: req.admin,
        action: "Created Subscription",
        details: {
            plan: subscription.name
        }
    });

        return res.status(201).json({

            success: true,

            message: "Subscription created successfully.",

            data: subscription

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getSubscriptions = async (req, res) => {

    try {

        const subscriptions = await Subscription.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getSubscriptionById = async (req, res) => {

    try {

        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {

            return res.status(404).json({
                success: false,
                message: "Subscription not found."
            });

        }

        return res.status(200).json({
            success: true,
            data: subscription
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.updateSubscription = async (req, res) => {

    try {

        const subscription = await Subscription.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                returnDocument: "after",
                runValidators: true
            }

        );

        await superadminLogger({
            admin: req.admin,
            action: "Updated Subscription",
            details: {
                plan: subscription.name
            }
        });

        if (!subscription) {

            return res.status(404).json({
                success: false,
                message: "Subscription not found."
            });

        }

        return res.status(200).json({

            success: true,

            message: "Subscription updated.",

            data: subscription

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.updateSubscriptionStatus = async (req, res) => {

    try {

        const { isActive } = req.body;

        const subscription = await Subscription.findByIdAndUpdate(

            req.params.id,

            {
                isActive
            },

            {
                returnDocument: "after"
            }

        );

        if (!subscription) {

            return res.status(404).json({

                success: false,

                message: "Subscription not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Subscription status updated.",

            data: subscription

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.deleteSubscription = async (req, res) => {

    try {

        const subscription = await Subscription.findByIdAndDelete(req.params.id);

        await superadminLogger({
            admin: req.admin,
            action: "Deleted Subscription",
            details: {
                plan: subscription.name
            }
        });

        if (!subscription) {

            return res.status(404).json({
                success: false,
                message: "Subscription not found."
            });

        }

        return res.status(200).json({

            success: true,
            message: "Subscription deleted successfully."

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

exports.subscriptionAnalytics = async (req, res) => {

    try {

        const analytics = await Company.aggregate([

            {

                $lookup: {

                    from: "subscriptions",

                    localField: "subscription",

                    foreignField: "_id",

                    as: "subscription"

                }

            },

            {

                $unwind: "$subscription"

            },

            {

                $group: {

                    _id: "$subscription.name",

                    companies: {

                        $sum: 1

                    }

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            data: analytics

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
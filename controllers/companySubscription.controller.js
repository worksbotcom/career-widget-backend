const CompanySubscription = require("../models/CompanySubscription");
const Subscription = require("../models/Subscriptions");
const Company = require("../models/Company");
const { validationResult } = require("express-validator");

// Subscribe Company
exports.subscribeCompany = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors: errors.array()

            });

        }

        const {

            company,

            subscription,

            billingCycle

        } = req.body;

        const companyExists = await Company.findById(company);

        if (!companyExists) {

            return res.status(404).json({

                success: false,

                message: "Company not found."

            });

        }

        const plan = await Subscription.findById(subscription);

        if (!plan) {

            return res.status(404).json({

                success: false,

                message: "Subscription plan not found."

            });

        }

        const exists = await CompanySubscription.findOne({

            company

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Company already has a subscription."

            });

        }

        const startDate = new Date();

        const endDate = new Date(startDate);

        if (billingCycle === "Yearly") {

            endDate.setFullYear(endDate.getFullYear() + 1);

        } else {

            endDate.setMonth(endDate.getMonth() + 1);

        }

        const companySubscription = await CompanySubscription.create({

            company,

            subscription,

            billingCycle,

            amountPaid: plan.price,

            currency: plan.currency,

            paymentStatus: "Pending",

            paymentProvider: "None",

            status: "Pending",

            startDate,

            endDate

        });

        return res.status(201).json({

            success: true,

            message: "Company subscribed successfully.",

            data: companySubscription

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Get Company Subscription
exports.getCompanySubscription = async (req, res) => {

    try {

        const subscription = await CompanySubscription
            .findOne({
                company: req.company._id
            })
            .populate("company")
            .populate("subscription");

        if (!subscription) {

            return res.status(200).json({

                success: true,

                data: null,

                message: "No active subscription found."

            });

        }

        return res.status(200).json({

            success: true,

            data: subscription

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Upgrade / Change Plan
exports.changePlan = async (req, res) => {

    try {

        const { subscription } = req.body;

        const plan = await Subscription.findById(subscription);

        if (!plan) {

            return res.status(404).json({

                success: false,

                message: "Subscription plan not found."

            });

        }

        const companySubscription = await CompanySubscription.findOne({

            company: req.params.companyId

        });

        if (!companySubscription) {

            return res.status(404).json({

                success: false,

                message: "Company subscription not found."

            });

        }

        companySubscription.subscription = subscription;

        companySubscription.amountPaid = plan.price;

        companySubscription.currency = plan.currency;

        await companySubscription.save();

        return res.status(200).json({

            success: true,

            message: "Plan changed successfully.",

            data: companySubscription

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Renew Subscription
exports.renewSubscription = async (req, res) => {

    try {

        const subscription = await CompanySubscription.findOne({

            company: req.params.companyId

        });

        if (!subscription) {

            return res.status(404).json({

                success: false,

                message: "Subscription not found."

            });

        }

        const endDate = new Date(subscription.endDate);

        if (subscription.billingCycle === "Yearly") {

            endDate.setFullYear(endDate.getFullYear() + 1);

        } else {

            endDate.setMonth(endDate.getMonth() + 1);

        }

        subscription.endDate = endDate;

        subscription.status = "Active";

        subscription.paymentStatus = "Paid";

        await subscription.save();

        return res.status(200).json({

            success: true,

            message: "Subscription renewed successfully.",

            data: subscription

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {

    try {

        const subscription = await CompanySubscription.findOne({

            company: req.params.companyId

        });

        if (!subscription) {

            return res.status(404).json({

                success: false,

                message: "Subscription not found."

            });

        }

        subscription.status = "Cancelled";

        subscription.cancelledAt = new Date();

        subscription.autoRenew = false;

        await subscription.save();

        return res.status(200).json({

            success: true,

            message: "Subscription cancelled successfully.",

            data: subscription

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
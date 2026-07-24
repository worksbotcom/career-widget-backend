const mongoose = require("mongoose");
const Subscription = require("../models/Subscriptions");

const seedSubscriptions = async () => {
    console.log("Ready State:", mongoose.connection.readyState);

    console.log("Checking subscriptions...");

    const count = await Subscription.countDocuments();

    console.log("Existing plans:", count);

    if (count > 0) {
        console.log("Subscriptions already seeded.");
        return;
    }

    await Subscription.insertMany([
        {
            name: "Free",
            description: "Free Plan",
            price: 0,
            billingCycle: "Monthly",
            currency: "USD",
            maxJobs: 5,
            maxRecruiters: 1,
            widgetBranding: true,
            apiAccess: true,
        },
        {
            name: "Basic",
            description: "Basic Plan",
            price: 29,
            billingCycle: "Monthly",
            currency: "USD",
            maxJobs: 15,
            maxRecruiters: 3,
            analytics: true,
        },
        {
            name: "Pro",
            description: "Professional Plan",
            price: 99,
            billingCycle: "Monthly",
            currency: "USD",
            maxJobs: 40,
            maxRecruiters: 10,
            analytics: true,
            prioritySupport: true,
        },
        {
            name: "Enterprise",
            description: "Enterprise Plan",
            price: 499,
            billingCycle: "Monthly",
            currency: "USD",
            maxJobs: 400,
            maxRecruiters:20,
            analytics: true,
            prioritySupport: true,
            customDomain: true,
        },
    ]);

    console.log("Subscription plans seeded.");
};

module.exports = seedSubscriptions;
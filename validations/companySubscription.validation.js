const { body } = require("express-validator");

exports.subscribeCompanyValidation = [

    body("company")
        .notEmpty()
        .withMessage("Company is required.")
        .isMongoId()
        .withMessage("Invalid Company ID."),

    body("subscription")
        .notEmpty()
        .withMessage("Subscription plan is required.")
        .isMongoId()
        .withMessage("Invalid Subscription ID."),

    body("billingCycle")
        .optional()
        .isIn(["Monthly", "Yearly"])
        .withMessage("Billing cycle must be Monthly or Yearly.")

];

exports.updateSubscriptionValidation = [

    body("subscription")
        .optional()
        .isMongoId()
        .withMessage("Invalid Subscription ID."),

    body("billingCycle")
        .optional()
        .isIn(["Monthly", "Yearly"])
        .withMessage("Billing cycle must be Monthly or Yearly."),

    body("status")
        .optional()
        .isIn([
            "Pending",
            "Trial",
            "Active",
            "Expired",
            "Cancelled"
        ])
        .withMessage("Invalid subscription status."),

    body("paymentStatus")
        .optional()
        .isIn([
            "Pending",
            "Paid",
            "Failed",
            "Refunded"
        ])
        .withMessage("Invalid payment status."),

    body("paymentProvider")
        .optional()
        .isIn([
            "None",
            "Razorpay",
            "Stripe"
        ])
        .withMessage("Invalid payment provider."),

    body("autoRenew")
        .optional()
        .isBoolean()
        .withMessage("Auto renew must be true or false.")

];
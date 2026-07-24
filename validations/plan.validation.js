const { body } = require("express-validator");

exports.createPlanValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Plan name is required."),

    body("description")
        .optional()
        .trim(),

    body("monthlyPrice")
        .isFloat({ min: 0 })
        .withMessage("Monthly price must be 0 or greater."),

    body("yearlyPrice")
        .isFloat({ min: 0 })
        .withMessage("Yearly price must be 0 or greater."),

    body("maxJobs")
        .isInt({ min: -1 })
        .withMessage("Max jobs must be -1 (Unlimited) or greater."),

    body("maxDepartments")
        .isInt({ min: -1 })
        .withMessage("Max departments must be -1 (Unlimited) or greater."),

    body("maxLocations")
        .isInt({ min: -1 })
        .withMessage("Max locations must be -1 (Unlimited) or greater."),

    body("maxTeamMembers")
        .isInt({ min: -1 })
        .withMessage("Max team members must be -1 (Unlimited) or greater."),

    body("maxApplications")
        .isInt({ min: -1 })
        .withMessage("Max applications must be -1 (Unlimited) or greater."),

    body("widgetEnabled")
        .optional()
        .isBoolean()
        .withMessage("Widget Enabled must be true or false."),

    body("analyticsEnabled")
        .optional()
        .isBoolean()
        .withMessage("Analytics Enabled must be true or false."),

    body("apiAccess")
        .optional()
        .isBoolean()
        .withMessage("API Access must be true or false."),

    body("customBranding")
        .optional()
        .isBoolean()
        .withMessage("Custom Branding must be true or false."),

    body("prioritySupport")
        .optional()
        .isBoolean()
        .withMessage("Priority Support must be true or false."),

    body("displayOrder")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Display order must be at least 1.")

];

exports.updatePlanValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Plan name cannot be empty."),

    body("description")
        .optional()
        .trim(),

    body("monthlyPrice")
        .optional()
        .isFloat({ min: 0 }),

    body("yearlyPrice")
        .optional()
        .isFloat({ min: 0 }),

    body("maxJobs")
        .optional()
        .isInt({ min: -1 }),

    body("maxDepartments")
        .optional()
        .isInt({ min: -1 }),

    body("maxLocations")
        .optional()
        .isInt({ min: -1 }),

    body("maxTeamMembers")
        .optional()
        .isInt({ min: -1 }),

    body("maxApplications")
        .optional()
        .isInt({ min: -1 }),

    body("widgetEnabled")
        .optional()
        .isBoolean(),

    body("analyticsEnabled")
        .optional()
        .isBoolean(),

    body("apiAccess")
        .optional()
        .isBoolean(),

    body("customBranding")
        .optional()
        .isBoolean(),

    body("prioritySupport")
        .optional()
        .isBoolean(),

    body("isActive")
        .optional()
        .isBoolean(),

    body("displayOrder")
        .optional()
        .isInt({ min: 1 })

];
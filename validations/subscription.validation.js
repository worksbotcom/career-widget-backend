const { body } = require("express-validator");

exports.createSubscriptionValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Plan name is required"),

    body("price")
        .optional({ values: ["null", "", undefined] })
        .isNumeric()
        .withMessage("Price must be numeric"),

    body("billingCycle")
        .optional({ values: ["null", "", undefined] })
        .isIn(["Monthly", "Yearly"])
        .withMessage("Invalid billing cycle"),

    body("maxJobs")
        .optional({ values: ["null", "", undefined] })
        .isNumeric()
        .withMessage("Invalid job limit"),

    body("maxRecruiters")
        .optional({ values: ["null", "", undefined] })
        .isNumeric()
        .withMessage("Invalid recruiter limit")

];
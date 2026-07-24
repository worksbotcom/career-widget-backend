const { body } = require("express-validator");

exports.createTeamMemberValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("role")
        .isIn([
            "Admin",
            "Recruiter",
            "Hiring Manager"
        ])
        .withMessage("Invalid role")

];

exports.updateTeamMemberValidation = [

    body("name")
        .optional()
        .trim(),

    body("email")
        .optional()
        .isEmail(),

    body("role")
        .optional()
        .isIn([
            "Admin",
            "Recruiter",
            "Hiring Manager"
        ])

];
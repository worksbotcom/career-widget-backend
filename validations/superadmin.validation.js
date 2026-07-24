const { body } = require("express-validator");

exports.superadminLoginValidation = [

    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")

];
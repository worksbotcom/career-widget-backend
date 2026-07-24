const {body}=require("express-validator");

exports.registerValidation=[

body("companyName")
.notEmpty()
.withMessage("Company Name required"),

body("email")
.isEmail()
.withMessage("Invalid Email"),

body("password")
.isLength({min:8})
.withMessage("Password minimum 8 characters")

];

exports.loginValidation = [

    body("email")
        .isEmail()
        .withMessage("Invalid Email"),

    body("password")
        .notEmpty()
        .withMessage("Password required")

];
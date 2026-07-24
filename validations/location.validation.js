const { body } = require("express-validator");

exports.createLocationValidation = [

    body("name")
        .notEmpty()
        .withMessage("Location name is required"),

    body("city")
        .notEmpty()
        .withMessage("City is required"),

    body("country")
        .notEmpty()
        .withMessage("Country is required"),

    body("type")
        .isIn(["Onsite", "Remote", "Hybrid"])
        .withMessage("Invalid location type")

];

exports.updateLocationValidation = [

    body("name")
        .optional()
        .notEmpty(),

    body("city")
        .optional()
        .notEmpty(),

    body("country")
        .optional()
        .notEmpty(),

    body("type")
        .optional()
        .isIn(["Onsite", "Remote", "Hybrid"])

];
const { body } = require("express-validator");

exports.createDepartmentValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Department name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Department name must be between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters")

];


exports.updateDepartmentValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Department name cannot be empty")
        .isLength({ min: 2, max: 100 })
        .withMessage("Department name must be between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be true or false")

];
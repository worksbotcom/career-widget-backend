const { body } = require("express-validator");

exports.createJobValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Job title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Job title must be between 3 and 100 characters"),

    body("departmentId")
        .notEmpty()
        .withMessage("Department is required")
        .isMongoId()
        .withMessage("Invalid department ID"),

    body("locationId")
        .notEmpty()
        .withMessage("Location is required")
        .isMongoId()
        .withMessage("Invalid location ID"),

    body("employmentType")
        .notEmpty()
        .withMessage("Employment type is required")
        .isIn([
            "Full-time",
            "Part-time",
            "Contract",
            "Internship",
            "Temporary"
        ])
        .withMessage("Invalid employment type"),

    body("experienceLevel")
        .notEmpty()
        .withMessage("Experience level is required")
        .isIn([
            "Fresher",
            "Junior",
            "Mid",
            "Senior",
            "Lead"
        ])
        .withMessage("Invalid experience level"),

    body("degree")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Degree must be at most 100 characters"),

    body("ageLimit")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Age limit must be at most 50 characters"),

    body("gender")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Gender must be at most 50 characters"),

    body("salaryMin")
        .optional()
        .isNumeric()
        .withMessage("Minimum salary must be a number"),

    body("salaryMax")
        .optional()
        .isNumeric()
        .withMessage("Maximum salary must be a number"),

    body("currency")
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage("Currency must be a 3-letter code"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Job description is required"),

    body("requirements")
        .optional()
        .isArray()
        .withMessage("Requirements must be an array"),

    body("responsibilities")
        .optional()
        .isArray()
        .withMessage("Responsibilities must be an array"),

    body("benefits")
        .optional()
        .isArray()
        .withMessage("Benefits must be an array"),

    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array"),

    body("applicationDeadline")
        .optional()
        .isISO8601()
        .withMessage("Invalid application deadline"),

    body("openings")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Openings must be at least 1"),

    body("status")
        .optional()
        .isIn([
            "Draft",
            "Published",
            "Closed",
            "Archived"
        ])
        .withMessage("Invalid job status")

];



exports.updateJobValidation = [

    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Job title must be between 3 and 100 characters"),

    body("departmentId")
        .optional()
        .isMongoId()
        .withMessage("Invalid department ID"),

    body("locationId")
        .optional()
        .isMongoId()
        .withMessage("Invalid location ID"),

    body("employmentType")
        .optional()
        .isIn([
            "Full-time",
            "Part-time",
            "Contract",
            "Internship",
            "Temporary"
        ])
        .withMessage("Invalid employment type"),

    body("experienceLevel")
        .optional()
        .isIn([
            "Fresher",
            "Junior",
            "Mid",
            "Senior",
            "Lead"
        ])
        .withMessage("Invalid experience level"),

    body("degree")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Degree must be at most 100 characters"),

    body("ageLimit")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Age limit must be at most 50 characters"),

    body("gender")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Gender must be at most 50 characters"),

    body("salaryMin")
        .optional()
        .isNumeric()
        .withMessage("Minimum salary must be a number"),

    body("salaryMax")
        .optional()
        .isNumeric()
        .withMessage("Maximum salary must be a number"),

    body("currency")
        .optional()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage("Currency must be a 3-letter code"),

    body("description")
        .optional()
        .trim(),

    body("requirements")
        .optional()
        .isArray()
        .withMessage("Requirements must be an array"),

    body("responsibilities")
        .optional()
        .isArray()
        .withMessage("Responsibilities must be an array"),

    body("benefits")
        .optional()
        .isArray()
        .withMessage("Benefits must be an array"),

    body("skills")
        .optional()
        .isArray()
        .withMessage("Skills must be an array"),

    body("applicationDeadline")
        .optional()
        .isISO8601()
        .withMessage("Invalid application deadline"),

    body("openings")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Openings must be at least 1"),

    body("status")
        .optional()
        .isIn([
            "Draft",
            "Published",
            "Closed",
            "Archived"
        ])
        .withMessage("Invalid job status")

];
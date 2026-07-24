const Joi = require("joi");

const createApplicationValidation = (data) => {

    const schema = Joi.object({

        jobId: Joi.string()
            .required()
            .messages({
                "any.required": "Job is required."
            }),

        firstName: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required(),

        lastName: Joi.string()
            .trim()
            .min(2)
            .max(50)
            .required(),

        email: Joi.string()
            .email()
            .required(),

        phone: Joi.string()
            .trim()
            .min(8)
            .max(20)
            .required(),

        currentLocation: Joi.string()
            .allow("")
            .optional(),

        coverLetter: Joi.string()
            .allow("")
            .optional(),

        linkedin: Joi.string()
            .uri()
            .allow("")
            .optional(),

        portfolio: Joi.string()
            .uri()
            .allow("")
            .optional(),

        currentCompany: Joi.string()
            .allow("")
            .optional(),

        currentDesignation: Joi.string()
            .allow("")
            .optional(),

        experience: Joi.number()
            .min(0)
            .optional(),

        currentCTC: Joi.number()
            .min(0)
            .optional(),

        expectedCTC: Joi.number()
            .min(0)
            .optional(),

        noticePeriod: Joi.string()
            .allow("")
            .optional(),

        availableFrom: Joi.date()
            .optional()

    });

    return schema.validate(data);

};

const updateApplicationStatusValidation = (data) => {

    const schema = Joi.object({

        status: Joi.string()
            .valid(
                "Applied",
                "Shortlisted",
                "Interview",
                "Offered",
                "Hired",
                "Rejected",
                "Withdrawn"
            )
            .required(),

        recruiterNotes: Joi.string()
            .allow("")
            .optional()

    });

    return schema.validate(data);

};

module.exports = {

    createApplicationValidation,

    updateApplicationStatusValidation

};
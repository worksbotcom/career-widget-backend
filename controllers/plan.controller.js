const Plan = require("../models/Plan");
const { validationResult } = require("express-validator");

// Create Plan
exports.createPlan = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors: errors.array()

            });

        }

        const existingPlan = await Plan.findOne({

            name: req.body.name

        });

        if (existingPlan) {

            return res.status(400).json({

                success: false,

                message: "Plan already exists."

            });

        }

        const plan = await Plan.create({

            ...req.body,

            createdBy: req.admin?._id || null

        });

        return res.status(201).json({

            success: true,

            message: "Plan created successfully.",

            data: plan

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Get All Plans
exports.getPlans = async (req, res) => {

    try {

        const plans = await Plan
            .find()
            .sort({

                displayOrder: 1,

                createdAt: 1

            });

        return res.status(200).json({

            success: true,

            count: plans.length,

            data: plans

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Get Single Plan
exports.getPlan = async (req, res) => {

    try {

        const plan = await Plan.findById(req.params.id);

        if (!plan) {

            return res.status(404).json({

                success: false,

                message: "Plan not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: plan

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Update Plan
exports.updatePlan = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({

                success: false,

                errors: errors.array()

            });

        }

        const plan = await Plan.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!plan) {

            return res.status(404).json({

                success: false,

                message: "Plan not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Plan updated successfully.",

            data: plan

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Delete Plan
exports.deletePlan = async (req, res) => {

    try {

        const plan = await Plan.findByIdAndDelete(

            req.params.id

        );

        if (!plan) {

            return res.status(404).json({

                success: false,

                message: "Plan not found."

            });

        }

        return res.status(200).json({

            success: true,

            message: "Plan deleted successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
const Department = require("../models/Department");


// CREATE DEPARTMENT

exports.createDepartment = async (req, res) => {

    try {

        const { name, description } = req.body;

        const companyId = req.company.id;

        const exists = await Department.findOne({

            companyId,

            name

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Department already exists."

            });

        }

        const department = await Department.create({

            companyId,

            name,

            description

        });

        res.status(201).json({

            success: true,

            message: "Department created successfully.",

            data: department

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to create department."

        });

    }

};


// GET ALL DEPARTMENTS

exports.getDepartments = async (req, res) => {

    try {

        const companyId = req.company.id;

        const departments = await Department.find({

            companyId

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            data: departments

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch departments."

        });

    }

};


// GET SINGLE DEPARTMENT

exports.getDepartmentById = async (req, res) => {

    try {

        const { id } = req.params;

        const companyId = req.company.id;

        const department = await Department.findOne({

            _id: id,

            companyId

        });

        if (!department) {

            return res.status(404).json({

                success: false,

                message: "Department not found."

            });

        }

        res.status(200).json({

            success: true,

            data: department

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch department."

        });

    }

};


// UPDATE DEPARTMENT

exports.updateDepartment = async (req, res) => {

    try {

        const { id } = req.params;

        const companyId = req.company.id;

        const { name, description, isActive } = req.body;

        const department = await Department.findOneAndUpdate(

            {

                _id: id,

                companyId

            },

            {

                name,

                description,

                isActive

            },

            {

                new: true

            }

        );

        if (!department) {

            return res.status(404).json({

                success: false,

                message: "Department not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Department updated successfully.",

            data: department

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to update department."

        });

    }

};


// DELETE DEPARTMENT

exports.deleteDepartment = async (req, res) => {

    try {

        const { id } = req.params;

        const companyId = req.company.id;

        const department = await Department.findOneAndDelete({

            _id: id,

            companyId

        });

        if (!department) {

            return res.status(404).json({

                success: false,

                message: "Department not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Department deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to delete department."

        });

    }

};
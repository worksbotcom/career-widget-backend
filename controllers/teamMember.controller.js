const TeamMember = require("../models/teamMember");


// CREATE TEAM MEMBER

exports.createTeamMember = async (req, res) => {

    try {

        const companyId = req.company.id;

        const {

            name,

            email,

            role,

            permissions

        } = req.body;

        const exists = await TeamMember.findOne({

            companyId,

            email

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Team member already exists."

            });

        }

        const member = await TeamMember.create({

            companyId,

            name,

            email,

            role,

            permissions

        });

        res.status(201).json({

            success: true,

            message: "Team member added successfully.",

            data: member

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to create team member."

        });

    }

};


// GET ALL TEAM MEMBERS

exports.getTeamMembers = async (req, res) => {

    try {

        const members = await TeamMember.find({

            companyId: req.company.id

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            data: members

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch team members."

        });

    }

};


// GET SINGLE TEAM MEMBER

exports.getTeamMemberById = async (req, res) => {

    try {

        const member = await TeamMember.findOne({

            _id: req.params.id,

            companyId: req.company.id

        });

        if (!member) {

            return res.status(404).json({

                success: false,

                message: "Team member not found."

            });

        }

        res.status(200).json({

            success: true,

            data: member

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch team member."

        });

    }

};


// UPDATE TEAM MEMBER

exports.updateTeamMember = async (req, res) => {

    try {

        const member = await TeamMember.findOneAndUpdate(

            {

                _id: req.params.id,

                companyId: req.company.id

            },

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!member) {

            return res.status(404).json({

                success: false,

                message: "Team member not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Team member updated successfully.",

            data: member

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to update team member."

        });

    }

};


// DELETE TEAM MEMBER

exports.deleteTeamMember = async (req, res) => {

    try {

        const member = await TeamMember.findOneAndDelete({

            _id: req.params.id,

            companyId: req.company.id

        });

        if (!member) {

            return res.status(404).json({

                success: false,

                message: "Team member not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Team member deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to delete team member."

        });

    }

};


// ACTIVATE TEAM MEMBER

exports.activateTeamMember = async (req, res) => {

    try {

        const member = await TeamMember.findOneAndUpdate(

            {

                _id: req.params.id,

                companyId: req.company.id

            },

            {

                status: "Active"

            },

            {

                new: true

            }

        );

        if (!member) {

            return res.status(404).json({

                success: false,

                message: "Team member not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Team member activated.",

            data: member

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to activate team member."

        });

    }

};


// DEACTIVATE TEAM MEMBER

exports.deactivateTeamMember = async (req, res) => {

    try {

        const member = await TeamMember.findOneAndUpdate(

            {

                _id: req.params.id,

                companyId: req.company.id

            },

            {

                status: "Inactive"

            },

            {

                new: true

            }

        );

        if (!member) {

            return res.status(404).json({

                success: false,

                message: "Team member not found."

            });

        }

        res.status(200).json({

            success: true,

            message: "Team member deactivated.",

            data: member

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Failed to deactivate team member."

        });

    }

};
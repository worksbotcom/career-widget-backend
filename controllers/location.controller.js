const Location = require("../models/Location");


// CREATE

exports.createLocation = async (req, res) => {

    try {

        const companyId = req.company.id;

        const {

            name,

            city,

            state,

            country,

            type

        } = req.body;

        const exists = await Location.findOne({

            companyId,

            name

        });

        if (exists) {

            return res.status(400).json({

                success: false,

                message: "Location already exists."

            });

        }

        const location = await Location.create({

            companyId,

            name,

            city,

            state,

            country,

            type

        });

        res.status(201).json({

            success: true,

            message: "Location created successfully.",

            data: location

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: "Failed to create location."

        });

    }

};


// GET ALL

exports.getLocations = async (req, res) => {

    try {

        const locations = await Location.find({

            companyId: req.company.id

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            data: locations

        });

    }

    catch {

        res.status(500).json({

            success: false,

            message: "Failed to fetch locations."

        });

    }

};


// GET SINGLE

exports.getLocationById = async (req, res) => {

    try {

        const location = await Location.findOne({

            _id: req.params.id,

            companyId: req.company.id

        });

        if (!location) {

            return res.status(404).json({

                success: false,

                message: "Location not found."

            });

        }

        res.json({

            success: true,

            data: location

        });

    }

    catch {

        res.status(500).json({

            success: false,

            message: "Failed."

        });

    }

};


// UPDATE

exports.updateLocation = async (req, res) => {

    try {

        const location = await Location.findOneAndUpdate(

            {

                _id: req.params.id,

                companyId: req.company.id

            },

            req.body,

            {

                new: true

            }

        );

        if (!location) {

            return res.status(404).json({

                success: false,

                message: "Location not found."

            });

        }

        res.json({

            success: true,

            message: "Location updated.",

            data: location

        });

    }

    catch {

        res.status(500).json({

            success: false,

            message: "Update failed."

        });

    }

};


// DELETE

exports.deleteLocation = async (req, res) => {

    try {

        const location = await Location.findOneAndDelete({

            _id: req.params.id,

            companyId: req.company.id

        });

        if (!location) {

            return res.status(404).json({

                success: false,

                message: "Location not found."

            });

        }

        res.json({

            success: true,

            message: "Location deleted."

        });

    }

    catch {

        res.status(500).json({

            success: false,

            message: "Delete failed."

        });

    }

};
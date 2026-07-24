const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const validation = require("../middleware/validation.middleware");

const {

    createLocationValidation,

    updateLocationValidation

} = require("../validations/location.validation");

const {

    createLocation,

    getLocations,

    getLocationById,

    updateLocation,

    deleteLocation

} = require("../controllers/location.controller");

router.post(

    "/",

    authMiddleware,

    createLocationValidation,

    validation,

    createLocation

);

router.get(

    "/",

    authMiddleware,

    getLocations

);

router.get(

    "/:id",

    authMiddleware,

    getLocationById

);

router.put(

    "/:id",

    authMiddleware,

    updateLocationValidation,

    validation,

    updateLocation

);

router.delete(

    "/:id",

    authMiddleware,

    deleteLocation

);

module.exports = router;
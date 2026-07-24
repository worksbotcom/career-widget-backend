const express = require("express");

const router = express.Router();

const {

    createPlan,

    getPlans,

    getPlan,

    updatePlan,

    deletePlan

} = require("../controllers/plan.controller");

const {

    createPlanValidation,

    updatePlanValidation

} = require("../validations/plan.validation");

const superAdminAuth = require("../middleware/superAdminAuth.middleware");

// Create Plan
router.post(
    "/",
    superAdminAuth,
    createPlanValidation,
    createPlan
);

// Get All Plans
router.get(
    "/",
    getPlans
);

// Get Single Plan
router.get(
    "/:id",
    getPlan
);

// Update Plan
router.put(
    "/:id",
    superAdminAuth,
    updatePlanValidation,
    updatePlan
);

// Delete Plan
router.delete(
    "/:id",
    superAdminAuth,
    deletePlan
);

module.exports = router;
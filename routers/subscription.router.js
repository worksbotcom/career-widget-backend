const express = require("express");

const router = express.Router();

const {

    createSubscription,
    getSubscriptions,
    getSubscriptionById,
    updateSubscription,
    updateSubscriptionStatus,
    deleteSubscription,
    subscriptionAnalytics

} = require("../controllers/subscription.controller");

const {

    createSubscriptionValidation

} = require("../validations/subscription.validation");

const superAdminAuth =
require("../middleware/superAdminAuth.middleware");

router.post(

    "/",

    superAdminAuth,

    createSubscriptionValidation,

    createSubscription

);


// List All
router.get(
    "/",
    superAdminAuth,
    getSubscriptions
);

// Get By ID
router.get(
    "/:id",
    superAdminAuth,
    getSubscriptionById
);

// Update
router.put(
    "/:id",
    superAdminAuth,
    updateSubscription
);

// Activate / Deactivate
router.patch(
    "/:id/status",
    superAdminAuth,
    updateSubscriptionStatus
);

//delete
router.delete(
    "/:id",
    superAdminAuth,
    deleteSubscription
);

router.get(

    "/analytics",
    superAdminAuth,
    subscriptionAnalytics

);

module.exports = router;
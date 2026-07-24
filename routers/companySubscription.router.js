const express = require("express");

const router = express.Router();

const {

    subscribeCompany,

    getCompanySubscription,

    changePlan,

    renewSubscription,

    cancelSubscription

} = require("../controllers/companySubscription.controller");

const {

    subscribeCompanyValidation,

    updateSubscriptionValidation

} = require("../validations/companySubscription.validation");

const superAdminAuth = require("../middleware/superAdminAuth.middleware");

const authMiddleware = require("../middleware/auth.middleware");


// Super Admin assigns a plan to a company
router.post(

    "/",

    superAdminAuth,

    subscribeCompanyValidation,

    subscribeCompany

);


// Company views its current subscription
router.get(

    "/my",

    authMiddleware,

    getCompanySubscription

);


// Super Admin changes a company's plan
router.put(

    "/:companyId/change-plan",

    superAdminAuth,

    updateSubscriptionValidation,

    changePlan

);


// Super Admin renews a company's subscription
router.patch(

    "/:companyId/renew",

    superAdminAuth,

    renewSubscription

);


// Super Admin cancels a company's subscription
router.patch(

    "/:companyId/cancel",

    superAdminAuth,

    cancelSubscription

);

module.exports = router;
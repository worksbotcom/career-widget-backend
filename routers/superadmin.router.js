const express = require("express");

const router = express.Router();

const { login,getAllCompanies,getCompanyById,updateCompanyStatus,updateSubscription,deleteCompany,dashboard,analytics,monthlyRegistrations,getAuditLogs } = require("../controllers/superadmin.controller");

const {
    superadminLoginValidation
} = require("../validations/superadmin.validation");

const superAdminAuth = require("../middleware/superAdminAuth.middleware");

router.post(
    "/login",
    superadminLoginValidation,
    login
);

// Protected Test Route
router.get(
    "/profile",
    superAdminAuth,
    (req, res) => {

        res.json({
            success: true,
            admin: req.admin
        });

    }
);

router.get(
    "/companies",
    superAdminAuth,
    getAllCompanies
);

router.get(
    "/companies/:id",
    superAdminAuth,
    getCompanyById
);

router.patch(
    "/companies/:id/status",
    superAdminAuth,
    updateCompanyStatus
);

router.patch(
    "/companies/:id/subscription",
    superAdminAuth,
    updateSubscription
);

router.delete(
    "/companies/:id",
    superAdminAuth,
    deleteCompany
);

router.get(
    "/dashboard",
    superAdminAuth,
    dashboard
);

router.get(
    "/companies",
    superAdminAuth,
    getAllCompanies
);

router.get(
    "/logs",
    superAdminAuth,
    getAuditLogs
);

router.get(
    "/analytics",
    superAdminAuth,
    analytics
);

router.get(
    "/analytics/monthly",
    superAdminAuth,
    monthlyRegistrations
);

module.exports = router;
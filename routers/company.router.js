const express = require("express");
const router = express.Router();

const {
    getCompanyProfile,
    updateCompanyProfile,
    regenerateApiKey,
    getWidgetScript,
    uploadCompanyLogo,
    getSubscription,
    getCompanyAuditLogs,
    changePassword
} = require("../controllers/company.controller");

const upload = require("../middleware/upload.middleware");

const authMiddleware = require("../middleware/auth.middleware");


// Get Company Profile
router.get("/profile", authMiddleware, getCompanyProfile);

// Update Company Profile
router.put("/profile", authMiddleware, updateCompanyProfile);

// Regenerate API Key
router.post(
    "/regenerate-api-key",
    authMiddleware,
    regenerateApiKey
);

router.get(
    "/widget-script",
    authMiddleware,
    getWidgetScript
);


router.put(
    "/logo",
    authMiddleware,
    upload.single("logo"),
    uploadCompanyLogo
);

router.get(
    "/subscription",
    authMiddleware,
    getSubscription
);

router.get(
    "/logs",
    authMiddleware,
    getCompanyAuditLogs
);

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);

module.exports = router;
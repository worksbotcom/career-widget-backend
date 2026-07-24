const express = require("express");

const router = express.Router();

const {
    getPublishedJobs,
    getPublishedJob
} = require("../controllers/widget.controller");

// Public: list published jobs for widget
router.get(
    "/jobs",
    getPublishedJobs
);

// Public: get published job by id
router.get(
    "/jobs/:id",
    getPublishedJob
);

// List published jobs for a company
router.get(
    "/:companyId/jobs",
    getPublishedJobs
);

// Get a published job
router.get(
    "/:companyId/jobs/:id",
    getPublishedJob
);


module.exports = router;

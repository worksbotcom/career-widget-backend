const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const validation = require("../middleware/validation.middleware");

const {
    createJobValidation,
    updateJobValidation
} = require("../validations/job.validation");

const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    publishJob,
    closeJob,
    archiveJob
} = require("../controllers/job.controller");


// Create Job
router.post(
    "/",
    authMiddleware,
    createJobValidation,
    validation,
    createJob
);


// Get All Jobs
router.get(
    "/",
    authMiddleware,
    getJobs
);


// Get Single Job
router.get(
    "/:id",
    authMiddleware,
    getJobById
);


// Update Job
router.put(
    "/:id",
    authMiddleware,
    updateJobValidation,
    validation,
    updateJob
);


// Delete Job
router.delete(
    "/:id",
    authMiddleware,
    deleteJob
);


// Publish Job
router.patch(
    "/:id/publish",
    authMiddleware,
    publishJob
);


// Close Job
router.patch(
    "/:id/close",
    authMiddleware,
    closeJob
);


// Archive Job
router.patch(
    "/:id/archive",
    authMiddleware,
    archiveJob
);

module.exports = router;
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const upload = require("../middleware/upload.middleware");

const {

    applyForJob,

    getApplications,

    getApplicationById,

    getApplicationsByJob,

    updateApplicationStatus,

    deleteApplication,

    downloadApplicationResume,

    exportApplications,

} = require("../controllers/application.controller");

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Download application resume (company protected)
router.get(
     "/:id/download",
     authMiddleware,
     downloadApplicationResume
);

// Candidate applies for a job
router.post(

    "/apply",

    upload.single("resume"),

    applyForJob

);

/*
|--------------------------------------------------------------------------
| Company Protected Routes
|--------------------------------------------------------------------------
*/

// Get all applications
router.get(

    "/",

    authMiddleware,

    getApplications

);

// Export applications as CSV/Excel (must be before "/:id")
router.get(

    "/export",

    authMiddleware,

    exportApplications

);

// Get application by ID
router.get(

    "/:id",

    authMiddleware,

    getApplicationById

);

// Get applications by Job
router.get(

    "/job/:jobId",

    authMiddleware,

    getApplicationsByJob

);

// Update application status
router.patch(

    "/:id/status",

    authMiddleware,

    updateApplicationStatus

);

// Delete application
router.delete(

    "/:id",

    authMiddleware,

    deleteApplication

);

module.exports = router;
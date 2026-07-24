const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const validation = require("../middleware/validation.middleware");

const {
    createDepartmentValidation,
    updateDepartmentValidation
} = require("../validations/department.validation");

const {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require("../controllers/department.controller");


router.post(
    "/",
    authMiddleware,
    createDepartmentValidation,
    validation,
    createDepartment
);

router.put(
    "/:id",
    authMiddleware,
    updateDepartmentValidation,
    validation,
    updateDepartment
);

router.get(
    "/",
    authMiddleware,
    getDepartments
);

router.get(
    "/:id",
    authMiddleware,
    getDepartmentById
);

router.delete(
    "/:id",
    authMiddleware,
    deleteDepartment
);

module.exports = router;
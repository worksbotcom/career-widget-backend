const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const validation = require("../middleware/validation.middleware");

const {

    createTeamMemberValidation,

    updateTeamMemberValidation

} = require("../validations/teamMember.validation");

const {

    createTeamMember,

    getTeamMembers,

    getTeamMemberById,

    updateTeamMember,

    deleteTeamMember,

    activateTeamMember,

    deactivateTeamMember

} = require("../controllers/teamMember.controller");


// CREATE TEAM MEMBER

router.post(

    "/",

    authMiddleware,

    createTeamMemberValidation,

    validation,

    createTeamMember

);


// GET ALL TEAM MEMBERS

router.get(

    "/",

    authMiddleware,

    getTeamMembers

);


// GET SINGLE TEAM MEMBER

router.get(

    "/:id",

    authMiddleware,

    getTeamMemberById

);


// UPDATE TEAM MEMBER

router.put(

    "/:id",

    authMiddleware,

    updateTeamMemberValidation,

    validation,

    updateTeamMember

);


// DELETE TEAM MEMBER

router.delete(

    "/:id",

    authMiddleware,

    deleteTeamMember

);


// ACTIVATE TEAM MEMBER

router.patch(

    "/:id/activate",

    authMiddleware,

    activateTeamMember

);


// DEACTIVATE TEAM MEMBER

router.patch(

    "/:id/deactivate",

    authMiddleware,

    deactivateTeamMember

);

module.exports = router;
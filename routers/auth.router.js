const express = require("express");
const router = express.Router();

const { register, resendVerificationEmail, verifyEmail, login, refresh, logout } = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../validations/auth.validation");

router.post("/register", registerValidation, register);
router.post("/resend-verification", resendVerificationEmail);
router.get("/verify/:token",verifyEmail);
router.post("/login",loginValidation,login);
router.post("/refresh", refresh);
router.post("/logout", logout);
module.exports = router;
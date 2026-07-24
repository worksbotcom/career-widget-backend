const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const { validationResult } = require("express-validator");

const Company = require("../models/Company");
const VerificationToken = require("../models/VerificationToken");

const generateCompanyId = require("../utils/companyId");
const generateApiKey = require("../utils/apiKey");

const sendEmail = require("../services/email.service");
const verificationTemplate = require("../emails/verificationEmail");

const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/jwt");

const sendVerificationEmailToCompany = async (company) => {
    const token = crypto.randomBytes(32).toString("hex");

    await VerificationToken.create({
        company: company._id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const verificationLink =
        `${process.env.CLIENT_URL}/auth/verify/${token}`;

    try {
        await sendEmail(
            company.email,
            "Verify Your Email",
            verificationTemplate(
                company.companyName,
                company.logo,
                verificationLink
            )
        );
    } catch (emailError) {
        console.error("Verification email could not be sent:", emailError);
    }

    company.lastVerificationEmailSentAt = new Date();
    await company.save();
};

/**
 * Register Company
 */
exports.register = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            companyName,
            website,
            email,
            password
        } = req.body;

        // Check existing company
        const existingCompany = await Company.findOne({ email });

        if (existingCompany) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create company
        const company = await Company.create({
            companyName,
            website,
            email,
            password: hashedPassword,
            companyId: generateCompanyId(),
            apiKey: generateApiKey(),
            subscription: "Free",
            isVerified: false
        });

        await sendVerificationEmailToCompany(company);

        return res.status(201).json({
            success: true,
            message:
                "Company registered successfully. Please verify your email.",
            data: {
                companyId: company.companyId,
                companyName: company.companyName,
                email: company.email,
                subscription: company.subscription,
                isVerified: company.isVerified
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
};


exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const company = await Company.findOne({ email });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "No account found with that email."
            });
        }

        if (company.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified."
            });
        }

        const now = new Date();
        const cooldownMs = 2 * 60 * 1000;

        if (
            company.lastVerificationEmailSentAt &&
            (now - company.lastVerificationEmailSentAt) < cooldownMs
        ) {
            const remainingSeconds = Math.ceil(
                (cooldownMs - (now - company.lastVerificationEmailSentAt)) / 1000
            );

            return res.status(429).json({
                success: false,
                message: `Please wait ${remainingSeconds} seconds before requesting another verification email.`
            });
        }

        await VerificationToken.deleteMany({ company: company._id });
        await sendVerificationEmailToCompany(company);

        return res.status(200).json({
            success: true,
            message: "Verification email resent successfully."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

/**
 * Verify Email
 */
exports.verifyEmail = async (req, res) => {

    try {

        const { token } = req.params;

        const verificationToken =
            await VerificationToken.findOne({ token });

        if (!verificationToken) {

            return res.status(400).json({
                success: false,
                message: "Invalid verification link."
            });

        }

        // Check expiration
        if (verificationToken.expiresAt < new Date()) {

            await VerificationToken.deleteOne({
                _id: verificationToken._id
            });

            return res.status(400).json({
                success: false,
                message: "Verification link has expired."
            });

        }

        const company =
            await Company.findById(
                verificationToken.company
            );

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }

        if (company.isVerified) {

            return res.status(400).json({
                success: false,
                message: "Email already verified."
            });

        }

        company.isVerified = true;

        await company.save();

        // Delete token after successful verification
        await VerificationToken.deleteOne({
            _id: verificationToken._id
        });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }

};

exports.login = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                errors: errors.array()
            });

        }

        const { email, password } = req.body;

        const company = await Company.findOne({ email });

        if (!company) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        if (!company.isVerified) {

            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in."
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            company.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        const accessToken =
            generateAccessToken(company);

        const refreshToken =
            generateRefreshToken(company);

        await RefreshToken.create({

            company: company._id,

            token: refreshToken,

            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )

        });

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            data: {

                companyId: company.companyId,

                companyName: company.companyName,

                accessToken,

                refreshToken

            }

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

exports.refresh = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            return res.status(401).json({
                success: false,
                message: "Refresh token required."
            });

        }

        const storedToken = await RefreshToken.findOne({
            token: refreshToken
        });

        if (!storedToken) {

            return res.status(401).json({
                success: false,
                message: "Invalid refresh token."
            });

        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const company = await Company.findById(decoded.id);

        if (!company) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }

        const accessToken =
            generateAccessToken(company);

        return res.json({

            success: true,

            accessToken

        });

    } catch (error) {

        return res.status(401).json({

            success: false,

            message: "Refresh token expired."

        });

    }

};

exports.logout = async (req, res) => {

    const { refreshToken } = req.body;

    await RefreshToken.deleteOne({
        token: refreshToken
    });

    return res.json({

        success: true,

        message: "Logged out successfully."

    });

};
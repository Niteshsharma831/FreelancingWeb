"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFreelancerProfile = exports.getAllFreelancers = exports.getFreelancer = exports.updateFreelancer = exports.protectFreelancer = exports.logoutFreelancer = exports.loginFreelancer = exports.registerFreelancer = exports.sendOtp = void 0;
const Freelancer_1 = __importDefault(require("../models/Freelancer"));
const Otp_1 = __importDefault(require("../models/Otp"));
const otp_1 = require("../utils/otp");
const mailer_1 = require("../utils/mailer");
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Helper to safely convert Mongo ObjectId to string
const getIdString = (id) => id.toString();
// Send OTP - FIXED with proper error handling
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: "Email required" });
        const otp = (0, otp_1.generateOtp)();
        const expiresAt = (0, otp_1.otpExpiry)();
        await Otp_1.default.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true, new: true });
        await (0, mailer_1.sendOtpMail)(email, otp);
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};
exports.sendOtp = sendOtp;
// Register Freelancer - FIXED with better validation
const registerFreelancer = async (req, res) => {
    try {
        const { name, gender, email, otp } = req.body;
        // Validate required fields
        if (!name || !gender || !email || !otp) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existing = await Freelancer_1.default.findOne({ email });
        if (existing)
            return res.status(409).json({ error: "Email already registered" });
        const otpRecord = await Otp_1.default.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }
        if (otpRecord.expiresAt < new Date()) {
            await Otp_1.default.deleteOne({ email });
            return res.status(401).json({ error: "OTP expired" });
        }
        const user = new Freelancer_1.default({
            name,
            gender,
            email,
            role: "freelancer",
            profileCompleted: false,
        });
        await user.save();
        await Otp_1.default.deleteOne({ email });
        const userId = getIdString(user._id);
        const token = (0, jwt_1.generateToken)(userId, user.role, user.email);
        // FIXED: Correct cookie settings for production
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileCompleted: user.profileCompleted
            }
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: "Registration failed" });
    }
};
exports.registerFreelancer = registerFreelancer;
// Login - FIXED with correct cookie settings
const loginFreelancer = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP required" });
        }
        const user = await Freelancer_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "User not registered" });
        const otpRecord = await Otp_1.default.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }
        if (otpRecord.expiresAt < new Date()) {
            await Otp_1.default.deleteOne({ email });
            return res.status(401).json({ error: "OTP expired" });
        }
        await Otp_1.default.deleteOne({ email });
        const userId = getIdString(user._id);
        const token = (0, jwt_1.generateToken)(userId, user.role, user.email);
        // FIXED: Consistent cookie settings
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileCompleted: user.profileCompleted
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};
exports.loginFreelancer = loginFreelancer;
// Logout - FIXED with correct cookie clearing
const logoutFreelancer = async (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};
exports.logoutFreelancer = logoutFreelancer;
// Protect middleware - FIXED to match token structure
const protectFreelancer = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }
        // FIXED: The token should be verified with proper structure
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // FIXED: Check if token is expired
        if (Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ error: "Token expired" });
        }
        if (decoded.role !== "freelancer") {
            return res.status(403).json({ error: "Access denied for non-freelancer" });
        }
        // FIXED: Attach user info to request
        req.user = {
            id: decoded.userId,
            role: decoded.role,
            email: decoded.email
        };
        next();
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: "Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }
        console.error("Auth middleware error:", err);
        res.status(500).json({ error: "Authentication failed" });
    }
};
exports.protectFreelancer = protectFreelancer;
// Update Profile - FIXED with proper validation
const updateFreelancer = async (req, res) => {
    try {
        const { profile } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!profile || typeof profile !== 'object') {
            return res.status(400).json({ error: "Profile data required" });
        }
        const updated = await Freelancer_1.default.findByIdAndUpdate(userId, {
            $set: {
                profile: {
                    ...profile,
                    updatedAt: new Date()
                },
                profileCompleted: true
            }
        }, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ error: "Freelancer not found" });
        }
        res.status(200).json({
            success: true,
            message: "Profile updated",
            user: updated
        });
    }
    catch (error) {
        console.error("Update error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: "Invalid profile data" });
        }
        res.status(500).json({ error: "Failed to update profile" });
    }
};
exports.updateFreelancer = updateFreelancer;
// Get a single freelancer - FIXED
const getFreelancer = async (req, res) => {
    try {
        const { email } = req.query;
        const userId = req.user?.id;
        let freelancer;
        if (email) {
            freelancer = await Freelancer_1.default.findOne({ email });
        }
        else if (userId) {
            freelancer = await Freelancer_1.default.findById(userId);
        }
        else {
            return res.status(400).json({ error: "Email or authentication required" });
        }
        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }
        res.status(200).json({ success: true, user: freelancer });
    }
    catch (error) {
        console.error("Get freelancer error:", error);
        res.status(500).json({ error: "Failed to fetch freelancer" });
    }
};
exports.getFreelancer = getFreelancer;
// Get all freelancers - FIXED
const getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await Freelancer_1.default.find().select("-__v");
        res.status(200).json({ success: true, users: freelancers });
    }
    catch (error) {
        console.error("Get all freelancers error:", error);
        res.status(500).json({ error: "Failed to fetch freelancers" });
    }
};
exports.getAllFreelancers = getAllFreelancers;
// Get freelancer profile - FIXED
const getFreelancerProfile = async (req, res) => {
    try {
        const freelancerId = req.user?.id;
        if (!freelancerId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const freelancer = await Freelancer_1.default.findById(freelancerId).select("-__v");
        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }
        res.status(200).json({ success: true, user: freelancer });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};
exports.getFreelancerProfile = getFreelancerProfile;

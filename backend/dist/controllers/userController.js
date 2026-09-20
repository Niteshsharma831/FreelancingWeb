"use strict";
// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import Client from "../models/clientModel";
// import Otp from "../models/Otp";
// import JobApplication from "../models/Application";
// import { generateOtp, otpExpiry } from "../utils/otp";
// import { sendOtpMail } from "../utils/mailer";
// import { generateToken } from "../utils/jwt";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserExists = exports.cleanupExpiredOtps = exports.getCurrentUser = exports.verifyOtp = exports.getProfile = exports.getUserById = exports.getClientApplications = exports.getAllUsers = exports.updateUser = exports.getUser = exports.logoutUser = exports.loginUser = exports.createUser = exports.sendOtp = exports.debugEmail = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const clientModel_1 = __importDefault(require("../models/clientModel"));
const Otp_1 = __importDefault(require("../models/Otp"));
const Application_1 = __importDefault(require("../models/Application"));
const otp_1 = require("../utils/otp");
const mailer_1 = require("../utils/mailer");
const jwt_1 = require("../utils/jwt");
// In your userController.ts
const debugEmail = async (req, res) => {
    try {
        const email = req.params.email.toLowerCase();
        console.log("🔍 Debug email requested for:", email);
        const otps = await Otp_1.default.find({ email }).sort({ createdAt: -1 });
        // Also check if user exists
        const user = await clientModel_1.default.findOne({ email });
        res.status(200).json({
            success: true,
            email,
            userExists: !!user,
            userData: user ? {
                id: user._id,
                name: user.name,
                email: user.email
            } : null,
            otpCount: otps.length,
            otps: otps.map((o) => ({
                id: o._id,
                otp: o.otp,
                purpose: o.purpose,
                createdAt: o.createdAt,
                expiresAt: o.expiresAt,
                isValid: new Date(o.expiresAt) > new Date(),
                ageSeconds: Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 1000)
            })),
        });
    }
    catch (error) {
        console.error("Debug error:", error);
        res.status(500).json({
            success: false,
            error: String(error)
        });
    }
};
exports.debugEmail = debugEmail;
// 📩 Send OTP to email
const sendOtp = async (req, res) => {
    try {
        const { email, purpose: requestedPurpose } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        console.log("========== DEBUG SEND OTP ==========");
        console.log("1️⃣ Raw request body:", req.body);
        console.log("2️⃣ Extracted email:", email);
        console.log("3️⃣ Extracted purpose:", requestedPurpose);
        console.log("4️⃣ Purpose type:", typeof requestedPurpose);
        console.log("5️⃣ Normalized email:", normalizedEmail);
        if (!email) {
            res.status(400).json({
                success: false,
                error: "Email is required",
            });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            res.status(400).json({
                success: false,
                error: "Invalid email format",
            });
            return;
        }
        // Check if user exists
        console.log("6️⃣ Checking if user exists...");
        const existingUser = await clientModel_1.default.findOne({ email: normalizedEmail });
        console.log("7️⃣ User exists?", {
            exists: !!existingUser,
            userData: existingUser
                ? {
                    id: existingUser._id,
                    email: existingUser.email,
                    name: existingUser.name,
                }
                : null,
        });
        // If no user found, check all users in DB
        if (!existingUser) {
            console.log("8️⃣ No user found. Listing all users in DB:");
            const allUsers = await clientModel_1.default.find({}).select("email name").lean();
            console.log("All registered emails:", allUsers.map((u) => u.email));
        }
        // Determine purpose
        console.log("9️⃣ Determining purpose...");
        let purpose;
        console.log("   requestedPurpose:", requestedPurpose);
        console.log("   requestedPurpose in array?", requestedPurpose && ["login", "register"].includes(requestedPurpose));
        console.log("   userExists:", !!existingUser);
        if (requestedPurpose && ["login", "register"].includes(requestedPurpose)) {
            purpose = requestedPurpose;
            console.log("🔟 Using requested purpose:", purpose);
        }
        else {
            purpose = existingUser ? "login" : "register";
            console.log("🔟 Auto-detected purpose:", purpose);
        }
        console.log("1️⃣1️⃣ FINAL PURPOSE:", purpose);
        // Validate purpose vs user existence
        if (purpose === "register" && existingUser) {
            console.log("❌ Validation failed: Trying to register existing user");
            console.log("1️⃣2️⃣ Sending error response: User already exists");
            res.status(400).json({
                success: false,
                error: "User already exists. Please login instead.",
            });
            return;
        }
        if (purpose === "login" && !existingUser) {
            console.log("❌ Validation failed: Trying to login non-existent user");
            console.log("1️⃣2️⃣ Sending error response: User not found");
            res.status(400).json({
                success: false,
                error: "User not found. Please register first.",
            });
            return;
        }
        console.log("✅ Validation passed, proceeding with OTP generation");
        console.log("1️⃣3️⃣ Generating OTP...");
        const otp = (0, otp_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        // Delete any existing OTPs
        await Otp_1.default.deleteMany({
            email: normalizedEmail,
            purpose: purpose,
        });
        // Create new OTP record
        const otpRecord = new Otp_1.default({
            email: normalizedEmail,
            otp: String(otp),
            purpose: purpose,
            expiresAt,
            attempts: 0,
            createdAt: new Date(),
        });
        await otpRecord.save();
        console.log("1️⃣4️⃣ OTP saved:", {
            email: otpRecord.email,
            otp: otpRecord.otp,
            purpose: otpRecord.purpose,
        });
        // Try to send email
        try {
            console.log("1️⃣5️⃣ Attempting to send email...");
            await (0, mailer_1.sendOtpMail)(normalizedEmail, otp);
            console.log("1️⃣6️⃣ Sending success response with purpose:", purpose);
            res.status(200).json({
                success: true,
                message: "OTP sent to email successfully",
                email: normalizedEmail,
                purpose: purpose,
                ...(process.env.NODE_ENV === "development" && { otp: String(otp) }),
            });
        }
        catch (mailError) {
            console.error("Mail Error:", mailError);
            if (process.env.NODE_ENV === "development") {
                res.status(200).json({
                    success: true,
                    message: "OTP generated (email service failed)",
                    email: normalizedEmail,
                    otp: String(otp),
                    expiresAt,
                    purpose: purpose,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: "Failed to send OTP email. Please try again.",
                });
            }
        }
    }
    catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to process OTP request",
        });
    }
};
exports.sendOtp = sendOtp;
// 📝 Create/Register user
const createUser = async (req, res) => {
    try {
        const { name, gender, email, otp } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        console.log("📝 Registration attempt:", {
            name,
            gender,
            email: normalizedEmail,
            otp: otp,
            otpType: typeof otp,
        });
        // Validate all fields
        if (!name || !gender || !email || !otp) {
            res.status(400).json({
                success: false,
                error: "All fields are required: name, gender, email, otp",
            });
            return;
        }
        // Validate gender
        const validGenders = ["male", "female", "other"];
        if (!validGenders.includes(gender.toLowerCase())) {
            res.status(400).json({
                success: false,
                error: "Gender must be male, female, or other",
            });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            res.status(400).json({
                success: false,
                error: "Invalid email format",
            });
            return;
        }
        // Check if user already exists
        const existingUser = await clientModel_1.default.findOne({ email: normalizedEmail });
        if (existingUser) {
            res.status(409).json({
                success: false,
                error: "User already exists. Please login instead.",
            });
            return;
        }
        // IMPORTANT: Get the MOST RECENT OTP for registration
        const otpRecord = await Otp_1.default.findOne({
            email: normalizedEmail,
            purpose: "register",
        }).sort({ createdAt: -1 }); // Get the newest one
        console.log("📝 Found OTP record:", otpRecord
            ? {
                email: otpRecord.email,
                otp: otpRecord.otp,
                purpose: otpRecord.purpose,
                expiresAt: otpRecord.expiresAt,
                createdAt: otpRecord.createdAt,
                attempts: otpRecord.attempts,
            }
            : "No record found");
        if (!otpRecord) {
            res.status(400).json({
                success: false,
                error: "No OTP found for this email. Please request a new OTP.",
            });
            return;
        }
        // Check if OTP is expired
        if (new Date(otpRecord.expiresAt) < new Date()) {
            console.log("❌ OTP expired at:", otpRecord.expiresAt);
            // Delete expired OTP
            await Otp_1.default.deleteOne({ _id: otpRecord._id });
            res.status(401).json({
                success: false,
                error: "OTP has expired. Please request a new OTP.",
            });
            return;
        }
        // CRITICAL FIX: Handle OTP comparison with leading zeros
        // Convert stored OTP to string
        const storedOtp = String(otpRecord.otp).trim();
        // Convert provided OTP to string, ensuring leading zeros are preserved
        let providedOtp;
        if (typeof otp === "number") {
            // If it's a number, pad with leading zeros to make it 6 digits
            providedOtp = otp.toString().padStart(6, "0");
        }
        else {
            // If it's already a string, just trim it
            providedOtp = String(otp).trim();
        }
        console.log("🔍 OTP Comparison:", {
            storedOtp,
            providedOtp,
            storedType: typeof storedOtp,
            providedType: typeof providedOtp,
            storedLength: storedOtp.length,
            providedLength: providedOtp.length,
            storedOtpCharCodes: Array.from(storedOtp).map((c) => c.charCodeAt(0)),
            providedOtpCharCodes: Array.from(providedOtp).map((c) => c.charCodeAt(0)),
            match: storedOtp === providedOtp,
        });
        // Increment attempts
        otpRecord.attempts += 1;
        await otpRecord.save();
        // Check if max attempts exceeded (optional)
        if (otpRecord.attempts > 5) {
            await Otp_1.default.deleteOne({ _id: otpRecord._id });
            res.status(401).json({
                success: false,
                error: "Too many failed attempts. Please request a new OTP.",
            });
            return;
        }
        if (storedOtp !== providedOtp) {
            res.status(401).json({
                success: false,
                error: "Invalid OTP",
            });
            return;
        }
        // Create new user
        const user = new clientModel_1.default({
            name,
            gender: gender.toLowerCase(),
            email: normalizedEmail,
            role: "client",
            profileCompleted: false,
            profile: {
                verified: false,
                skills: [],
            },
        });
        await user.save();
        console.log("✅ User created:", user._id);
        // Delete used OTP
        await Otp_1.default.deleteOne({ _id: otpRecord._id });
        console.log("✅ OTP deleted");
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString(), "client", user.email);
        // Set cookie
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    role: user.role,
                    profileCompleted: user.profileCompleted,
                    profile: user.profile || {},
                    createdAt: user.createdAt,
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Registration Error:", error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: Object.values(error.errors).map((err) => err.message),
            });
            return;
        }
        // Handle duplicate email error
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                error: "Email already exists. Please use a different email.",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Registration failed. Please try again.",
        });
    }
};
exports.createUser = createUser;
// 🔐 Login user
const loginUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log("🔐 Login attempt:", { email, otp: otp ? "****" : "missing" });
        if (!email || !otp) {
            res.status(400).json({
                success: false,
                error: "Email and OTP are required",
            });
            return;
        }
        // Find user
        const user = await clientModel_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found. Please register first.",
            });
            return;
        }
        // IMPORTANT: Get the MOST RECENT OTP for this email and purpose
        const otpRecord = await Otp_1.default.findOne({
            email: email.toLowerCase(),
            purpose: "login",
        }).sort({ createdAt: -1 }); // Sort by newest first
        console.log("📝 Found OTP record:", otpRecord
            ? {
                email: otpRecord.email,
                otp: otpRecord.otp,
                expiresAt: otpRecord.expiresAt,
                createdAt: otpRecord.createdAt,
                attempts: otpRecord.attempts,
            }
            : "No record found");
        if (!otpRecord) {
            res.status(400).json({
                success: false,
                error: "No OTP found. Please request a new OTP.",
            });
            return;
        }
        // Check if OTP is expired
        if (new Date(otpRecord.expiresAt) < new Date()) {
            console.log("❌ OTP expired at:", otpRecord.expiresAt);
            // Delete expired OTP
            await Otp_1.default.deleteOne({ _id: otpRecord._id });
            res.status(401).json({
                success: false,
                error: "OTP has expired. Please request a new OTP.",
            });
            return;
        }
        // Increment attempts
        otpRecord.attempts += 1;
        await otpRecord.save();
        // Check if max attempts exceeded (optional)
        if (otpRecord.attempts > 5) {
            await Otp_1.default.deleteOne({ _id: otpRecord._id });
            res.status(401).json({
                success: false,
                error: "Too many failed attempts. Please request a new OTP.",
            });
            return;
        }
        // Compare OTP (convert both to string and trim)
        const providedOtp = String(otp).trim();
        const storedOtp = String(otpRecord.otp).trim();
        console.log("🔍 OTP Comparison:", {
            providedOtp,
            storedOtp,
            providedType: typeof providedOtp,
            storedType: typeof storedOtp,
            providedLength: providedOtp.length,
            storedLength: storedOtp.length,
            match: providedOtp === storedOtp,
            attempts: otpRecord.attempts,
        });
        if (providedOtp !== storedOtp) {
            res.status(401).json({
                success: false,
                error: "Invalid OTP",
            });
            return;
        }
        // OTP is valid - delete it
        await Otp_1.default.deleteOne({ _id: otpRecord._id });
        console.log("✅ OTP used and deleted");
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString(), "client", user.email);
        // Set cookie
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    role: user.role,
                    profileCompleted: user.profileCompleted,
                    profile: user.profile || {},
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Login failed. Please try again.",
        });
    }
};
exports.loginUser = loginUser;
// 🚪 Logout user
const logoutUser = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
exports.logoutUser = logoutUser;
// 👤 Get user by email
const getUser = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            res.status(400).json({
                success: false,
                error: "Email is required",
            });
            return;
        }
        const user = await clientModel_1.default.findOne({ email }).select("-__v").lean();
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
            return;
        }
        // Prepare response without _id
        const userResponse = {
            id: user._id?.toString(),
            name: user.name,
            email: user.email,
            gender: user.gender,
            role: user.role,
            profileCompleted: user.profileCompleted,
            profile: user.profile || {},
            createdAt: user.createdAt,
        };
        res.status(200).json({
            success: true,
            data: { user: userResponse },
        });
    }
    catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to get user",
        });
    }
};
exports.getUser = getUser;
// ✏️ Update user profile
const updateUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { profile } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        if (!profile || typeof profile !== "object") {
            res.status(400).json({
                success: false,
                error: "Profile data is required",
            });
            return;
        }
        const updatedUser = await clientModel_1.default.findByIdAndUpdate(userId, {
            $set: {
                profile: { ...profile },
                profileCompleted: true,
            },
        }, {
            new: true,
            runValidators: true,
        }).select("-__v");
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
            return;
        }
        const userResponse = {
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            gender: updatedUser.gender,
            role: updatedUser.role,
            profileCompleted: updatedUser.profileCompleted,
            profile: updatedUser.profile || {},
            createdAt: updatedUser.createdAt,
        };
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user: userResponse },
        });
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const validationError = error;
            res.status(400).json({
                success: false,
                error: "Profile validation failed",
                details: Object.values(validationError.errors).map((err) => err.message),
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Profile update failed",
        });
    }
};
exports.updateUser = updateUser;
// 👥 Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await clientModel_1.default.find()
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();
        // Convert all _id to id
        const usersResponse = users.map((user) => ({
            id: user._id?.toString(),
            name: user.name,
            email: user.email,
            gender: user.gender,
            role: user.role,
            profileCompleted: user.profileCompleted,
            profile: user.profile || {},
            createdAt: user.createdAt,
        }));
        res.status(200).json({
            success: true,
            count: usersResponse.length,
            data: { users: usersResponse },
        });
    }
    catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to retrieve users",
        });
    }
};
exports.getAllUsers = getAllUsers;
// 📌 User's applied jobs
const getClientApplications = async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        if (role !== "client") {
            res.status(403).json({
                success: false,
                error: "Access denied. Only clients can view their applications",
            });
            return;
        }
        const applications = await Application_1.default.find({ clientId: userId })
            .populate("jobId", "title description budget duration category status")
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            count: applications.length,
            data: { applications },
        });
    }
    catch (error) {
        console.error("Get client applications error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to fetch job applications",
        });
    }
};
exports.getClientApplications = getClientApplications;
// 📄 Get user profile by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid user ID",
            });
            return;
        }
        const user = await clientModel_1.default.findById(id).select("-__v").lean();
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
            return;
        }
        // Prepare response without _id
        const userResponse = {
            id: user._id?.toString(),
            name: user.name,
            email: user.email,
            gender: user.gender,
            role: user.role,
            profileCompleted: user.profileCompleted,
            profile: user.profile || {},
            createdAt: user.createdAt,
        };
        res.status(200).json({
            success: true,
            data: { user: userResponse },
        });
    }
    catch (error) {
        console.error("Get User By ID Error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to retrieve user",
        });
    }
};
exports.getUserById = getUserById;
// 👤 Get own profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("🔍 getProfile - User ID from token:", userId);
        console.log("🔍 Full user object from req.user:", req.user);
        if (!userId) {
            console.log("❌ No user ID in token");
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        // Check if userId is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            console.log("❌ Invalid user ID format:", userId);
            res.status(400).json({
                success: false,
                error: "Invalid user ID format",
            });
            return;
        }
        // Find user by ID
        console.log("🔍 Searching for user with ID:", userId);
        const user = await clientModel_1.default.findById(userId)
            .select("name gender email profile profileCompleted createdAt")
            .lean();
        console.log("🔍 User found in DB:", user ? "Yes" : "No");
        if (!user) {
            console.log("❌ User not found in database for ID:", userId);
            res.status(404).json({
                success: false,
                error: "User not found",
            });
            return;
        }
        console.log("✅ User found:", {
            id: user._id?.toString(),
            name: user.name,
            email: user.email,
        });
        // Prepare user data for response
        const userResponse = {
            id: user._id?.toString(),
            name: user.name,
            email: user.email,
            gender: user.gender,
            role: "client",
            profileCompleted: user.profileCompleted || false,
            profile: user.profile || {},
            createdAt: user.createdAt,
        };
        console.log("✅ Sending user response");
        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                user: userResponse,
            },
        });
    }
    catch (error) {
        console.error("❌ Error fetching profile:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch profile",
        });
    }
};
exports.getProfile = getProfile;
// 🔄 OTP verification function
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({
                success: false,
                error: "Email and OTP are required",
            });
            return;
        }
        const otpRecord = await Otp_1.default.findOne({ email });
        if (!otpRecord) {
            res.status(400).json({
                success: false,
                error: "No OTP found for this email",
            });
            return;
        }
        if (otpRecord.otp !== otp) {
            res.status(401).json({
                success: false,
                error: "Invalid OTP",
            });
            return;
        }
        if (otpRecord.expiresAt < new Date()) {
            res.status(401).json({
                success: false,
                error: "OTP has expired",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: {
                email,
                purpose: otpRecord.purpose,
                expiresAt: otpRecord.expiresAt,
            },
        });
    }
    catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to verify OTP",
        });
    }
};
exports.verifyOtp = verifyOtp;
// 📱 Get current user
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        const user = await clientModel_1.default.findById(userId).select("-__v");
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    role: user.role,
                    profileCompleted: user.profileCompleted,
                    profile: user.profile || {},
                    createdAt: user.createdAt,
                },
            },
        });
    }
    catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to get current user",
        });
    }
};
exports.getCurrentUser = getCurrentUser;
// 🔧 Clean up expired OTPs (call this periodically)
const cleanupExpiredOtps = async () => {
    try {
        const result = await Otp_1.default.deleteMany({ expiresAt: { $lt: new Date() } });
        console.log(`🧹 Cleaned up ${result.deletedCount} expired OTPs`);
    }
    catch (error) {
        console.error("Error cleaning up expired OTPs:", error);
    }
};
exports.cleanupExpiredOtps = cleanupExpiredOtps;
// 🆕 Check if user exists
const checkUserExists = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            res.status(400).json({
                success: false,
                error: "Email is required",
            });
            return;
        }
        const user = await clientModel_1.default.findOne({ email }).select("email role");
        res.status(200).json({
            success: true,
            exists: !!user,
            data: user
                ? {
                    email: user.email,
                    role: user.role,
                    needsRegistration: false,
                }
                : {
                    email,
                    needsRegistration: true,
                },
        });
    }
    catch (error) {
        console.error("Check user exists error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to check user",
        });
    }
};
exports.checkUserExists = checkUserExists;

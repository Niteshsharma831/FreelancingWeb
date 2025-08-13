"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.getUserById = exports.getClientApplications = exports.getAllUsers = exports.updateUser = exports.getUser = exports.logoutUser = exports.loginUser = exports.createUser = exports.sendOtp = exports.protect = void 0;
const clientModel_1 = __importDefault(require("../models/clientModel"));
const Otp_1 = __importDefault(require("../models/Otp"));
const Application_1 = __importDefault(require("../models/Application"));
const otp_1 = require("../utils/otp");
const mailer_1 = require("../utils/mailer");
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 🔐 Middleware to protect routes
const protect = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (_b) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.protect = protect;
// 📩 Send OTP to email
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: "Email is required" });
        const otp = (0, otp_1.generateOtp)();
        const expiresAt = (0, otp_1.otpExpiry)();
        yield Otp_1.default.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true, new: true });
        yield (0, mailer_1.sendOtpMail)(email, otp);
        res.status(200).json({ message: "OTP sent to email successfully" });
    }
    catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});
exports.sendOtp = sendOtp;
// 📝 Register client (OTP-based)
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, gender, email, otp } = req.body;
        if (!name || !gender || !email || !otp) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const otpRecord = yield Otp_1.default.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
            return res.status(401).json({ error: "Invalid or expired OTP" });
        }
        let user = yield clientModel_1.default.findOne({ email });
        if (user) {
            return res.status(409).json({ error: "Already registered. Please login." });
        }
        user = new clientModel_1.default({
            name,
            gender,
            email,
            role: "client",
            profileCompleted: false,
        });
        yield user.save();
        yield Otp_1.default.deleteOne({ email });
        // ✅ Properly cast _id to string
        const token = (0, jwt_1.generateToken)(user._id.toString(), "client", user.email);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ message: "Client registered", user, token });
    }
    catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});
exports.createUser = createUser;
// 🔐 Login client (OTP-based)
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp)
            return res.status(400).json({ error: "Email and OTP required" });
        const user = yield clientModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "Client not found" });
        const otpRecord = yield Otp_1.default.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
            return res.status(401).json({ error: "Invalid or expired OTP" });
        }
        yield Otp_1.default.deleteOne({ email });
        const token = (0, jwt_1.generateToken)(user._id.toString(), "client", user.email);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Login successful", user, token });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});
exports.loginUser = loginUser;
// 🚪 Logout client
const logoutUser = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
// 👤 Get client by email
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string")
            return res.status(400).json({ error: "Email is required" });
        const user = yield clientModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ error: "Could not get user" });
    }
});
exports.getUser = getUser;
// ✏️ Update client profile
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { profile } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const updatedUser = yield clientModel_1.default.findByIdAndUpdate(userId, { $set: { profile, profileCompleted: true } }, { new: true });
        if (!updatedUser)
            return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ message: "Profile updated", user: updatedUser });
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: "Profile update failed" });
    }
});
exports.updateUser = updateUser;
// 👥 Get all clients (for admin use)
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield clientModel_1.default.find();
        res.status(200).json({ users });
    }
    catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});
exports.getAllUsers = getAllUsers;
// 📌 Client's applied jobs
const getClientApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (role !== "client")
            return res.status(403).json({ error: "Only clients can view their applications" });
        const applications = yield Application_1.default.find({ clientId: userId })
            .populate("jobId", "title description budget duration category")
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    }
    catch (error) {
        console.error("Get client applications error:", error);
        res.status(500).json({ error: "Failed to fetch job applications" });
    }
});
exports.getClientApplications = getClientApplications;
// 📄 Get full client profile by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield clientModel_1.default.findById(userId).select("-password");
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Get User By ID Error:", error);
        res.status(500).json({ error: "Failed to retrieve user" });
    }
});
exports.getUserById = getUserById;
// 👤 Get own profile
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const user = yield clientModel_1.default.findById(userId).select("name gender email avatar profile");
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    }
    catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getProfile = getProfile;

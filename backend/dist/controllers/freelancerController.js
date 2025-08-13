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
exports.getFreelancerProfile = exports.getAllFreelancers = exports.getFreelancer = exports.updateFreelancer = exports.protectFreelancer = exports.logoutFreelancer = exports.loginFreelancer = exports.registerFreelancer = exports.sendOtp = void 0;
const Freelancer_1 = __importDefault(require("../models/Freelancer"));
const Otp_1 = __importDefault(require("../models/Otp"));
const otp_1 = require("../utils/otp");
const mailer_1 = require("../utils/mailer");
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Helper to safely convert Mongo ObjectId to string
const getIdString = (id) => id.toString();
// Send OTP
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email required" });
    const otp = (0, otp_1.generateOtp)();
    const expiresAt = (0, otp_1.otpExpiry)();
    yield Otp_1.default.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true });
    yield (0, mailer_1.sendOtpMail)(email, otp);
    res.status(200).json({ message: "OTP sent" });
});
exports.sendOtp = sendOtp;
// Register Freelancer
const registerFreelancer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, gender, email, otp } = req.body;
    const existing = yield Freelancer_1.default.findOne({ email });
    if (existing)
        return res.status(409).json({ error: "Already registered" });
    const otpRecord = yield Otp_1.default.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
        return res.status(401).json({ error: "Invalid or expired OTP" });
    }
    const user = new Freelancer_1.default({
        name,
        gender,
        email,
        role: "freelancer",
        profileCompleted: false,
    });
    yield user.save();
    yield Otp_1.default.deleteOne({ email });
    const userId = getIdString(user._id);
    const token = (0, jwt_1.generateToken)(userId, user.role, user.email); // ✅ Pass 3 args
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({ message: "Freelancer registered", user, token });
});
exports.registerFreelancer = registerFreelancer;
// Login
const loginFreelancer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield Freelancer_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ error: "Not registered" });
    const otpRecord = yield Otp_1.default.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
        return res.status(401).json({ error: "Invalid or expired OTP" });
    }
    yield Otp_1.default.deleteOne({ email });
    const userId = getIdString(user._id);
    const token = (0, jwt_1.generateToken)(userId, user.role, user.email); // ✅ Pass 3 args
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successful", user, token });
});
exports.loginFreelancer = loginFreelancer;
// Logout
const logoutFreelancer = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
});
exports.logoutFreelancer = logoutFreelancer;
// Protect middleware
const protectFreelancer = (req, res, next) => {
    var _a;
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
    if (!token)
        return res.status(401).json({ error: "Login first" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role !== "freelancer")
            return res.status(403).json({ error: "Access denied" });
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.protectFreelancer = protectFreelancer;
// Update Profile
const updateFreelancer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile } = req.body;
    const userId = req.user.id;
    const updated = yield Freelancer_1.default.findByIdAndUpdate(userId, { $set: { profile, profileCompleted: true } }, { new: true });
    if (!updated)
        return res.status(404).json({ error: "Freelancer not found" });
    res.status(200).json({ message: "Profile updated", user: updated });
});
exports.updateFreelancer = updateFreelancer;
// Get a single freelancer
const getFreelancer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = req.query;
        const freelancer = email
            ? yield Freelancer_1.default.findOne({ email })
            : yield Freelancer_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!freelancer)
            return res.status(404).json({ error: "Freelancer not found" });
        res.status(200).json({ user: freelancer });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch freelancer" });
    }
});
exports.getFreelancer = getFreelancer;
// Get all freelancers (for admin)
const getAllFreelancers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const freelancers = yield Freelancer_1.default.find();
        res.status(200).json({ users: freelancers });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch freelancers" });
    }
});
exports.getAllFreelancers = getAllFreelancers;
// Get freelancer profile (authenticated)
const getFreelancerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const freelancerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!freelancerId)
            return res.status(401).json({ error: "Unauthorized" });
        const freelancer = yield Freelancer_1.default.findById(freelancerId).select("name email");
        if (!freelancer)
            return res.status(404).json({ error: "Freelancer not found" });
        res.status(200).json(freelancer);
    }
    catch (error) {
        console.error("Error fetching freelancer profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getFreelancerProfile = getFreelancerProfile;

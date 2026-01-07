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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.getProfile = exports.getUserById = exports.getClientApplications = exports.getAllUsers = exports.updateUser = exports.getUser = exports.logoutUser = exports.loginUser = exports.createUser = exports.sendOtp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const clientModel_1 = __importDefault(require("../models/clientModel"));
const Otp_1 = __importDefault(require("../models/Otp"));
const Application_1 = __importDefault(require("../models/Application"));
const otp_1 = require("../utils/otp");
const mailer_1 = require("../utils/mailer");
const jwt_1 = require("../utils/jwt");
// 📩 Send OTP to email (matches /send-otp route)
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: "Email is required"
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email format"
            });
        }
        // Check if user exists (for login) or not (for registration)
        const existingUser = yield clientModel_1.default.findOne({ email });
        const otp = (0, otp_1.generateOtp)();
        const expiresAt = (0, otp_1.otpExpiry)();
        yield Otp_1.default.findOneAndUpdate({ email }, {
            otp,
            expiresAt,
            purpose: existingUser ? 'login' : 'register'
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        // Try to send OTP email
        try {
            yield (0, mailer_1.sendOtpMail)(email, otp);
            return res.status(200).json({
                success: true,
                message: "OTP sent to email successfully",
                email,
                purpose: existingUser ? 'login' : 'register'
            });
        }
        catch (mailError) {
            console.error("Mail Error:", mailError);
            // For development/testing, return OTP in response
            if (process.env.NODE_ENV === 'development') {
                return res.status(200).json({
                    success: true,
                    message: "OTP generated (email service failed in development)",
                    email,
                    otp, // Return OTP in development
                    expiresAt,
                    purpose: existingUser ? 'login' : 'register'
                });
            }
            else {
                return res.status(500).json({
                    success: false,
                    error: "Failed to send OTP email"
                });
            }
        }
    }
    catch (error) {
        console.error("OTP Error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to process OTP request"
        });
    }
});
exports.sendOtp = sendOtp;
// 📝 Create/Register user (matches /create route)
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, gender, email, otp } = req.body;
        // Validate all fields
        if (!name || !gender || !email || !otp) {
            return res.status(400).json({
                success: false,
                error: "All fields are required: name, gender, email, otp"
            });
        }
        // Validate gender
        const validGenders = ['male', 'female', 'other'];
        if (!validGenders.includes(gender.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: "Gender must be male, female, or other"
            });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email format"
            });
        }
        // Verify OTP
        const otpRecord = yield Otp_1.default.findOne({ email, purpose: 'register' }).session(session);
        if (!otpRecord) {
            yield session.abortTransaction();
            return res.status(400).json({
                success: false,
                error: "No OTP found for this email. Please request a new OTP."
            });
        }
        if (otpRecord.otp !== otp) {
            yield session.abortTransaction();
            return res.status(401).json({
                success: false,
                error: "Invalid OTP"
            });
        }
        if (otpRecord.expiresAt < new Date()) {
            yield session.abortTransaction();
            return res.status(401).json({
                success: false,
                error: "OTP has expired. Please request a new OTP."
            });
        }
        // Check if user already exists
        const existingUser = yield clientModel_1.default.findOne({ email }).session(session);
        if (existingUser) {
            yield session.abortTransaction();
            return res.status(409).json({
                success: false,
                error: "User already exists. Please login instead."
            });
        }
        // Create new user
        const user = new clientModel_1.default({
            name,
            gender: gender.toLowerCase(),
            email,
            role: "client",
            profileCompleted: false,
            profile: {
                verified: false,
                skills: []
            }
        });
        yield user.save({ session });
        // Delete used OTP
        yield Otp_1.default.deleteOne({ email }).session(session);
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString(), "client", user.email);
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        yield session.commitTransaction();
        return res.status(201).json({
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
                    createdAt: user.createdAt
                },
                token
            }
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Registration Error:", error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                details: error.errors
            });
        }
        return res.status(500).json({
            success: false,
            error: "Registration failed. Please try again."
        });
    }
    finally {
        session.endSession();
    }
});
exports.createUser = createUser;
// 🔐 Login user (matches /login route)
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: "Email and OTP are required"
            });
        }
        // Find user
        const user = yield clientModel_1.default.findOne({ email }).session(session);
        if (!user) {
            yield session.abortTransaction();
            return res.status(404).json({
                success: false,
                error: "User not found. Please register first."
            });
        }
        // Verify OTP
        const otpRecord = yield Otp_1.default.findOne({ email, purpose: 'login' }).session(session);
        if (!otpRecord) {
            yield session.abortTransaction();
            return res.status(400).json({
                success: false,
                error: "No OTP found. Please request a new OTP."
            });
        }
        if (otpRecord.otp !== otp) {
            yield session.abortTransaction();
            return res.status(401).json({
                success: false,
                error: "Invalid OTP"
            });
        }
        if (otpRecord.expiresAt < new Date()) {
            yield session.abortTransaction();
            return res.status(401).json({
                success: false,
                error: "OTP has expired. Please request a new OTP."
            });
        }
        // Delete used OTP
        yield Otp_1.default.deleteOne({ email }).session(session);
        // Generate token
        const token = (0, jwt_1.generateToken)(user._id.toString(), "client", user.email);
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        yield session.commitTransaction();
        return res.status(200).json({
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
                    profile: user.profile || {}
                },
                token
            }
        });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            error: "Login failed. Please try again."
        });
    }
    finally {
        session.endSession();
    }
});
exports.loginUser = loginUser;
// 🚪 Logout user (matches /logout route)
const logoutUser = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};
exports.logoutUser = logoutUser;
// 👤 Get user by email (matches /get-user route)
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                error: "Email is required"
            });
        }
        const user = yield clientModel_1.default.findOne({ email })
            .select("-__v")
            .lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        // Convert _id to id for consistency
        const userResponse = Object.assign(Object.assign({}, user), { id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString() });
        delete userResponse._id;
        return res.status(200).json({
            success: true,
            data: { user: userResponse }
        });
    }
    catch (error) {
        console.error("Get User Error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to get user"
        });
    }
});
exports.getUser = getUser;
// ✏️ Update user profile (matches /update and / routes)
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { profile } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        if (!profile || typeof profile !== 'object') {
            return res.status(400).json({
                success: false,
                error: "Profile data is required"
            });
        }
        const updatedUser = yield clientModel_1.default.findByIdAndUpdate(userId, {
            $set: {
                profile: Object.assign({}, profile),
                profileCompleted: true
            }
        }, {
            new: true,
            runValidators: true
        }).select("-__v");
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        const userResponse = {
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            gender: updatedUser.gender,
            role: updatedUser.role,
            profileCompleted: updatedUser.profileCompleted,
            profile: updatedUser.profile || {},
            createdAt: updatedUser.createdAt
        };
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { user: userResponse }
        });
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            return res.status(400).json({
                success: false,
                error: "Profile validation failed",
                details: error.errors
            });
        }
        return res.status(500).json({
            success: false,
            error: "Profile update failed"
        });
    }
});
exports.updateUser = updateUser;
// 👥 Get all users (matches /get-all-users route)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield clientModel_1.default.find()
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();
        // Convert all _id to id
        const usersResponse = users.map(user => {
            var _a;
            return (Object.assign(Object.assign({}, user), { id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString() }));
        }).map((_a) => {
            var { _id } = _a, rest = __rest(_a, ["_id"]);
            return rest;
        }); // Remove _id
        return res.status(200).json({
            success: true,
            count: usersResponse.length,
            data: { users: usersResponse }
        });
    }
    catch (error) {
        console.error("Get All Users Error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve users"
        });
    }
});
exports.getAllUsers = getAllUsers;
// 📌 User's applied jobs (matches /applied-jobs route)
const getClientApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (role !== "client") {
            return res.status(403).json({
                success: false,
                error: "Access denied. Only clients can view their applications"
            });
        }
        const applications = yield Application_1.default.find({ clientId: userId })
            .populate("jobId", "title description budget duration category status")
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            count: applications.length,
            data: { applications }
        });
    }
    catch (error) {
        console.error("Get client applications error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch job applications"
        });
    }
});
exports.getClientApplications = getClientApplications;
// 📄 Get user profile by ID (matches /get-user-by-id/:id route)
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
        }
        const user = yield clientModel_1.default.findById(id)
            .select("-__v")
            .lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        // Convert _id to id
        const userResponse = Object.assign(Object.assign({}, user), { id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString() });
        delete userResponse._id;
        return res.status(200).json({
            success: true,
            data: { user: userResponse }
        });
    }
    catch (error) {
        console.error("Get User By ID Error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve user"
        });
    }
});
exports.getUserById = getUserById;
// 👤 Get own profile (matches /profile route)
// In userController.ts - update getProfile function
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log("🔍 getProfile - User ID from token:", userId);
        console.log("🔍 Full user object from req.user:", req.user);
        if (!userId) {
            console.log("❌ No user ID in token");
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        // Check if userId is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            console.log("❌ Invalid user ID format:", userId);
            return res.status(400).json({
                success: false,
                error: "Invalid user ID format"
            });
        }
        // Find user by ID
        console.log("🔍 Searching for user with ID:", userId);
        const user = yield clientModel_1.default.findById(userId)
            .select("name gender email profile profileCompleted createdAt")
            .lean();
        console.log("🔍 User found in DB:", user ? "Yes" : "No");
        if (!user) {
            console.log("❌ User not found in database for ID:", userId);
            // Debug: List all users in database
            const allUsers = yield clientModel_1.default.find({}).select("_id name email").lean();
            console.log("📊 All users in database:", allUsers.map(u => ({
                id: u._id.toString(),
                name: u.name,
                email: u.email
            })));
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        console.log("✅ User found:", {
            id: (_b = user._id) === null || _b === void 0 ? void 0 : _b.toString(),
            name: user.name,
            email: user.email
        });
        // Prepare user data for response
        const userResponse = {
            id: (_c = user._id) === null || _c === void 0 ? void 0 : _c.toString(),
            name: user.name,
            email: user.email,
            gender: user.gender,
            role: "client",
            profileCompleted: user.profileCompleted || false,
            profile: user.profile || {},
            createdAt: user.createdAt
        };
        console.log("✅ Sending user response");
        return res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                user: userResponse
            }
        });
    }
    catch (error) {
        console.error("❌ Error fetching profile:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch profile"
        });
    }
});
exports.getProfile = getProfile;
// 🔄 Additional OTP verification function (optional - not in routes yet)
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: "Email and OTP are required"
            });
        }
        const otpRecord = yield Otp_1.default.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                error: "No OTP found for this email"
            });
        }
        if (otpRecord.otp !== otp) {
            return res.status(401).json({
                success: false,
                error: "Invalid OTP"
            });
        }
        if (otpRecord.expiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                error: "OTP has expired"
            });
        }
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: {
                email,
                purpose: otpRecord.purpose,
                expiresAt: otpRecord.expiresAt
            }
        });
    }
    catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to verify OTP"
        });
    }
});
exports.verifyOtp = verifyOtp;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const userRoutes = (0, express_1.Router)();
// 🔍 TEST ROUTE - Put this FIRST
userRoutes.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "User routes are working!",
        availableRoutes: [
            "GET /test",
            "GET /debug/otps/:email",
            "POST /send-otp",
            "POST /create",
            "POST /login",
            "POST /logout",
            "GET /profile",
            "PUT /update",
            "GET /get-user",
            "GET /get-all-users",
            "GET /applied-jobs",
            "GET /get-user-by-id/:id",
        ],
    });
});
// 🔍 DEBUG ROUTE - Put this SECOND
userRoutes.get("/debug/otps/:email", userController_1.debugEmail);
// 🔐 OTP
userRoutes.post("/send-otp", userController_1.sendOtp);
// 📝 Register & Login
userRoutes.post("/create", userController_1.createUser);
userRoutes.post("/login", userController_1.loginUser);
// 🔓 Logout
userRoutes.post("/logout", userController_1.logoutUser);
// 👤 User Profile
userRoutes.get("/profile", auth_1.authMiddleware, userController_1.getProfile);
userRoutes.put("/update", auth_1.authMiddleware, userController_1.updateUser);
userRoutes.put("/", auth_1.authMiddleware, userController_1.updateUser);
userRoutes.get("/get-user", userController_1.getUser);
userRoutes.get("/get-all-users", userController_1.getAllUsers);
// 👇 Get applied jobs
userRoutes.get("/applied-jobs", auth_1.authMiddleware, userController_1.getClientApplications);
userRoutes.get("/get-user-by-id/:id", userController_1.getUserById);
exports.default = userRoutes;

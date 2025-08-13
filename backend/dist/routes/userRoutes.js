"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const userRoutes = (0, express_1.Router)();
// 🔐 OTP
userRoutes.post("/send-otp", userController_1.sendOtp);
// 📝 Register & Login
userRoutes.post("/create", userController_1.createUser); // also works as register
userRoutes.post("/login", userController_1.loginUser); // OTP-based login
// 🔓 Logout
userRoutes.post("/logout", userController_1.logoutUser);
// 👤 User Profile
userRoutes.get("/profile", auth_1.authMiddleware, userController_1.getProfile);
userRoutes.put("/update", auth_1.authMiddleware, userController_1.updateUser); // complete/update profile
userRoutes.put("/", auth_1.authMiddleware, userController_1.updateUser); // complete/update profile
userRoutes.get("/get-user", userController_1.getUser); // get user by email
userRoutes.get("/get-all-users", userController_1.getAllUsers); // get all users (admin)
// 👇 Get applied jobs
userRoutes.get("/applied-jobs", auth_1.authMiddleware, userController_1.getClientApplications);
userRoutes.get("/get-user-by-id/:id", userController_1.getUserById);
exports.default = userRoutes;

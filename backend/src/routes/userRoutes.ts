import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  sendOtp,
  loginUser,
  logoutUser,
  getAllUsers,
  getClientApplications,
  getProfile,
  getUserById,
  debugEmail,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";

const userRoutes: Router = Router();

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
userRoutes.get("/debug/otps/:email", debugEmail);

// 🔐 OTP
userRoutes.post("/send-otp", sendOtp);

// 📝 Register & Login
userRoutes.post("/create", createUser);
userRoutes.post("/login", loginUser);

// 🔓 Logout
userRoutes.post("/logout", logoutUser);

// 👤 User Profile
userRoutes.get("/profile", authMiddleware, getProfile);
userRoutes.put("/update", authMiddleware, updateUser);
userRoutes.put("/", authMiddleware, updateUser);
userRoutes.get("/get-user", getUser);
userRoutes.get("/get-all-users", getAllUsers);

// 👇 Get applied jobs
userRoutes.get("/applied-jobs", authMiddleware, getClientApplications);
userRoutes.get("/get-user-by-id/:id", getUserById);

export default userRoutes;

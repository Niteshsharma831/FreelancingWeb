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
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";

const userRoutes: Router = Router();

// 🔐 OTP
userRoutes.post("/send-otp", sendOtp);

// 📝 Register & Login
userRoutes.post("/create", createUser);       // also works as register
userRoutes.post("/login", loginUser);         // OTP-based login

// 🔓 Logout
userRoutes.post("/logout", logoutUser);

// 👤 User Profile
userRoutes.get("/profile", authMiddleware, getProfile);
userRoutes.put("/update", authMiddleware, updateUser); // complete/update profile
userRoutes.put("/", authMiddleware, updateUser); // complete/update profile
userRoutes.get("/get-user", getUser);         // get user by email
userRoutes.get("/get-all-users", getAllUsers); // get all users (admin)

// 👇 Get applied jobs
userRoutes.get("/applied-jobs", authMiddleware, getClientApplications);
userRoutes.get("/get-user-by-id/:id", getUserById);

export default userRoutes;

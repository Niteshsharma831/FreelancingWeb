import { Request, Response } from "express";
import Client from "../models/clientModel";
import Otp from "../models/Otp";
import JobApplication from "../models/Application";
import { generateOtp, otpExpiry } from "../utils/otp";
import { sendOtpMail } from "../utils/mailer";
import { generateToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

// 🔐 Middleware to protect routes
export const protect = (req: Request, res: Response, next: Function) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// 📩 Send OTP to email
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = generateOtp();
    const expiresAt = otpExpiry();

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpMail(email, otp);
    res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// 📝 Register client (OTP-based)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, gender, email, otp } = req.body;
    if (!name || !gender || !email || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    let user = await Client.findOne({ email });
    if (user) {
      return res.status(409).json({ error: "Already registered. Please login." });
    }

    user = new Client({
      name,
      gender,
      email,
      role: "client",
      profileCompleted: false,
    });

    await user.save();
    await Otp.deleteOne({ email });

    const token = generateToken(user._id.toString(), "client");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Client registered", user, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// 🔐 Login client (OTP-based)
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Client not found" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    await Otp.deleteOne({ email });
   const token = generateToken(user._id.toString(), "client", user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// 🚪 Logout client
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

// 👤 Get client by email
export const getUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Could not get user" });
  }
};

// ✏️ Update client profile
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { profile } = req.body;
    const userId = (req as any).user.id;  // FIXED here

    const updatedUser = await Client.findByIdAndUpdate(
      userId,
      { $set: { profile, profileCompleted: true } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Profile update failed" });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware

    const user = await Client.findById(userId).select(
      "name gender email avatar profile"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user); // Now includes profile
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// 👥 Get all clients (for admin use)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Client.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

// 📌 Client's applied jobs
export const getClientApplications = async (req: Request, res: Response) => {
  try {
    const { userId, role } = (req as any).user;

    if (role !== "client") {
      return res.status(403).json({ error: "Only clients can view their applications" });
    }

    const applications = await JobApplication.find({ clientId: userId })
      .populate("jobId", "title description budget duration category")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Get client applications error:", error);
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
};

// 📄 Get full client profile by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await Client.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

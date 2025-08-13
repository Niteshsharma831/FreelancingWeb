import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Freelancer from "../models/Freelancer";
import Otp from "../models/Otp";
import { generateOtp, otpExpiry } from "../utils/otp";
import { sendOtpMail } from "../utils/mailer";
import { generateToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

// Helper to safely convert Mongo ObjectId to string
const getIdString = (id: any) => (id as mongoose.Types.ObjectId).toString();

// Send OTP
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = generateOtp();
  const expiresAt = otpExpiry();

  await Otp.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true });
  await sendOtpMail(email, otp);
  res.status(200).json({ message: "OTP sent" });
};

// Register Freelancer
export const registerFreelancer = async (req: Request, res: Response) => {
  const { name, gender, email, otp } = req.body;

  const existing = await Freelancer.findOne({ email });
  if (existing) return res.status(409).json({ error: "Already registered" });

  const otpRecord = await Otp.findOne({ email });
  if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  const user = new Freelancer({
    name,
    gender,
    email,
    role: "freelancer",
    profileCompleted: false,
  });

  await user.save();
  await Otp.deleteOne({ email });

  const userId = getIdString(user._id);
  const token = generateToken(userId, user.role, user.email); // ✅ Pass 3 args

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({ message: "Freelancer registered", user, token });
};

// Login
export const loginFreelancer = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await Freelancer.findOne({ email });
  if (!user) return res.status(404).json({ error: "Not registered" });

  const otpRecord = await Otp.findOne({ email });
  if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt < new Date()) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  await Otp.deleteOne({ email });

  const userId = getIdString(user._id);
  const token = generateToken(userId, user.role, user.email); // ✅ Pass 3 args

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "Login successful", user, token });
};

// Logout
export const logoutFreelancer = async (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// Protect middleware
export const protectFreelancer = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

  if (!token) return res.status(401).json({ error: "Login first" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (decoded.role !== "freelancer") return res.status(403).json({ error: "Access denied" });

    (req as any).user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Update Profile
export const updateFreelancer = async (req: Request, res: Response) => {
  const { profile } = req.body;
  const userId = (req as any).user.id;

  const updated = await Freelancer.findByIdAndUpdate(
    userId,
    { $set: { profile, profileCompleted: true } },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: "Freelancer not found" });

  res.status(200).json({ message: "Profile updated", user: updated });
};

// Get a single freelancer
export const getFreelancer = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    const freelancer = email
      ? await Freelancer.findOne({ email })
      : await Freelancer.findById((req as any).user?.id);

    if (!freelancer) return res.status(404).json({ error: "Freelancer not found" });

    res.status(200).json({ user: freelancer });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch freelancer" });
  }
};

// Get all freelancers (for admin)
export const getAllFreelancers = async (_req: Request, res: Response) => {
  try {
    const freelancers = await Freelancer.find();
    res.status(200).json({ users: freelancers });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch freelancers" });
  }
};

// Get freelancer profile (authenticated)
export const getFreelancerProfile = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;

    if (!freelancerId) return res.status(401).json({ error: "Unauthorized" });

    const freelancer = await Freelancer.findById(freelancerId).select("name email");

    if (!freelancer) return res.status(404).json({ error: "Freelancer not found" });

    res.status(200).json(freelancer);
  } catch (error) {
    console.error("Error fetching freelancer profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

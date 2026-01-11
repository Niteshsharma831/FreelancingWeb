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

// Send OTP - FIXED with proper error handling
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const otp = generateOtp();
    const expiresAt = otpExpiry();

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpMail(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Register Freelancer - FIXED with better validation
export const registerFreelancer = async (req: Request, res: Response) => {
  try {
    const { name, gender, email, otp } = req.body;

    // Validate required fields
    if (!name || !gender || !email || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Freelancer.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(401).json({ error: "OTP expired" });
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
    const token = generateToken(userId, user.role, user.email);

    // FIXED: Correct cookie settings for production
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
};

// Login - FIXED with correct cookie settings
export const loginFreelancer = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    const user = await Freelancer.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not registered" });

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(401).json({ error: "OTP expired" });
    }

    await Otp.deleteOne({ email });

    const userId = getIdString(user._id);
    const token = generateToken(userId, user.role, user.email);

    // FIXED: Consistent cookie settings
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Logout - FIXED with correct cookie clearing
export const logoutFreelancer = async (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Protect middleware - FIXED to match token structure
export const protectFreelancer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // FIXED: The token should be verified with proper structure
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
      email: string;
      iat: number;
      exp: number;
    };

    // FIXED: Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: "Token expired" });
    }

    if (decoded.role !== "freelancer") {
      return res
        .status(403)
        .json({ error: "Access denied for non-freelancer" });
    }

    // FIXED: Attach user info to request
    req.user = {
      id: decoded.userId,
      role: decoded.role as "freelancer",
      email: decoded.email,
    };

    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Update Profile - FIXED with proper validation
export const updateFreelancer = async (req: Request, res: Response) => {
  try {
    const { profile } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!profile || typeof profile !== "object") {
      return res.status(400).json({ error: "Profile data required" });
    }

    const updated = await Freelancer.findByIdAndUpdate(
      userId,
      {
        $set: {
          profile: {
            ...profile,
            updatedAt: new Date(),
          },
          profileCompleted: true,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Freelancer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updated,
    });
  } catch (error: any) {
    console.error("Update error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid profile data" });
    }

    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Get a single freelancer - FIXED
export const getFreelancer = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    const userId = req.user?.id;

    let freelancer;

    if (email) {
      freelancer = await Freelancer.findOne({ email });
    } else if (userId) {
      freelancer = await Freelancer.findById(userId);
    } else {
      return res
        .status(400)
        .json({ error: "Email or authentication required" });
    }

    if (!freelancer) {
      return res.status(404).json({ error: "Freelancer not found" });
    }

    res.status(200).json({ success: true, user: freelancer });
  } catch (error) {
    console.error("Get freelancer error:", error);
    res.status(500).json({ error: "Failed to fetch freelancer" });
  }
};

// Get all freelancers - FIXED
export const getAllFreelancers = async (req: Request, res: Response) => {
  try {
    const freelancers = await Freelancer.find().select("-__v");
    res.status(200).json({ success: true, users: freelancers });
  } catch (error) {
    console.error("Get all freelancers error:", error);
    res.status(500).json({ error: "Failed to fetch freelancers" });
  }
};

// Get freelancer profile - FIXED
export const getFreelancerProfile = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;

    if (!freelancerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const freelancer = await Freelancer.findById(freelancerId).select("-__v");

    if (!freelancer) {
      return res.status(404).json({ error: "Freelancer not found" });
    }

    res.status(200).json({ success: true, user: freelancer });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

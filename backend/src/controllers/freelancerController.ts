import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Freelancer from "../models/Freelancer";
import Otp from "../models/Otp";
import { generateOtp, otpExpiry } from "../utils/otp";
import { sendOtpMail } from "../utils/mailer";
import { generateToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

// Helper to safely convert Mongo ObjectId to string
const getIdString = (id: any): string => {
  if (id instanceof mongoose.Types.ObjectId) {
    return id.toString();
  }
  return String(id);
};

// Send OTP
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }

    const otp = generateOtp();
    const expiresAt = otpExpiry();

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOtpMail(email, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error: unknown) {
    console.error("Send OTP error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to send OTP" });
    }
  }
};

// Register Freelancer
export const registerFreelancer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, gender, email, otp } = req.body;

    // Validate required fields
    if (!name || !gender || !email || !otp) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const existing = await Freelancer.findOne({ email });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      res.status(401).json({ error: "Invalid OTP" });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      res.status(401).json({ error: "OTP expired" });
      return;
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

    // Correct cookie settings for production
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
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
  } catch (error: unknown) {
    console.error("Registration error:", error);

    if (error instanceof Error && "code" in error) {
      const err = error as any;
      if (err.code === 11000) {
        res.status(409).json({ error: "Email already exists" });
        return;
      }
    }

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
};

// Login
export const loginFreelancer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP required" });
      return;
    }

    const user = await Freelancer.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not registered" });
      return;
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      res.status(401).json({ error: "Invalid OTP" });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      res.status(401).json({ error: "OTP expired" });
      return;
    }

    await Otp.deleteOne({ email });

    const userId = getIdString(user._id);
    const token = generateToken(userId, user.role, user.email);

    // Consistent cookie settings
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
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
  } catch (error: unknown) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Login failed" });
    }
  }
};

// Logout
export const logoutFreelancer = (req: Request, res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Protect middleware
export const protectFreelancer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // Verify token with proper structure
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
      email: string;
      iat: number;
      exp: number;
    };

    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      res.status(401).json({ error: "Token expired" });
      return;
    }

    if (decoded.role !== "freelancer") {
      res.status(403).json({ error: "Access denied for non-freelancer" });
      return;
    }

    // Attach user info to request - This matches your Express type definition
    req.user = {
      id: decoded.userId,
      role: "freelancer",
      email: decoded.email,
    };

    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === "JsonWebTokenError") {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
      if (err.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token expired" });
        return;
      }
      console.error("Auth middleware error:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.error("Unknown auth middleware error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Update Profile
export const updateFreelancer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profile } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!profile || typeof profile !== "object") {
      res.status(400).json({ error: "Profile data required" });
      return;
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
      res.status(404).json({ error: "Freelancer not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updated,
    });
  } catch (error: unknown) {
    console.error("Update error:", error);

    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        res.status(400).json({ error: "Invalid profile data" });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Get a single freelancer
export const getFreelancer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.query;
    const userId = req.user?.id;

    let freelancer;

    if (email && typeof email === "string") {
      freelancer = await Freelancer.findOne({ email });
    } else if (userId) {
      freelancer = await Freelancer.findById(userId);
    } else {
      res.status(400).json({ error: "Email or authentication required" });
      return;
    }

    if (!freelancer) {
      res.status(404).json({ error: "Freelancer not found" });
      return;
    }

    res.status(200).json({ success: true, user: freelancer });
  } catch (error: unknown) {
    console.error("Get freelancer error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to fetch freelancer" });
    }
  }
};

// Get all freelancers
export const getAllFreelancers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const freelancers = await Freelancer.find().select("-__v");
    res.status(200).json({ success: true, users: freelancers });
  } catch (error: unknown) {
    console.error("Get all freelancers error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to fetch freelancers" });
    }
  }
};

// Get freelancer profile
export const getFreelancerProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const freelancerId = req.user?.id;

    if (!freelancerId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const freelancer = await Freelancer.findById(freelancerId).select("-__v");

    if (!freelancer) {
      res.status(404).json({ error: "Freelancer not found" });
      return;
    }

    res.status(200).json({ success: true, user: freelancer });
  } catch (error: unknown) {
    console.error("Get profile error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  }
};

// Additional utility function: Verify freelancer
export const verifyFreelancer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const freelancerId = req.user?.id;

    if (!freelancerId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const freelancer = await Freelancer.findById(freelancerId);

    if (!freelancer) {
      res.status(404).json({ error: "Freelancer not found" });
      return;
    }

    res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: {
        _id: freelancer._id,
        name: freelancer.name,
        email: freelancer.email,
        role: freelancer.role,
        profileCompleted: freelancer.profileCompleted,
      },
    });
  } catch (error: unknown) {
    console.error("Verify freelancer error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Verification failed" });
    }
  }
};

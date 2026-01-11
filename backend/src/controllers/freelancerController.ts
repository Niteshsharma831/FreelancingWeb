// import { Request, Response, NextFunction } from "express";
// import mongoose from "mongoose";
// import Freelancer from "../models/Freelancer";
// import Otp from "../models/Otp";
// import { generateOtp, otpExpiry } from "../utils/otp";
// import { sendOtpMail } from "../utils/mailer";
// import { generateToken } from "../utils/jwt";
// import jwt from "jsonwebtoken";

// // Helper to safely convert Mongo ObjectId to string
// const getIdString = (id: any) => (id as mongoose.Types.ObjectId).toString();

// // Send OTP - FIXED with proper error handling
// export const sendOtp = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ error: "Email required" });

//     const otp = generateOtp();
//     const expiresAt = otpExpiry();

//     await Otp.findOneAndUpdate(
//       { email },
//       { otp, expiresAt },
//       { upsert: true, new: true }
//     );

//     await sendOtpMail(email, otp);
//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Send OTP error:", error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// // Register Freelancer - FIXED with better validation
// export const registerFreelancer = async (req: Request, res: Response) => {
//   try {
//     const { name, gender, email, otp } = req.body;

//     // Validate required fields
//     if (!name || !gender || !email || !otp) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const existing = await Freelancer.findOne({ email });
//     if (existing) return res.status(409).json({ error: "Email already registered" });

//     const otpRecord = await Otp.findOne({ email });
//     if (!otpRecord || otpRecord.otp !== otp) {
//       return res.status(401).json({ error: "Invalid OTP" });
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       await Otp.deleteOne({ email });
//       return res.status(401).json({ error: "OTP expired" });
//     }

//     const user = new Freelancer({
//       name,
//       gender,
//       email,
//       role: "freelancer",
//       profileCompleted: false,
//     });

//     await user.save();
//     await Otp.deleteOne({ email });

//     const userId = getIdString(user._id);
//     const token = generateToken(userId, user.role, user.email);

//     // FIXED: Correct cookie settings for production
//     const isProduction = process.env.NODE_ENV === "production";

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       path: "/",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         profileCompleted: user.profileCompleted
//       }
//     });
//   } catch (error: any) {
//     console.error("Registration error:", error);

//     if (error.code === 11000) {
//       return res.status(409).json({ error: "Email already exists" });
//     }

//     res.status(500).json({ error: "Registration failed" });
//   }
// };

// // Login - FIXED with correct cookie settings
// export const loginFreelancer = async (req: Request, res: Response) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ error: "Email and OTP required" });
//     }

//     const user = await Freelancer.findOne({ email });
//     if (!user) return res.status(404).json({ error: "User not registered" });

//     const otpRecord = await Otp.findOne({ email });
//     if (!otpRecord || otpRecord.otp !== otp) {
//       return res.status(401).json({ error: "Invalid OTP" });
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       await Otp.deleteOne({ email });
//       return res.status(401).json({ error: "OTP expired" });
//     }

//     await Otp.deleteOne({ email });

//     const userId = getIdString(user._id);
//     const token = generateToken(userId, user.role, user.email);

//     // FIXED: Consistent cookie settings
//     const isProduction = process.env.NODE_ENV === "production";

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: isProduction,
//       sameSite: isProduction ? "none" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       path: "/",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         profileCompleted: user.profileCompleted
//       }
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Login failed" });
//   }
// };

// // Logout - FIXED with correct cookie clearing
// export const logoutFreelancer = async (req: Request, res: Response) => {
//   const isProduction = process.env.NODE_ENV === "production";

//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: isProduction,
//     sameSite: isProduction ? "none" : "lax",
//     path: "/",
//   });

//   res.status(200).json({ success: true, message: "Logged out successfully" });
// };

// // Protect middleware - FIXED to match token structure
// export const protectFreelancer = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//     const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

//     if (!token) {
//       return res.status(401).json({ error: "Authentication required" });
//     }

//     // FIXED: The token should be verified with proper structure
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       userId: string;
//       role: string;
//       email: string;
//       iat: number;
//       exp: number;
//     };

//     // FIXED: Check if token is expired
//     if (Date.now() >= decoded.exp * 1000) {
//       return res.status(401).json({ error: "Token expired" });
//     }

//     if (decoded.role !== "freelancer") {
//       return res.status(403).json({ error: "Access denied for non-freelancer" });
//     }

//     // FIXED: Attach user info to request
//     (req as any).user = {
//       id: decoded.userId,
//       role: decoded.role,
//       email: decoded.email
//     };

//     next();
//   } catch (err: any) {
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(403).json({ error: "Invalid token" });
//     }
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: "Token expired" });
//     }
//     console.error("Auth middleware error:", err);
//     res.status(500).json({ error: "Authentication failed" });
//   }
// };

// // Update Profile - FIXED with proper validation
// export const updateFreelancer = async (req: Request, res: Response) => {
//   try {
//     const { profile } = req.body;
//     const userId = (req as any).user?.id;

//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     if (!profile || typeof profile !== 'object') {
//       return res.status(400).json({ error: "Profile data required" });
//     }

//     const updated = await Freelancer.findByIdAndUpdate(
//       userId,
//       {
//         $set: {
//           profile: {
//             ...profile,
//             updatedAt: new Date()
//           },
//           profileCompleted: true
//         }
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ error: "Freelancer not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Profile updated",
//       user: updated
//     });
//   } catch (error: any) {
//     console.error("Update error:", error);

//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ error: "Invalid profile data" });
//     }

//     res.status(500).json({ error: "Failed to update profile" });
//   }
// };

// // Get a single freelancer - FIXED
// export const getFreelancer = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.query;
//     const userId = (req as any).user?.id;

//     let freelancer;

//     if (email) {
//       freelancer = await Freelancer.findOne({ email });
//     } else if (userId) {
//       freelancer = await Freelancer.findById(userId);
//     } else {
//       return res.status(400).json({ error: "Email or authentication required" });
//     }

//     if (!freelancer) {
//       return res.status(404).json({ error: "Freelancer not found" });
//     }

//     res.status(200).json({ success: true, user: freelancer });
//   } catch (error) {
//     console.error("Get freelancer error:", error);
//     res.status(500).json({ error: "Failed to fetch freelancer" });
//   }
// };

// // Get all freelancers - FIXED
// export const getAllFreelancers = async (req: Request, res: Response) => {
//   try {
//     const freelancers = await Freelancer.find().select("-__v");
//     res.status(200).json({ success: true, users: freelancers });
//   } catch (error) {
//     console.error("Get all freelancers error:", error);
//     res.status(500).json({ error: "Failed to fetch freelancers" });
//   }
// };

// // Get freelancer profile - FIXED
// export const getFreelancerProfile = async (req: Request, res: Response) => {
//   try {
//     const freelancerId = (req as any).user?.id;

//     if (!freelancerId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const freelancer = await Freelancer.findById(freelancerId).select("-__v");

//     if (!freelancer) {
//       return res.status(404).json({ error: "Freelancer not found" });
//     }

//     res.status(200).json({ success: true, user: freelancer });
//   } catch (error) {
//     console.error("Get profile error:", error);
//     res.status(500).json({ error: "Failed to fetch profile" });
//   }
// };

// src/controllers/application.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Application from "../models/Application";
import Job from "../models/Job";
import Client from "../models/clientModel";
import Freelancer from "../models/Freelancer";

// Simple type extension for Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
      };
    }
  }
}

// 🆕 Create a new job application
export const createApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { jobId, proposal } = req.body;

    // Validate required fields
    if (!jobId || !proposal) {
      res.status(400).json({
        success: false,
        error: "Job ID and proposal are required",
      });
      return;
    }

    // Check if user is a freelancer
    if (userRole !== "freelancer") {
      res.status(403).json({
        success: false,
        error: "Only freelancers can apply for jobs",
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({
        success: false,
        error: "Job not found",
      });
      return;
    }

    // Check if job is open for applications
    if (job.status !== "open") {
      res.status(400).json({
        success: false,
        error: `Job is ${job.status}. Cannot apply.`,
      });
      return;
    }

    // Check if freelancer exists
    const freelancer = await Freelancer.findById(userId);
    if (!freelancer) {
      res.status(404).json({
        success: false,
        error: "Freelancer not found",
      });
      return;
    }

    // Create new application - Updated to match your model
    const application = new Application({
      jobId,
      clientId: job.clientId,
      proposal,
      status: "pending",
    });

    await application.save();

    // Update job applications count if the field exists
    if (job.applicationsCount !== undefined) {
      await Job.findByIdAndUpdate(jobId, {
        $inc: { applicationsCount: 1 },
      });
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: { application },
    });
  } catch (error: unknown) {
    console.error("Create application error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: Object.values(error.errors).map((err) => err.message),
      });
      return;
    }

    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        error: "Invalid ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create application",
    });
  }
};

// 📋 Get all applications for a specific job
export const getJobApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!jobId) {
      res.status(400).json({
        success: false,
        error: "Job ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({
        success: false,
        error: "Job not found",
      });
      return;
    }

    let applications;

    if (userRole === "client") {
      // Client can only see applications for their own jobs
      if (job.clientId.toString() !== userId) {
        res.status(403).json({
          success: false,
          error:
            "Access denied. You can only view applications for your own jobs",
        });
        return;
      }

      applications = await Application.find({ jobId, clientId: userId }).sort({
        appliedAt: -1,
      });
    } else if (userRole === "freelancer") {
      // Note: Your model doesn't have freelancerId, so we need to check differently
      // For now, freelancers can see all applications for a job (might need to update model)
      applications = await Application.find({ jobId }).sort({ appliedAt: -1 });
    } else {
      res.status(403).json({
        success: false,
        error: "Access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: { applications },
    });
  } catch (error: unknown) {
    console.error("Get job applications error:", error);

    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        error: "Invalid job ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch applications",
    });
  }
};

// ✏️ Update application status (Client only)
export const updateApplicationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!id || !status) {
      res.status(400).json({
        success: false,
        error: "Application ID and status are required",
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    // Check if user is a client
    if (userRole !== "client") {
      res.status(403).json({
        success: false,
        error: "Only clients can update application status",
      });
      return;
    }

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({
        success: false,
        error: "Application not found",
      });
      return;
    }

    // Check if client owns the job
    if (application.clientId.toString() !== userId) {
      res.status(403).json({
        success: false,
        error:
          "Access denied. You can only update applications for your own jobs",
      });
      return;
    }

    // Update status
    application.status = status;
    await application.save();

    // If accepted, update job status
    if (status === "accepted") {
      await Job.findByIdAndUpdate(application.jobId, {
        status: "in_progress",
        // Note: Your Application model doesn't have freelancerId
        // You might need to update your models
      });

      // Reject all other applications for this job
      await Application.updateMany(
        {
          jobId: application.jobId,
          _id: { $ne: application._id },
          status: "pending",
        },
        { status: "rejected" }
      );
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: { application },
    });
  } catch (error: unknown) {
    console.error("Update application status error:", error);

    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        error: "Invalid application ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update application status",
    });
  }
};

// ❌ Delete/cancel application
export const deleteApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Application ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.status(404).json({
        success: false,
        error: "Application not found",
      });
      return;
    }

    let hasPermission = false;

    if (userRole === "client") {
      // Client can delete applications for their own jobs
      hasPermission = application.clientId.toString() === userId;
    } else if (userRole === "freelancer") {
      // Note: Your model doesn't have freelancerId field
      // You need to update your Application model to include freelancerId
      hasPermission = false; // Temporary - need model update
    }

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: "Access denied",
      });
      return;
    }

    // Check if application can be deleted (only pending)
    if (application.status !== "pending") {
      res.status(400).json({
        success: false,
        error: `Cannot delete application with status: ${application.status}`,
      });
      return;
    }

    // Delete the application
    await Application.deleteOne({ _id: id });

    // Decrement applications count in job
    const job = await Job.findById(application.jobId);
    if (
      job &&
      job.applicationsCount !== undefined &&
      job.applicationsCount > 0
    ) {
      await Job.findByIdAndUpdate(application.jobId, {
        $inc: { applicationsCount: -1 },
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete application error:", error);

    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        error: "Invalid application ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete application",
    });
  }
};

// 🔍 Get single application by ID
export const getApplicationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Application ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    const application = await Application.findById(id)
      .populate("jobId", "title description budget duration category status")
      .populate("clientId", "name email");

    if (!application) {
      res.status(404).json({
        success: false,
        error: "Application not found",
      });
      return;
    }

    // Check permissions
    let hasPermission = false;

    if (userRole === "client") {
      hasPermission = application.clientId.toString() === userId;
    } else if (userRole === "freelancer") {
      // Note: Your model needs freelancerId field
      // hasPermission = application.freelancerId.toString() === userId;
      hasPermission = false; // Temporary
    } else if (userRole === "admin") {
      hasPermission = true;
    }

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: "Access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { application },
    });
  } catch (error: unknown) {
    console.error("Get application by ID error:", error);

    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        error: "Invalid application ID format",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch application",
    });
  }
};

// 📊 Get application statistics
export const getApplicationStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    let stats;

    if (userRole === "client") {
      // Client stats
      const totalApplications = await Application.countDocuments({
        clientId: userId,
      });
      const pendingApplications = await Application.countDocuments({
        clientId: userId,
        status: "pending",
      });
      const acceptedApplications = await Application.countDocuments({
        clientId: userId,
        status: "accepted",
      });

      stats = {
        total: totalApplications,
        pending: pendingApplications,
        accepted: acceptedApplications,
      };
    } else if (userRole === "freelancer") {
      // Note: Your model doesn't track freelancer applications
      // You need to update your Application model
      stats = {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        successRate: 0,
      };
    } else {
      res.status(403).json({
        success: false,
        error: "Access denied",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { stats },
    });
  } catch (error: unknown) {
    console.error("Get application stats error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch statistics",
    });
  }
};

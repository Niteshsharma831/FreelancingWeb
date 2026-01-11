// import { Request, Response } from "express";
// import mongoose from "mongoose";
// import Client from "../models/clientModel";
// import Otp from "../models/Otp";
// import JobApplication from "../models/Application";
// import { generateOtp, otpExpiry } from "../utils/otp";
// import { sendOtpMail } from "../utils/mailer";
// import { generateToken } from "../utils/jwt";

// // 📩 Send OTP to email (matches /send-otp route)
// export const sendOtp = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         error: "Email is required",
//       });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid email format",
//       });
//     }

//     // Check if user exists (for login) or not (for registration)
//     const existingUser = await Client.findOne({ email });

//     const otp = generateOtp();
//     const expiresAt = otpExpiry();

//     await Otp.findOneAndUpdate(
//       { email },
//       {
//         otp,
//         expiresAt,
//         purpose: existingUser ? "login" : "register",
//       },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     // Try to send OTP email
//     try {
//       await sendOtpMail(email, otp);

//       return res.status(200).json({
//         success: true,
//         message: "OTP sent to email successfully",
//         email,
//         purpose: existingUser ? "login" : "register",
//       });
//     } catch (mailError) {
//       console.error("Mail Error:", mailError);

//       // For development/testing, return OTP in response
//       if (process.env.NODE_ENV === "development") {
//         return res.status(200).json({
//           success: true,
//           message: "OTP generated (email service failed in development)",
//           email,
//           otp, // Return OTP in development
//           expiresAt,
//           purpose: existingUser ? "login" : "register",
//         });
//       } else {
//         return res.status(500).json({
//           success: false,
//           error: "Failed to send OTP email",
//         });
//       }
//     }
//   } catch (error) {
//     console.error("OTP Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to process OTP request",
//     });
//   }
// };

// // 📝 Create/Register user (matches /create route)
// export const createUser = async (req: Request, res: Response) => {
//   // Remove session and transaction
//   try {
//     const { name, gender, email, otp } = req.body;

//     // Validate all fields
//     if (!name || !gender || !email || !otp) {
//       return res.status(400).json({
//         success: false,
//         error: "All fields are required: name, gender, email, otp",
//       });
//     }

//     // Validate gender
//     const validGenders = ["male", "female", "other"];
//     if (!validGenders.includes(gender.toLowerCase())) {
//       return res.status(400).json({
//         success: false,
//         error: "Gender must be male, female, or other",
//       });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid email format",
//       });
//     }

//     // Verify OTP
//     const otpRecord = await Otp.findOne({ email, purpose: "register" });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         error: "No OTP found for this email. Please request a new OTP.",
//       });
//     }

//     if (otpRecord.otp !== otp) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid OTP",
//       });
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       return res.status(401).json({
//         success: false,
//         error: "OTP has expired. Please request a new OTP.",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await Client.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         error: "User already exists. Please login instead.",
//       });
//     }

//     // Create new user
//     const user = new Client({
//       name,
//       gender: gender.toLowerCase(),
//       email,
//       role: "client",
//       profileCompleted: false,
//       profile: {
//         verified: false,
//         skills: [],
//       },
//     });

//     await user.save();

//     // Delete used OTP
//     await Otp.deleteOne({ email });

//     // Generate token
//     const token = generateToken(user._id.toString(), "client", user.email);

//     // Set cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       data: {
//         user: {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           gender: user.gender,
//           role: user.role,
//           profileCompleted: user.profileCompleted,
//           profile: user.profile || {},
//           createdAt: user.createdAt,
//         },
//         token,
//       },
//     });
//   } catch (error) {
//     console.error("Registration Error:", error);

//     if (error instanceof mongoose.Error.ValidationError) {
//       return res.status(400).json({
//         success: false,
//         error: "Validation failed",
//         details: error.errors,
//       });
//     }

//     // Handle duplicate email error
//     if (error.code === 11000) {
//       return res.status(409).json({
//         success: false,
//         error: "Email already exists. Please use a different email.",
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       error: "Registration failed. Please try again.",
//     });
//   }
// };

// // 🔐 Login user (matches /login route)
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         error: "Email and OTP are required",
//       });
//     }

//     // Find user
//     const user = await Client.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found. Please register first.",
//       });
//     }

//     // Verify OTP
//     const otpRecord = await Otp.findOne({ email, purpose: "login" });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         error: "No OTP found. Please request a new OTP.",
//       });
//     }

//     if (otpRecord.otp !== otp) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid OTP",
//       });
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       return res.status(401).json({
//         success: false,
//         error: "OTP has expired. Please request a new OTP.",
//       });
//     }

//     // Delete used OTP
//     await Otp.deleteOne({ email });

//     // Generate token
//     const token = generateToken(user._id.toString(), "client", user.email);

//     // Set cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         user: {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           gender: user.gender,
//           role: user.role,
//           profileCompleted: user.profileCompleted,
//           profile: user.profile || {},
//         },
//         token,
//       },
//     });
//   } catch (error: any) {
//     console.log("Error Login", error.message);

//     return res.status(500).json({
//       success: false,
//       error: "Login failed. Please try again.",
//     });
//   }
// };
// // 🚪 Logout user (matches /logout route)
// export const logoutUser = (req: Request, res: Response) => {
//   res.clearCookie("token");
//   return res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

// // 👤 Get user by email (matches /get-user route)
// export const getUser = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.query;

//     if (!email || typeof email !== "string") {
//       return res.status(400).json({
//         success: false,
//         error: "Email is required",
//       });
//     }

//     const user = await Client.findOne({ email }).select("-__v").lean();

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found",
//       });
//     }

//     // Convert _id to id for consistency
//     const userResponse = {
//       ...user,
//       id: user._id?.toString(),
//     };
//     delete userResponse._id;

//     return res.status(200).json({
//       success: true,
//       data: { user: userResponse },
//     });
//   } catch (error) {
//     console.error("Get User Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to get user",
//     });
//   }
// };

// // ✏️ Update user profile (matches /update and / routes)
// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const { profile } = req.body;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         error: "Unauthorized",
//       });
//     }

//     if (!profile || typeof profile !== "object") {
//       return res.status(400).json({
//         success: false,
//         error: "Profile data is required",
//       });
//     }

//     const updatedUser = await Client.findByIdAndUpdate(
//       userId,
//       {
//         $set: {
//           profile: { ...profile },
//           profileCompleted: true,
//         },
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).select("-__v");

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found",
//       });
//     }

//     const userResponse = {
//       id: updatedUser._id.toString(),
//       name: updatedUser.name,
//       email: updatedUser.email,
//       gender: updatedUser.gender,
//       role: updatedUser.role,
//       profileCompleted: updatedUser.profileCompleted,
//       profile: updatedUser.profile || {},
//       createdAt: updatedUser.createdAt,
//     };

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: { user: userResponse },
//     });
//   } catch (error) {
//     console.error("Update Profile Error:", error);

//     if (error instanceof mongoose.Error.ValidationError) {
//       return res.status(400).json({
//         success: false,
//         error: "Profile validation failed",
//         details: error.errors,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       error: "Profile update failed",
//     });
//   }
// };

// // 👥 Get all users (matches /get-all-users route)
// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await Client.find()
//       .select("-__v")
//       .sort({ createdAt: -1 })
//       .lean();

//     // Convert all _id to id
//     const usersResponse = users
//       .map((user) => ({
//         ...user,
//         id: user._id?.toString(),
//       }))
//       .map(({ _id, ...rest }) => rest); // Remove _id

//     return res.status(200).json({
//       success: true,
//       count: usersResponse.length,
//       data: { users: usersResponse },
//     });
//   } catch (error) {
//     console.error("Get All Users Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to retrieve users",
//     });
//   }
// };

// // 📌 User's applied jobs (matches /applied-jobs route)
// export const getClientApplications = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;
//     const role = req.user?.role;

//     if (role !== "client") {
//       return res.status(403).json({
//         success: false,
//         error: "Access denied. Only clients can view their applications",
//       });
//     }

//     const applications = await JobApplication.find({ clientId: userId })
//       .populate("jobId", "title description budget duration category status")
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       success: true,
//       count: applications.length,
//       data: { applications },
//     });
//   } catch (error) {
//     console.error("Get client applications error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch job applications",
//     });
//   }
// };

// // 📄 Get user profile by ID (matches /get-user-by-id/:id route)
// export const getUserById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid user ID",
//       });
//     }

//     const user = await Client.findById(id).select("-__v").lean();

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found",
//       });
//     }

//     // Convert _id to id
//     const userResponse = {
//       ...user,
//       id: user._id?.toString(),
//     };
//     delete userResponse._id;

//     return res.status(200).json({
//       success: true,
//       data: { user: userResponse },
//     });
//   } catch (error) {
//     console.error("Get User By ID Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to retrieve user",
//     });
//   }
// };

// // 👤 Get own profile (matches /profile route)
// // In userController.ts - update getProfile function
// export const getProfile = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;

//     console.log("🔍 getProfile - User ID from token:", userId);
//     console.log("🔍 Full user object from req.user:", req.user);

//     if (!userId) {
//       console.log("❌ No user ID in token");
//       return res.status(401).json({
//         success: false,
//         error: "Unauthorized",
//       });
//     }

//     // Check if userId is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       console.log("❌ Invalid user ID format:", userId);
//       return res.status(400).json({
//         success: false,
//         error: "Invalid user ID format",
//       });
//     }

//     // Find user by ID
//     console.log("🔍 Searching for user with ID:", userId);
//     const user = await Client.findById(userId)
//       .select("name gender email profile profileCompleted createdAt")
//       .lean();

//     console.log("🔍 User found in DB:", user ? "Yes" : "No");

//     if (!user) {
//       console.log("❌ User not found in database for ID:", userId);

//       // Debug: List all users in database
//       const allUsers = await Client.find({}).select("_id name email").lean();
//       console.log(
//         "📊 All users in database:",
//         allUsers.map((u) => ({
//           id: u._id.toString(),
//           name: u.name,
//           email: u.email,
//         }))
//       );

//       return res.status(404).json({
//         success: false,
//         error: "User not found",
//       });
//     }

//     console.log("✅ User found:", {
//       id: user._id?.toString(),
//       name: user.name,
//       email: user.email,
//     });

//     // Prepare user data for response
//     const userResponse = {
//       id: user._id?.toString(),
//       name: user.name,
//       email: user.email,
//       gender: user.gender,
//       role: "client",
//       profileCompleted: user.profileCompleted || false,
//       profile: user.profile || {},
//       createdAt: user.createdAt,
//     };

//     console.log("✅ Sending user response");

//     return res.status(200).json({
//       success: true,
//       message: "Profile retrieved successfully",
//       data: {
//         user: userResponse,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error fetching profile:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch profile",
//     });
//   }
// };

// // 🔄 Additional OTP verification function (optional - not in routes yet)
// export const verifyOtp = async (req: Request, res: Response) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         error: "Email and OTP are required",
//       });
//     }

//     const otpRecord = await Otp.findOne({ email });

//     if (!otpRecord) {
//       return res.status(400).json({
//         success: false,
//         error: "No OTP found for this email",
//       });
//     }

//     if (otpRecord.otp !== otp) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid OTP",
//       });
//     }

//     if (otpRecord.expiresAt < new Date()) {
//       return res.status(401).json({
//         success: false,
//         error: "OTP has expired",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "OTP verified successfully",
//       data: {
//         email,
//         purpose: otpRecord.purpose,
//         expiresAt: otpRecord.expiresAt,
//       },
//     });
//   } catch (error) {
//     console.error("Verify OTP Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to verify OTP",
//     });
//   }
// };

// src/controllers/userController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Client from "../models/clientModel";
import Otp from "../models/Otp";
import JobApplication from "../models/Application";
import { generateOtp, otpExpiry } from "../utils/otp";
import { sendOtpMail } from "../utils/mailer";
import { generateToken, TokenPayload, verifyToken } from "../utils/jwt";

// Type for user in request
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

// 📩 Send OTP to email
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: "Email is required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
      return;
    }

    // Check if user exists
    const existingUser = await Client.findOne({ email });

    const otp = generateOtp();
    const expiresAt = otpExpiry();

    // Use update with upsert for atomic operation
    await Otp.findOneAndUpdate(
      { email },
      {
        otp,
        expiresAt,
        purpose: existingUser ? "login" : "register",
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Try to send OTP email
    try {
      await sendOtpMail(email, otp);

      res.status(200).json({
        success: true,
        message: "OTP sent to email successfully",
        email,
        purpose: existingUser ? "login" : "register",
      });
    } catch (mailError: unknown) {
      console.error("Mail Error:", mailError);

      // For development/testing
      if (process.env.NODE_ENV === "development") {
        res.status(200).json({
          success: true,
          message: "OTP generated (email service failed in development)",
          email,
          otp,
          expiresAt,
          purpose: existingUser ? "login" : "register",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to send OTP email",
        });
      }
    }
  } catch (error: unknown) {
    console.error("OTP Error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process OTP request",
    });
  }
};

// 📝 Create/Register user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, gender, email, otp } = req.body;

    // Validate all fields
    if (!name || !gender || !email || !otp) {
      res.status(400).json({
        success: false,
        error: "All fields are required: name, gender, email, otp",
      });
      return;
    }

    // Validate gender
    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(gender.toLowerCase())) {
      res.status(400).json({
        success: false,
        error: "Gender must be male, female, or other",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
      return;
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, purpose: "register" });

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        error: "No OTP found for this email. Please request a new OTP.",
      });
      return;
    }

    if (otpRecord.otp !== otp) {
      res.status(401).json({
        success: false,
        error: "Invalid OTP",
      });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      // Don't delete here, just return error
      res.status(401).json({
        success: false,
        error: "OTP has expired. Please request a new OTP.",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await Client.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: "User already exists. Please login instead.",
      });
      return;
    }

    // Create new user
    const user = new Client({
      name,
      gender: gender.toLowerCase(),
      email,
      role: "client",
      profileCompleted: false,
      profile: {
        verified: false,
        skills: [],
      },
    });

    await user.save();

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate token using your JWT utility
    const token = generateToken(user._id.toString(), "client", user.email);

    // Set cookie
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
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          profileCompleted: user.profileCompleted,
          profile: user.profile || {},
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: unknown) {
    console.error("Registration Error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const validationError = error as mongoose.Error.ValidationError;
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: Object.values(validationError.errors).map(
          (err) => err.message
        ),
      });
      return;
    }

    // Handle duplicate email error
    if ((error as any).code === 11000) {
      res.status(409).json({
        success: false,
        error: "Email already exists. Please use a different email.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
    });
  }
};

// 🔐 Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        error: "Email and OTP are required",
      });
      return;
    }

    // Find user
    const user = await Client.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found. Please register first.",
      });
      return;
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, purpose: "login" });

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        error: "No OTP found. Please request a new OTP.",
      });
      return;
    }

    if (otpRecord.otp !== otp) {
      res.status(401).json({
        success: false,
        error: "Invalid OTP",
      });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(401).json({
        success: false,
        error: "OTP has expired. Please request a new OTP.",
      });
      return;
    }

    // Delete used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate token
    const token = generateToken(user._id.toString(), "client", user.email);

    // Set cookie
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
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          profileCompleted: user.profileCompleted,
          profile: user.profile || {},
        },
        token,
      },
    });
  } catch (error: unknown) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
    });
  }
};

// 🚪 Logout user
export const logoutUser = (req: Request, res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// 👤 Get user by email
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        success: false,
        error: "Email is required",
      });
      return;
    }

    const user = await Client.findOne({ email }).select("-__v").lean();

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    // Prepare response without _id
    const userResponse = {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: user.role,
      profileCompleted: user.profileCompleted,
      profile: user.profile || {},
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data: { user: userResponse },
    });
  } catch (error: unknown) {
    console.error("Get User Error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user",
    });
  }
};

// ✏️ Update user profile
export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { profile } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    if (!profile || typeof profile !== "object") {
      res.status(400).json({
        success: false,
        error: "Profile data is required",
      });
      return;
    }

    const updatedUser = await Client.findByIdAndUpdate(
      userId,
      {
        $set: {
          profile: { ...profile },
          profileCompleted: true,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-__v");

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const userResponse = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      gender: updatedUser.gender,
      role: updatedUser.role,
      profileCompleted: updatedUser.profileCompleted,
      profile: updatedUser.profile || {},
      createdAt: updatedUser.createdAt,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: userResponse },
    });
  } catch (error: unknown) {
    console.error("Update Profile Error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const validationError = error as mongoose.Error.ValidationError;
      res.status(400).json({
        success: false,
        error: "Profile validation failed",
        details: Object.values(validationError.errors).map(
          (err) => err.message
        ),
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Profile update failed",
    });
  }
};

// 👥 Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await Client.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    // Convert all _id to id
    const usersResponse = users.map((user) => ({
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: user.role,
      profileCompleted: user.profileCompleted,
      profile: user.profile || {},
      createdAt: user.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: usersResponse.length,
      data: { users: usersResponse },
    });
  } catch (error: unknown) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve users",
    });
  }
};

// 📌 User's applied jobs
export const getClientApplications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== "client") {
      res.status(403).json({
        success: false,
        error: "Access denied. Only clients can view their applications",
      });
      return;
    }

    const applications = await JobApplication.find({ clientId: userId })
      .populate("jobId", "title description budget duration category status")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: { applications },
    });
  } catch (error: unknown) {
    console.error("Get client applications error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch job applications",
    });
  }
};

// 📄 Get user profile by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
      return;
    }

    const user = await Client.findById(id).select("-__v").lean();

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    // Prepare response without _id
    const userResponse = {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: user.role,
      profileCompleted: user.profileCompleted,
      profile: user.profile || {},
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      data: { user: userResponse },
    });
  } catch (error: unknown) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to retrieve user",
    });
  }
};

// 👤 Get own profile
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    console.log("🔍 getProfile - User ID from token:", userId);
    console.log("🔍 Full user object from req.user:", req.user);

    if (!userId) {
      console.log("❌ No user ID in token");
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    // Check if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ Invalid user ID format:", userId);
      res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
      return;
    }

    // Find user by ID
    console.log("🔍 Searching for user with ID:", userId);
    const user = await Client.findById(userId)
      .select("name gender email profile profileCompleted createdAt")
      .lean();

    console.log("🔍 User found in DB:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ User not found in database for ID:", userId);
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    console.log("✅ User found:", {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
    });

    // Prepare user data for response
    const userResponse = {
      id: user._id?.toString(),
      name: user.name,
      email: user.email,
      gender: user.gender,
      role: "client",
      profileCompleted: user.profileCompleted || false,
      profile: user.profile || {},
      createdAt: user.createdAt,
    };

    console.log("✅ Sending user response");

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: userResponse,
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    });
  }
};

// 🔄 OTP verification function
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        error: "Email and OTP are required",
      });
      return;
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      res.status(400).json({
        success: false,
        error: "No OTP found for this email",
      });
      return;
    }

    if (otpRecord.otp !== otp) {
      res.status(401).json({
        success: false,
        error: "Invalid OTP",
      });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(401).json({
        success: false,
        error: "OTP has expired",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        email,
        purpose: otpRecord.purpose,
        expiresAt: otpRecord.expiresAt,
      },
    });
  } catch (error: unknown) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify OTP",
    });
  }
};

// 📱 Get current user
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }

    const user = await Client.findById(userId).select("-__v");

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          profileCompleted: user.profileCompleted,
          profile: user.profile || {},
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get current user",
    });
  }
};

// 🔧 Clean up expired OTPs (call this periodically)
export const cleanupExpiredOtps = async (): Promise<void> => {
  try {
    const result = await Otp.deleteMany({ expiresAt: { $lt: new Date() } });
    console.log(`🧹 Cleaned up ${result.deletedCount} expired OTPs`);
  } catch (error) {
    console.error("Error cleaning up expired OTPs:", error);
  }
};

// 🆕 Check if user exists
export const checkUserExists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        success: false,
        error: "Email is required",
      });
      return;
    }

    const user = await Client.findOne({ email }).select("email role");

    res.status(200).json({
      success: true,
      exists: !!user,
      data: user
        ? {
            email: user.email,
            role: user.role,
            needsRegistration: false,
          }
        : {
            email,
            needsRegistration: true,
          },
    });
  } catch (error: unknown) {
    console.error("Check user exists error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to check user",
    });
  }
};

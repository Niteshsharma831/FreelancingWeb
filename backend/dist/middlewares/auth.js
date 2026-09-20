"use strict";
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
// // Extend Express Request type
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         role: string;
//         email: string;
//       };
//     }
//   }
// }
// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Get token from cookies or Authorization header
//     const token = req.cookies?.token ||
//                   req.headers.authorization?.replace("Bearer ", "") ||
//                   req.headers.authorization?.split(" ")[1];
//     console.log("🔍 Auth Middleware - Token:", token ? "Present" : "Missing");
//     if (!token) {
//       console.log("❌ No token provided");
//       return res.status(401).json({
//         success: false,
//         error: "Authentication required. Please login first."
//       });
//     }
//     // Verify token
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       id: string;
//       role: string;
//       email: string;
//     };
//     console.log("✅ Token decoded:", decoded);
//     // Attach user to request
//     req.user = {
//       id: decoded.id,
//       role: decoded.role,
//       email: decoded.email
//     };
//     console.log("✅ User attached to request:", req.user);
//     next();
//   } catch (err: any) {
//     console.error("❌ Token verification failed:", err.message);
//     // Specific error messages
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         error: "Token expired. Please login again."
//       });
//     }
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid token."
//       });
//     }
//     return res.status(401).json({
//       success: false,
//       error: "Authentication failed."
//     });
//   }
// };
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.headers.authorization?.replace("Bearer ", "") ||
            req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authentication required",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded?.role) {
            return res.status(401).json({
                success: false,
                error: "Invalid token (role missing)",
            });
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: (decoded.role || "").toLowerCase().trim(),
        };
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token",
        });
    }
};
exports.authMiddleware = authMiddleware;

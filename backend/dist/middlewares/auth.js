"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const authMiddleware = (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.token ||
            req.headers.authorization?.replace("Bearer ", "") ||
            req.headers.authorization?.split(" ")[1];
        console.log("🔍 Auth Middleware - Token:", token ? "Present" : "Missing");
        if (!token) {
            console.log("❌ No token provided");
            return res.status(401).json({
                success: false,
                error: "Authentication required. Please login first."
            });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("✅ Token decoded:", decoded);
        // Attach user to request
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email
        };
        console.log("✅ User attached to request:", req.user);
        next();
    }
    catch (err) {
        console.error("❌ Token verification failed:", err.message);
        // Specific error messages
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: "Token expired. Please login again."
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: "Invalid token."
            });
        }
        return res.status(401).json({
            success: false,
            error: "Authentication failed."
        });
    }
};
exports.authMiddleware = authMiddleware;

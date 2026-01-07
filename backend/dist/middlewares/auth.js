"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const authMiddleware = (req, res, next) => {
    var _a, _b, _c;
    try {
        // Get token from cookies or Authorization header
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) ||
            ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "")) ||
            ((_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1]);
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

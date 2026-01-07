"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure JWT_SECRET is always a string with a fallback
const JWT_SECRET = process.env.JWT_SECRET
    ? process.env.JWT_SECRET.trim()
    : "your_super_secret_jwt_key_change_in_production_32_chars_min";
exports.JWT_SECRET = JWT_SECRET;
// Ensure JWT_EXPIRY is always a string or number
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
const generateToken = (id, role, email) => {
    // Validate inputs
    if (!id || !role || !email) {
        throw new Error("Missing required fields for token generation");
    }
    // Ensure JWT_SECRET is available
    if (!JWT_SECRET || JWT_SECRET === "your_super_secret_jwt_key_change_in_production_32_chars_min") {
        console.warn("⚠️  Using default JWT_SECRET. Change this in production!");
    }
    const payload = {
        id,
        role,
        email
    };
    // Add iss and aud for better security
    const options = {
        expiresIn: JWT_EXPIRY,
        issuer: "your-app-name",
        audience: "your-app-client"
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        if (!token) {
            console.error("No token provided for verification");
            return null;
        }
        const options = {
            issuer: "your-app-name",
            audience: "your-app-client"
        };
        return jsonwebtoken_1.default.verify(token, JWT_SECRET, options);
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        return null;
    }
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    try {
        if (!token) {
            console.error("No token provided for decoding");
            return null;
        }
        return jsonwebtoken_1.default.decode(token);
    }
    catch (error) {
        console.error("JWT Decode Error:", error);
        return null;
    }
};
exports.decodeToken = decodeToken;

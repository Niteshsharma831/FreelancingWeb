"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
// middleware/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const authMiddleware = (req, res, next) => {
    var _a;
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    if (!token) {
        return res.status(401).json({ error: "Login first" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.userId,
            role: decoded.role,
            email: decoded.email, // ✅ assign email here
        };
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
// middleware/auth.ts
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import { JWT_SECRET } from "../utils/jwt"; // ✅ Correct import
// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ error: "Login first" });
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       userId: string;
//       role: string;
//       email: string;
//     };
//     (req as any).user = {
//       id: decoded.userId,
//       role: decoded.role,
//       email: decoded.email,
//     };
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: "Invalid or expired token" });
//   }
// };

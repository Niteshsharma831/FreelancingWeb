// utils/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const generateToken = (userId: string, role: string, email: string) => {
  return jwt.sign({ userId, role, email }, JWT_SECRET, { expiresIn: "7d" });
};


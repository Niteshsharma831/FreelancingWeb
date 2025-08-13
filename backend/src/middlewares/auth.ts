// middleware/auth.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Login first" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
      email: string;  // ✅ include email
    };

    (req as any).user = {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email, // ✅ assign email here
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};







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

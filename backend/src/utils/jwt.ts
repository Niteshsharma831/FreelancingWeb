// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// // Ensure JWT_SECRET is always a string with a fallback
// const JWT_SECRET = process.env.JWT_SECRET
//   ? process.env.JWT_SECRET.trim()
//   : "your_super_secret_jwt_key_change_in_production_32_chars_min";

// // Ensure JWT_EXPIRY is always a string or number
// const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

// export interface TokenPayload {
//   id: string;
//   role: string;
//   email: string;
// }

// export const generateToken = (id: string, role: string, email: string): string => {
//   // Validate inputs
//   if (!id || !role || !email) {
//     throw new Error("Missing required fields for token generation");
//   }

//   // Ensure JWT_SECRET is available
//   if (!JWT_SECRET || JWT_SECRET === "your_super_secret_jwt_key_change_in_production_32_chars_min") {
//     console.warn("⚠️  Using default JWT_SECRET. Change this in production!");
//   }

//   const payload: TokenPayload = {
//     id,
//     role,
//     email
//   };

//   // Add iss and aud for better security
//   const options: jwt.SignOptions = {
//     expiresIn: JWT_EXPIRY,
//     issuer: "your-app-name",
//     audience: "your-app-client"
//   };

//   return jwt.sign(payload, JWT_SECRET, options);
// };

// export const verifyToken = (token: string): TokenPayload | null => {
//   try {
//     if (!token) {
//       console.error("No token provided for verification");
//       return null;
//     }

//     const options: jwt.VerifyOptions = {
//       issuer: "your-app-name",
//       audience: "your-app-client"
//     };

//     return jwt.verify(token, JWT_SECRET, options) as TokenPayload;
//   } catch (error) {
//     console.error("JWT Verification Error:", error);
//     return null;
//   }
// };

// export const decodeToken = (token: string): TokenPayload | null => {
//   try {
//     if (!token) {
//       console.error("No token provided for decoding");
//       return null;
//     }

//     return jwt.decode(token) as TokenPayload;
//   } catch (error) {
//     console.error("JWT Decode Error:", error);
//     return null;
//   }
// };

// export { JWT_SECRET };

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Ensure JWT_SECRET is always a string with a fallback
const JWT_SECRET = process.env.JWT_SECRET
  ? process.env.JWT_SECRET.trim()
  : "your_super_secret_jwt_key_change_in_production_32_chars_min";

// Use string for expiresIn as jwt.SignOptions expects string | number
const JWT_EXPIRES_IN = "7d"; // Hardcode as string to avoid issues

export interface TokenPayload {
  id: string;
  role: string;
  email: string;
}

export const generateToken = (
  id: string,
  role: string,
  email: string
): string => {
  // Validate inputs
  if (!id || !role || !email) {
    throw new Error("Missing required fields for token generation");
  }

  // Ensure JWT_SECRET is available
  if (
    !JWT_SECRET ||
    JWT_SECRET === "your_super_secret_jwt_key_change_in_production_32_chars_min"
  ) {
    console.warn("⚠️  Using default JWT_SECRET. Change this in production!");
  }

  const payload: TokenPayload = {
    id,
    role,
    email,
  };

  // Use simple options without issuer/audience to avoid type issues
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN, // This is definitely a string
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    if (!token) {
      console.error("No token provided for verification");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload & {
      iat: number;
      exp: number;
    };

    return {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    if (!token) {
      console.error("No token provided for decoding");
      return null;
    }

    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null;
  }
};

export { JWT_SECRET };

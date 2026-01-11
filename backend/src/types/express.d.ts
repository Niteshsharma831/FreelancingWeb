import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: "client" | "freelancer" | "admin";
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};

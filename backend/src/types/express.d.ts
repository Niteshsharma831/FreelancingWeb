declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "client" | "freelancer" | "admin";
        email: string;
      };
    }
  }
}

export {};

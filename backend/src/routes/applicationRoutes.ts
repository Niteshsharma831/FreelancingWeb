import express from "express";
import {
  applyForJob,
  getClientApplications,
  getFreelancerApplications,
  updateApplicationStatus,
} from "../controllers/application";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

// Apply to job
router.post("/apply", authMiddleware, applyForJob);

// Get applications for logged-in client
router.get("/my-applications", authMiddleware, getClientApplications);

// Freelancer sees all applications to their posted jobs
router.get("/freelancer", authMiddleware, getFreelancerApplications);

// Freelancer updates application status (accept/reject)
router.put("/update-status/:id", authMiddleware, updateApplicationStatus);

export default router;

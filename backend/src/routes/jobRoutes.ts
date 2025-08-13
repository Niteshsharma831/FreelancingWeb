import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByFreelancer,
} from "../controllers/jobController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// ✅ Public Routes
router.get("/all", getAllJobs);                 // All jobs for clients
router.get("/freelancer/:freelancerId", getJobsByFreelancer); // Jobs by specific freelancer
router.get("/jobbyid/:jobId", getJobById);           // Specific job by ID (must come after above)

// ✅ Protected Routes (freelancer actions)
router.post("/create", authMiddleware, createJob);
router.get("/my-jobs", authMiddleware, getMyJobs);  // freelancer get thier posted Jobs
router.put("/update/:id", authMiddleware, updateJob);
router.delete("/delete/:jobId", authMiddleware, deleteJob);

export default router;

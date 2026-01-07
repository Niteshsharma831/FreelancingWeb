"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// ✅ Public Routes
router.get("/all", jobController_1.getAllJobs); // All jobs for clients
router.get("/freelancer/:freelancerId", jobController_1.getJobsByFreelancer); // Jobs by specific freelancer
router.get("/jobbyid/:jobId", jobController_1.getJobById); // Specific job by ID (must come after above)
// ✅ Protected Routes (freelancer actions)
router.post("/create", auth_1.authMiddleware, jobController_1.createJob);
router.get("/my-jobs", auth_1.authMiddleware, jobController_1.getMyJobs); // freelancer get thier posted Jobs
router.put("/update/:id", auth_1.authMiddleware, jobController_1.updateJob);
router.delete("/delete/:jobId", auth_1.authMiddleware, jobController_1.deleteJob);
router.post("/bulk", auth_1.authMiddleware, jobController_1.createJobsBulk);
exports.default = router;

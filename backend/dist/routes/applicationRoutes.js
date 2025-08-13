"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const application_1 = require("../controllers/application");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Apply to job
router.post("/apply", auth_1.authMiddleware, application_1.applyForJob);
// Get applications for logged-in client
router.get("/my-applications", auth_1.authMiddleware, application_1.getClientApplications);
// Freelancer sees all applications to their posted jobs
router.get("/freelancer", auth_1.authMiddleware, application_1.getFreelancerApplications);
// Freelancer updates application status (accept/reject)
router.put("/update-status/:id", auth_1.authMiddleware, application_1.updateApplicationStatus);
exports.default = router;

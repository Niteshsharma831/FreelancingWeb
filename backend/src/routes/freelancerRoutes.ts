import { Router } from "express";
import {
  sendOtp,
  registerFreelancer,
  loginFreelancer,
  logoutFreelancer,
  updateFreelancer,
  getFreelancerProfile,
} from "../controllers/freelancerController";
import { protectFreelancer } from "../controllers/freelancerController";

const router = Router();

// OTP + Auth
router.post("/send-otp", sendOtp);
router.post("/register", registerFreelancer);
router.post("/login", loginFreelancer);
router.post("/logout", logoutFreelancer);
router.get("/me", protectFreelancer, getFreelancerProfile);


// Profile
router.put("/update", protectFreelancer, updateFreelancer);

export default router;

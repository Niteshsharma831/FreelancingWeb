// import { Router } from "express";
// import {
//   sendOtp,
//   registerFreelancer,
//   loginFreelancer,
//   logoutFreelancer,
//   updateFreelancer,
//   getFreelancerProfile,
//   protectFreelancer,  // ADDED: Import protect middleware
//   getFreelancer,      // ADDED: Import getFreelancer
//   getAllFreelancers   // ADDED: Import getAllFreelancers
// } from "../controllers/freelancerController";

// const router = Router();

// // OTP + Auth
// router.post("/send-otp", sendOtp);
// router.post("/register", registerFreelancer);
// router.post("/login", loginFreelancer);
// router.post("/logout", logoutFreelancer);

// // Protected routes
// router.get("/me", protectFreelancer, getFreelancerProfile);
// router.put("/update", protectFreelancer, updateFreelancer);
// router.get("/", protectFreelancer, getFreelancer); // Get by email or authenticated user
// router.get("/all", protectFreelancer, getAllFreelancers); // Get all freelancers

// export default router;

// routes/freelancerRoutes.js
import { Router } from "express";
import {
  sendOtp,
  registerFreelancer,
  loginFreelancer,
  logoutFreelancer,
  updateFreelancer,
  getFreelancerProfile,
  protectFreelancer,
  getFreelancer,
  getAllFreelancers
} from "../controllers/freelancerController";

const router = Router();

// Public routes
router.post("/send-otp", sendOtp);
router.post("/register", registerFreelancer);
router.post("/login", loginFreelancer);
router.post("/logout", logoutFreelancer);

// Protected routes (require freelancer authentication)
router.get("/me", protectFreelancer, getFreelancerProfile);
router.put("/update", protectFreelancer, updateFreelancer);
router.get("/", protectFreelancer, getFreelancer); // Get by email or authenticated user
router.get("/all", protectFreelancer, getAllFreelancers); // Get all freelancers

export default router;
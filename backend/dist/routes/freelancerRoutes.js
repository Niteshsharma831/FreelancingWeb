"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = require("express");
const freelancerController_1 = require("../controllers/freelancerController");
const router = (0, express_1.Router)();
// Public routes
router.post("/send-otp", freelancerController_1.sendOtp);
router.post("/register", freelancerController_1.registerFreelancer);
router.post("/login", freelancerController_1.loginFreelancer);
router.post("/logout", freelancerController_1.logoutFreelancer);
// Protected routes (require freelancer authentication)
router.get("/me", freelancerController_1.protectFreelancer, freelancerController_1.getFreelancerProfile);
router.put("/update", freelancerController_1.protectFreelancer, freelancerController_1.updateFreelancer);
router.get("/", freelancerController_1.protectFreelancer, freelancerController_1.getFreelancer); // Get by email or authenticated user
router.get("/all", freelancerController_1.protectFreelancer, freelancerController_1.getAllFreelancers); // Get all freelancers
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const freelancerController_1 = require("../controllers/freelancerController");
const router = (0, express_1.Router)();
// OTP + Auth
router.post("/send-otp", freelancerController_1.sendOtp);
router.post("/register", freelancerController_1.registerFreelancer);
router.post("/login", freelancerController_1.loginFreelancer);
router.post("/logout", freelancerController_1.logoutFreelancer);
// Protected routes
router.get("/me", freelancerController_1.protectFreelancer, freelancerController_1.getFreelancerProfile);
router.put("/update", freelancerController_1.protectFreelancer, freelancerController_1.updateFreelancer);
router.get("/", freelancerController_1.protectFreelancer, freelancerController_1.getFreelancer); // Get by email or authenticated user
router.get("/all", freelancerController_1.protectFreelancer, freelancerController_1.getAllFreelancers); // Get all freelancers
exports.default = router;

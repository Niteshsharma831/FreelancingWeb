"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const freelancerController_1 = require("../controllers/freelancerController");
const freelancerController_2 = require("../controllers/freelancerController");
const router = (0, express_1.Router)();
// OTP + Auth
router.post("/send-otp", freelancerController_1.sendOtp);
router.post("/register", freelancerController_1.registerFreelancer);
router.post("/login", freelancerController_1.loginFreelancer);
router.post("/logout", freelancerController_1.logoutFreelancer);
router.get("/me", freelancerController_2.protectFreelancer, freelancerController_1.getFreelancerProfile);
// Profile
router.put("/update", freelancerController_2.protectFreelancer, freelancerController_1.updateFreelancer);
exports.default = router;

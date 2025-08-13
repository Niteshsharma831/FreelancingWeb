"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpExpiry = exports.generateOtp = void 0;
// utils/otp.ts
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};
exports.generateOtp = generateOtp;
const otpExpiry = () => {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);
    return expires;
};
exports.otpExpiry = otpExpiry;

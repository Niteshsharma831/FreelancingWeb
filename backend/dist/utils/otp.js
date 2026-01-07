"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAlphanumericOtp = exports.otpExpiry = exports.generateOtp = void 0;
const generateOtp = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
};
exports.generateOtp = generateOtp;
const otpExpiry = (minutes = 5) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now;
};
exports.otpExpiry = otpExpiry;
// Optional: Generate alphanumeric OTP
const generateAlphanumericOtp = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += chars[Math.floor(Math.random() * chars.length)];
    }
    return otp;
};
exports.generateAlphanumericOtp = generateAlphanumericOtp;

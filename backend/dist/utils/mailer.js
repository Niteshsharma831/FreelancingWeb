"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendOtpMail = exports.testEmailConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create transporter with better error handling
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};
// Test email configuration
const testEmailConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = createTransporter();
        yield transporter.verify();
        console.log("✅ Email server is ready to send messages");
        return true;
    }
    catch (error) {
        console.error("❌ Email configuration error:", error);
        return false;
    }
});
exports.testEmailConfig = testEmailConfig;
// Send OTP email
const sendOtpMail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if email credentials are available
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("⚠️ Email credentials not configured. Skipping email send.");
            // In development, log OTP to console
            if (process.env.NODE_ENV === 'development') {
                console.log(`📧 OTP for ${email}: ${otp}`);
            }
            return true; // Return true to continue flow in development
        }
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Freelancing Platform" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code - Freelancing Platform",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Freelancing Platform</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="color: #666; font-size: 16px;">Use the following OTP to complete your action:</p>
            <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 48px; letter-spacing: 10px; color: #667eea; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 14px;">
              This OTP is valid for 5 minutes. Please do not share this code with anyone.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Freelancing Platform. All rights reserved.</p>
          </div>
        </div>
      `
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}: ${info.messageId}`);
        return true;
    }
    catch (error) {
        console.error("❌ Failed to send OTP email:", error);
        // In development, log OTP to console as fallback
        if (process.env.NODE_ENV === 'development') {
            console.log(`📧 [FALLBACK] OTP for ${email}: ${otp}`);
            return true;
        }
        throw error;
    }
});
exports.sendOtpMail = sendOtpMail;
// Send welcome email
const sendWelcomeEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("⚠️ Email credentials not configured. Skipping welcome email.");
            return;
        }
        const transporter = createTransporter();
        const mailOptions = {
            from: `"Freelancing Platform" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to Freelancing Platform!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Freelancing Platform!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hello ${name}!</h2>
            <p style="color: #666; font-size: 16px;">
              Thank you for joining our freelancing platform. We're excited to have you on board!
            </p>
            <p style="color: #666; font-size: 16px;">
              Get started by completing your profile and exploring available jobs.
            </p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
               style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
        </div>
      `
        };
        yield transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
    }
    catch (error) {
        console.error("❌ Failed to send welcome email:", error);
    }
});
exports.sendWelcomeEmail = sendWelcomeEmail;

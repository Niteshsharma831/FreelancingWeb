"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailConfig = exports.sendOtpMail = exports.isEmailConfigured = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
console.log("📧 Email Service Loading...");
// Function to check if email is configured
const isEmailConfigured = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    // Remove spaces from password if present (app passwords often have spaces)
    const cleanPass = pass?.replace(/\s+/g, "");
    const isConfigured = !!(user && cleanPass);
    console.log(`🔍 Email configuration check:`);
    console.log(`   EMAIL_USER: ${user || "empty"}`);
    console.log(`   EMAIL_PASS: ${cleanPass ? "✅ SET (length: " + cleanPass.length + ")" : "❌ NOT SET"}`);
    console.log(`   Result: ${isConfigured ? "✅ CONFIGURED" : "❌ NOT CONFIGURED"}`);
    return isConfigured;
};
exports.isEmailConfigured = isEmailConfigured;
// Create transporter
const createTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
        console.warn("❌ Cannot create transporter: Missing credentials");
        return null;
    }
    try {
        // Remove any spaces from the app password
        const cleanPass = pass.replace(/\s+/g, "");
        console.log("🔧 Creating transporter with:");
        console.log(`   User: ${user}`);
        console.log(`   Password length: ${cleanPass.length}`);
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: user.trim(),
                pass: cleanPass, // Use cleaned password without spaces
            },
            // Add these options for better debugging
            debug: true,
            logger: true,
        });
        console.log("✅ Transporter created successfully");
        return transporter;
    }
    catch (error) {
        console.error("❌ Error creating transporter:", error);
        return null;
    }
};
// Send OTP email
const sendOtpMail = async (email, otp) => {
    console.log(`\n📧 SEND OTP CALLED for: ${email}`);
    // Check configuration
    if (!(0, exports.isEmailConfigured)()) {
        console.warn("⚠️ Email credentials not configured.");
        console.log(`📧 [DEV] OTP for ${email}: ${otp}`);
        return false;
    }
    const transporter = createTransporter();
    if (!transporter) {
        console.error("❌ Failed to create email transporter");
        console.log(`📧 [DEV] OTP for ${email}: ${otp}`);
        return false;
    }
    try {
        // Verify connection first
        console.log("🔍 Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP connection verified");
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
          </div>
        </div>
      `,
            text: `Your OTP Code: ${otp}. This OTP is valid for 5 minutes.`,
        };
        console.log(`📧 Attempting to send email to: ${email}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent successfully!`);
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log(`📧 Response: ${info.response}`);
        return true;
    }
    catch (error) {
        console.error("❌ Failed to send OTP email:");
        console.error(`   Error code: ${error.code}`);
        console.error(`   Error message: ${error.message}`);
        if (error.code === "EAUTH") {
            console.error("\n🔧 GMAIL AUTHENTICATION FIX:");
            console.error("1. Go to: https://myaccount.google.com/apppasswords");
            console.error('2. Generate a NEW App Password (select "Mail" and "Other")');
            console.error("3. Copy the 16-character password (with spaces)");
            console.error("4. Update your .env file with:");
            console.error(`   EMAIL_USER=${process.env.EMAIL_USER}`);
            console.error("   EMAIL_PASS=xxxx xxxx xxxx xxxx  (your new app password)");
            console.error("5. Restart your server");
        }
        console.log(`📧 [FALLBACK] OTP for ${email}: ${otp}`);
        return false;
    }
};
exports.sendOtpMail = sendOtpMail;
// Test email configuration
const testEmailConfig = async () => {
    console.log("\n🔧 Testing Email Configuration...");
    if (!(0, exports.isEmailConfigured)()) {
        console.error("❌ Email not configured properly");
        return false;
    }
    const transporter = createTransporter();
    if (!transporter) {
        return false;
    }
    try {
        console.log("🔍 Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ Email server is ready to send messages");
        return true;
    }
    catch (error) {
        console.error("❌ Email configuration test failed:");
        console.error(`   Error: ${error.message}`);
        return false;
    }
};
exports.testEmailConfig = testEmailConfig;

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
exports.sendApplicationStatusMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Mailer utility for updating application status
const sendApplicationStatusMail = (email, jobTitle, jobId, applicationId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = `Your Application Status for "${jobTitle}" has been updated`;
    const html = `
  <div style="max-width:600px;margin:auto;padding:20px;font-family:sans-serif;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
    <h2 style="color:#1f2937;">Hi there 👋</h2>
    <p style="color:#111827;">We're writing to inform you that your application status for the job position <strong>"${jobTitle}"</strong> has been updated to:</p>
    <p style="font-size:18px;font-weight:bold;color:#2563eb;margin-top:10px;">${status}</p>

    <hr style="margin:20px 0;" />

    <div style="color:#374151;">
      <p><strong>Job Title:</strong> <strong>${jobTitle}</strong></p>
      <p><strong>Job ID:</strong> ${jobId}</p>
      <p><strong>Application ID:</strong> ${applicationId}</p>
    </div>

    <a href="https://yourapp.com/dashboard" 
       style="display:inline-block;margin-top:20px;background-color:#2563eb;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
      View Your Application
    </a>

    <p style="margin-top:30px;font-size:13px;color:#6b7280;">
      For queries, contact: 
      <a href="mailto:its.freelancervibes@gmail.com" style="color:#2563eb;text-decoration:underline;">its.freelancervibes@gmail.com</a>
    </p>

    <p style="margin-top:10px;font-size:12px;color:#9ca3af;">
      — WorkBridge Team <br />
      Founder & CEO: Nitesh Sharma
    </p>

    <div style="margin-top:20px;">
      <a href="https://linkedin.com" style="margin-right:10px;">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="24" alt="LinkedIn" />
      </a>
      <a href="https://twitter.com">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="24" alt="Twitter" />
      </a>
    </div>
  </div>
`;
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    yield transporter.sendMail({
        from: `"WorkBridge" <${process.env.MAIL_USER}>`,
        to: email,
        subject,
        html,
    });
});
exports.sendApplicationStatusMail = sendApplicationStatusMail;

import nodemailer from "nodemailer";

export const sendApplicationSuccessMail = async (
  to: string,
  jobTitle: string,
  location: string,
  compensation: string,
  duration: string,
  applicationId: string,
  jobId: string
) => {
  const subject = `🎉 Application Submitted: ${jobTitle}`;

  const html = `
    <div style="max-width:600px;margin:auto;background:#f9fafb;border-radius:12px;overflow:hidden;font-family:'Segoe UI', sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:linear-gradient(90deg,#2563eb,#1e3a8a);padding:30px 20px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">🎯 Application Received</h1>
        <p style="color:#e0e7ff;margin:5px 0 0;font-size:14px;">Thanks for applying via WorkBridge</p>
      </div>
      
      <!-- Main Content -->
      <div style="padding:30px;background:white;">
        <h2 style="margin-top:0;color:#111;font-size:20px;">Hi there 👋</h2>
        <p style="font-size:15px;color:#444;margin-bottom:20px;">
          We’ve received your application for <strong>${jobTitle}</strong>. Below are your submission details:
        </p>

        <!-- Info Box -->
        <div style="background:#f1f5f9;padding:16px 20px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:8px 0;"><strong>📌 Location:</strong> ${location}</p>
          <p style="margin:8px 0;"><strong>💰 Compensation:</strong> ${compensation}</p>
          <p style="margin:8px 0;"><strong>⏳ Duration:</strong> ${duration}</p>
          <p style="margin:8px 0;"><strong>🆔 Application ID:</strong> <code>${applicationId}</code></p>
          <p style="margin:8px 0;"><strong>📄 Job ID:</strong> <code>${jobId}</code></p>
        </div>

        <!-- Buttons -->
        <div style="text-align:center;">
          <a href="https://hireonworkbridge.vercel.app/" style="display:inline-block;margin:8px;background:#2563eb;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
            🚀 Go to Dashboard
          </a><br/>
          <a href="https://hireonworkbridge.vercel.app/alljobs" style="display:inline-block;margin:8px;background:#10b981;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
            🔍 Explore More Jobs
          </a><br/>
          <a href="mailto:its.freelancervibe@gmail.com" style="display:inline-block;margin:8px;background:#f97316;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.15);">
            💬 Query? Contact Us
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6;text-align:center;padding:20px;font-size:12px;color:#6b7280;">
        <p style="margin:4px 0;">WorkBridge © 2025 • Empowering Freelancers & Clients</p>
        <p style="margin:4px 0;">Founder & CEO: <strong>Nitesh Sharma</strong></p>
        <p style="margin:4px 0;">Have a question? <a href="mailto:its.freelancervibe@gmail.com" style="color:#2563eb;text-decoration:none;">its.freelancervibe@gmail.com</a></p>
        
        <!-- Social Icons -->
        <div style="margin-top:12px;">
          <a href="https://linkedin.com/in/nitesh-sharma" style="margin:0 8px;text-decoration:none;">
            <img src="https://cdn-icons-png.flaticon.com/24/174/174857.png" alt="LinkedIn" width="24" height="24" style="vertical-align:middle;">
          </a>
          <a href="https://github.com/niteshsharma" style="margin:0 8px;text-decoration:none;">
            <img src="https://cdn-icons-png.flaticon.com/24/25/25231.png" alt="GitHub" width="24" height="24" style="vertical-align:middle;">
          </a>
          <a href="https://twitter.com/niteshsharma" style="margin:0 8px;text-decoration:none;">
            <img src="https://cdn-icons-png.flaticon.com/24/733/733579.png" alt="Twitter" width="24" height="24" style="vertical-align:middle;">
          </a>
        </div>
        
        <p style="margin-top:12px;"><a href="https://yourapp.com" style="color:#2563eb;text-decoration:none;">Visit Website</a> • 
        <a href="https://yourapp.com/privacy" style="color:#2563eb;text-decoration:none;">Privacy Policy</a></p>
      </div>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"WorkBridge" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

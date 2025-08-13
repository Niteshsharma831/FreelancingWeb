import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpMail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"WorkBridge" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Code - WorkBridge",
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f3f4f6; padding: 0; margin: 0;">
      <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: #1e3a8a; text-align: center; padding: 30px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Welcome to WorkBridge</h1>
            <p style="color: #cbd5e1; font-size: 14px; margin-top: 5px;">Empowering Freelancers & Job Seekers</p>
          </td>
        </tr>

        <!-- OTP Section -->
        <tr>
          <td style="padding: 30px; text-align: center;">
            <h2 style="color: #111827; font-size: 22px;">Your One-Time Password (OTP)</h2>
            <p style="font-size: 16px; color: #4b5563;">Use the code below to verify your email address:</p>
            <div style="display: inline-block; background-color: #eef2ff; padding: 20px 40px; border-radius: 12px; margin: 20px 0;">
              <span style="font-size: 32px; color: #1d4ed8; font-weight: bold;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          </td>
        </tr>

        <!-- Profile Tips -->
        <tr>
          <td style="padding: 20px 30px; background-color: #fef9c3; text-align: left;">
            <h3 style="color: #92400e;">💡 Tip: Complete Your Profile</h3>
            <ul style="padding-left: 20px; font-size: 14px; color: #78350f;">
              <li>Add your skills & experience</li>
              <li>Upload a professional photo</li>
              <li>Get discovered by top clients</li>
            </ul>
          </td>
        </tr>

        <!-- Why WorkBridge -->
        <tr>
          <td style="background-color: #f9fafb; padding: 30px; text-align: center;">
            <h3 style="color: #1e3a8a;">Why Choose WorkBridge?</h3>
            <ul style="list-style: none; padding: 0; color: #374151; font-size: 14px; line-height: 1.6; margin: 15px 0;">
              <li>✅ Verified Freelance Projects</li>
              <li>✅ Build Your Personal Brand</li>
              <li>✅ Connect with Clients Globally</li>
              <li>✅ Resume Builder + Skill Match</li>
            </ul>
            <a href="https://workbridge.in" style="display: inline-block; background-color: #1d4ed8; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; margin-top: 10px;">
              Explore WorkBridge
            </a>
          </td>
        </tr>

        <!-- Banner Image -->
        <tr>
          <td style="text-align: center;">
            <img src="https://i.postimg.cc/zvZrPhkr/workbridge-banner.png" alt="WorkBridge Banner" style="width: 100%; max-height: 200px; object-fit: cover;">
          </td>
        </tr>

        <!-- Support & Footer -->
        <tr>
          <td style="padding: 20px 30px; background-color: #f3f4f6; font-size: 13px; color: #4b5563;">
            <p style="margin: 0;"><strong>Need help?</strong> Visit our <a href="https://workbridge.in/support" style="color: #3b82f6; text-decoration: none;">Help Center</a> or contact us at <a href="mailto:support@workbridge.in" style="color: #3b82f6;">support@workbridge.in</a></p>
            <p style="margin-top: 10px;">🔐 <em>We’ll never ask for your OTP or password over email.</em></p>
          </td>
        </tr>

        <!-- Final Footer -->
        <tr>
          <td style="background-color: #1e3a8a; padding: 20px; color: #cbd5e1; text-align: center; font-size: 13px;">
            <p style="margin: 5px 0;"><strong>Nitesh Kumar Sharma</strong></p>
            <p style="margin: 0;">Founder & CEO, WorkBridge</p>
            <p style="margin: 0;"><a href="mailto:Niteshkumarsharma831@gmail.com" style="color: #93c5fd; text-decoration: none;">Niteshkumarsharma831@gmail.com</a></p>
            <p style="margin-top: 10px; font-size: 12px;">&copy; ${new Date().getFullYear()} WorkBridge. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

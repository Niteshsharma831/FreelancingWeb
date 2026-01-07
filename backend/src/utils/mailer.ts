import nodemailer from "nodemailer";

console.log('📧 Email Service Loading...');
console.log(`🔍 Current EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
console.log(`🔍 Current EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ SET (hidden)' : '❌ NOT SET'}`);

// Function to check if email is configured
export const isEmailConfigured = (): boolean => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const isConfigured = !!(user && pass);
  
  console.log(`🔍 Email configuration check:`);
  console.log(`   EMAIL_USER: ${user || 'empty'}`);
  console.log(`   EMAIL_PASS: ${pass ? '***' + pass.slice(-4) : 'empty'}`);
  console.log(`   Result: ${isConfigured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}`);
  
  return isConfigured;
};

// Create transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  if (!user || !pass) {
    console.warn('❌ Cannot create transporter: Missing credentials');
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user.trim(),
        pass: pass.trim()
      }
    });
    console.log('✅ Transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Error creating transporter:', error);
    return null;
  }
};

// Send OTP email
export const sendOtpMail = async (email: string, otp: string): Promise<boolean> => {
  console.log(`\n📧 SEND OTP CALLED for: ${email}`);
  
  // Check configuration
  if (!isEmailConfigured()) {
    console.warn("⚠️ Email credentials not configured. Skipping email send.");
    console.log(`📧 OTP for ${email}: ${otp}`);
    return false;
  }

  const transporter = createTransporter();
  
  if (!transporter) {
    console.error("❌ Failed to create email transporter");
    console.log(`📧 [FALLBACK] OTP for ${email}: ${otp}`);
    return false;
  }

  try {
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
      text: `Your OTP Code: ${otp}. This OTP is valid for 5 minutes.`
    };

    console.log(`📧 Attempting to send email via: ${process.env.EMAIL_USER}`);
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ OTP email sent successfully!`);
    console.log(`📧 Message ID: ${info.messageId}`);
    
    return true;
  } catch (error: any) {
    console.error("❌ Failed to send OTP email:", error.message);
    console.log(`📧 [FALLBACK] OTP for ${email}: ${otp}`);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 GMAIL AUTH ERROR - Please verify:');
      console.error('1. Go to: https://myaccount.google.com/apppasswords');
      console.error('2. Generate 16-character App Password (select "Mail" and "Other")');
      console.error('3. Update .env file with the new password');
    }
    
    return false;
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  console.log('\n🔧 Testing Email Configuration...');
  
  if (!isEmailConfigured()) {
    return false;
  }

  const transporter = createTransporter();
  
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error: any) {
    console.error("❌ Email configuration test failed:", error.message);
    return false;
  }
};

// Run test on module load
testEmailConfig();
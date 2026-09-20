// server.ts
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import dns from 'dns';

// 🔧 Fix MongoDB Atlas SRV DNS resolution
dns.setServers(['8.8.8.8', '1.1.1.1']);

// 🔧 Load .env from root directory FIRST
const envPath = path.resolve(process.cwd(), '.env');
console.log(`🔍 Loading .env from: ${envPath}`);

const result = dotenv.config({
  path: envPath,
  override: true
});

if (result.error) {
  console.error('❌ Failed to load .env file:', result.error);
  process.exit(1);
}

// ✅ Check for BOTH naming conventions
const EMAIL_USER = process.env.EMAIL_USER || process.env.MAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS || process.env.MAIL_PASS;

console.log('✅ Environment variables loaded:');
console.log(`   EMAIL_USER/MAIL_USER: ${EMAIL_USER ? '✅ Set' : '❌ Not set'}`);
console.log(`   EMAIL_PASS/MAIL_PASS: ${EMAIL_PASS ? '✅ Set (hidden)' : '❌ Not set'}`);
console.log(`   PORT: ${process.env.PORT || '5000'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);

// 🚨 CRITICAL: Import app AFTER dotenv is configured
const startServer = async () => {
  try {
    // Dynamically import app to ensure environment variables are loaded
    const { default: app } = await import('./app');

    const PORT = process.env.PORT || 5000;
    const MONGO_URI = process.env.MONGO_URI || '';

    console.log('🔍 Raw MONGO_URI:', process.env.MONGO_URI);
    console.log('🔍 Cleaned MONGO_URI:', JSON.stringify(process.env.MONGO_URI));

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    console.log('✅ MongoDB connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
};

// Start the server
startServer();
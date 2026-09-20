"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
// 🔧 Load .env from root directory FIRST
const envPath = path_1.default.resolve(process.cwd(), '.env');
console.log(`🔍 Loading .env from: ${envPath}`);
const result = dotenv_1.default.config({
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
        const { default: app } = await Promise.resolve().then(() => __importStar(require('./app')));
        const PORT = process.env.PORT || 5000;
        const MONGO_URI = process.env.MONGO_URI || '';
        console.log('🔍 Raw MONGO_URI:', process.env.MONGO_URI);
        console.log('🔍 Cleaned MONGO_URI:', JSON.stringify(process.env.MONGO_URI));
        // Connect to MongoDB
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ MongoDB connected');
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('❌ Server startup failed:', err);
        process.exit(1);
    }
};
// Start the server
startServer();

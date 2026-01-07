import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose: 'register' | 'login' | 'reset';
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['register', 'login', 'reset'],
    default: 'login'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '5m' } // Auto delete after 5 minutes
  },
  attempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster queries
OtpSchema.index({ email: 1, purpose: 1 });
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 }); // 5 minutes

export default mongoose.model<IOtp>("Otp", OtpSchema);
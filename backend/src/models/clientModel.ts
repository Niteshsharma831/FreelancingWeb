import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  profileCompleted: boolean;
  profile: {
    phone?: string;
    address?: string;
    profilePic?: string;
    verified?: boolean;
    skills?: string[];
    resume?: {
      url: string;
      format: 'pdf' | 'docx' | 'jpg' | 'png';
    };
  };
  createdAt: Date;
}

const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  email: { type: String, required: true, unique: true },
  profileCompleted: { type: Boolean, default: false },
  profile: {
    phone: { type: String },
    address: { type: String },
    profilePic: { type: String },
    verified: { type: Boolean, default: false },
    skills: [{ type: String }],
    resume: {
      url: { type: String },
      format: { type: String, enum: ['pdf', 'docx', 'jpg', 'png'] }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IClient>("Client", ClientSchema);

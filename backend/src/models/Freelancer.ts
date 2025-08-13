import mongoose, { Document, Schema } from "mongoose";

export interface IFreelancer extends Document {
  name: string;
  gender: "male" | "female" | "other";
  email: string;
  role: "freelancer";
  profileCompleted: boolean;
  profile?: {
    dob?: Date;
    bio?: string;
    skills?: string[];
    phone?: string;
    address?: string;
    profilePic?: string;
    verified?: boolean;
  };
  createdAt: Date;
}

const FreelancerSchema: Schema<IFreelancer> = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["freelancer"], default: "freelancer" },

  profileCompleted: { type: Boolean, default: false },

  profile: {
    dob: { type: Date },
    bio: { type: String },
    skills: [{ type: String }],
    phone: { type: String },
    address: { type: String },
    profilePic: { type: String },
    verified: { type: Boolean, default: false },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IFreelancer>("Freelancer", FreelancerSchema);

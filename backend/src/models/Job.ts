import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  budget?: number; // Optional for flexibility
  duration: string;
  skillsRequired: string[];
  location: string;
  category?: string;
  details?: string;
  jobMode: "Remote" | "Hybrid" | "Onsite";
  jobType: "Internship" | "Job";
  stipend?: number;
  ctc?: number;
  companyName: string;
  companyWebsite?: string;
  companyLogo?: string;
  perks?: string[];
  responsibilities?: string[];
  requirements?: string[];
  preferredQualifications?: string[];
  postedBy: mongoose.Types.ObjectId;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    
    budget: { type: Number, default: 0 }, // Optional for backward compatibility

    duration: { type: String, required: [true, "Duration is required"] },

    skillsRequired: {
      type: [String],
      required: [true, "At least one skill is required"],
    },

    location: { type: String, required: [true, "Location is required"] },

    category: { type: String },

    details: { type: String },

    jobMode: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      required: [true, "Job mode is required"],
    },

    jobType: {
      type: String,
      enum: ["Internship", "Job"],
      required: [true, "Job type is required"],
    },

    stipend: {
      type: Number,
      required: function (this: IJob) {
        return this.jobType === "Internship";
      },
    },

    ctc: {
      type: Number,
      required: function (this: IJob) {
        return this.jobType === "Job";
      },
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
    },

    companyWebsite: { type: String },
    companyLogo: { type: String },

    perks: { type: [String], default: [] },

    responsibilities: { type: [String], default: [] },

    requirements: { type: [String], default: [] },

    preferredQualifications: { type: [String], default: [] },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer", // or "Admin" if applicable
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);

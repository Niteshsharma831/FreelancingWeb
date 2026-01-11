// import mongoose, { Schema, Document } from "mongoose";

// export interface IApplication extends Document {
//   jobId: mongoose.Types.ObjectId;
//   clientId: mongoose.Types.ObjectId;
//   proposal: string;
//   status: "pending" | "accepted" | "rejected";
//   appliedAt?: Date;
// }

// const ApplicationSchema = new Schema<IApplication>({
//   jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
//   clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
//   proposal: { type: String, required: true },
//   status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
//   appliedAt: { type: Date, default: Date.now },
// });

// export default mongoose.model<IApplication>("Application", ApplicationSchema);

// models/Application.ts - UPDATED VERSION
import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId; // ADD THIS
  freelancerName: string; // ADD THIS
  freelancerEmail: string; // ADD THIS
  proposal: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: "Freelancer",
    required: true,
  }, // ADD THIS
  freelancerName: { type: String, required: true }, // ADD THIS
  freelancerEmail: { type: String, required: true }, // ADD THIS
  proposal: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);

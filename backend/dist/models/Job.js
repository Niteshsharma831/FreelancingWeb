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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const JobSchema = new mongoose_1.Schema({
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
        required: function () {
            return this.jobType === "Internship";
        },
    },
    ctc: {
        type: Number,
        required: function () {
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Freelancer", // or "Admin" if applicable
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Job", JobSchema);

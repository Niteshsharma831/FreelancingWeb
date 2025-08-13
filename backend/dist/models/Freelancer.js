"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FreelancerSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("Freelancer", FreelancerSchema);

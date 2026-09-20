"use strict";
// import { Request, Response, NextFunction } from "express";
// import mongoose from "mongoose";
// import Freelancer from "../models/Freelancer";
// import Otp from "../models/Otp";
// import { generateOtp, otpExpiry } from "../utils/otp";
// import { sendOtpMail } from "../utils/mailer";
// import { generateToken } from "../utils/jwt";
// import jwt from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationStats = exports.getApplicationById = exports.deleteApplication = exports.updateApplicationStatus = exports.getJobApplications = exports.createApplication = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Application_1 = __importDefault(require("../models/Application"));
const Job_1 = __importDefault(require("../models/Job"));
const Freelancer_1 = __importDefault(require("../models/Freelancer"));
// 🆕 Create a new job application
const createApplication = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const { jobId, proposal } = req.body;
        // Validate required fields
        if (!jobId || !proposal) {
            res.status(400).json({
                success: false,
                error: "Job ID and proposal are required",
            });
            return;
        }
        // Check if user is a freelancer
        if (userRole !== "freelancer") {
            res.status(403).json({
                success: false,
                error: "Only freelancers can apply for jobs",
            });
            return;
        }
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        // Check if job exists
        const job = await Job_1.default.findById(jobId);
        if (!job) {
            res.status(404).json({
                success: false,
                error: "Job not found",
            });
            return;
        }
        // Check if job is open for applications
        if (job.status !== "open") {
            res.status(400).json({
                success: false,
                error: `Job is ${job.status}. Cannot apply.`,
            });
            return;
        }
        // Check if freelancer exists
        const freelancer = await Freelancer_1.default.findById(userId);
        if (!freelancer) {
            res.status(404).json({
                success: false,
                error: "Freelancer not found",
            });
            return;
        }
        // Create new application - Updated to match your model
        const application = new Application_1.default({
            jobId,
            clientId: job.clientId,
            proposal,
            status: "pending",
        });
        await application.save();
        // Update job applications count if the field exists
        if (job.applicationsCount !== undefined) {
            await Job_1.default.findByIdAndUpdate(jobId, {
                $inc: { applicationsCount: 1 },
            });
        }
        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: { application },
        });
    }
    catch (error) {
        console.error("Create application error:", error);
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({
                success: false,
                error: "Validation failed",
                details: Object.values(error.errors).map((err) => err.message),
            });
            return;
        }
        if (error instanceof mongoose_1.default.Error.CastError) {
            res.status(400).json({
                success: false,
                error: "Invalid ID format",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to create application",
        });
    }
};
exports.createApplication = createApplication;
// 📋 Get all applications for a specific job
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!jobId) {
            res.status(400).json({
                success: false,
                error: "Job ID is required",
            });
            return;
        }
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        // Check if job exists
        const job = await Job_1.default.findById(jobId);
        if (!job) {
            res.status(404).json({
                success: false,
                error: "Job not found",
            });
            return;
        }
        let applications;
        if (userRole === "client") {
            // Client can only see applications for their own jobs
            if (job.clientId.toString() !== userId) {
                res.status(403).json({
                    success: false,
                    error: "Access denied. You can only view applications for your own jobs",
                });
                return;
            }
            applications = await Application_1.default.find({ jobId, clientId: userId }).sort({
                appliedAt: -1,
            });
        }
        else if (userRole === "freelancer") {
            // Note: Your model doesn't have freelancerId, so we need to check differently
            // For now, freelancers can see all applications for a job (might need to update model)
            applications = await Application_1.default.find({ jobId }).sort({ appliedAt: -1 });
        }
        else {
            res.status(403).json({
                success: false,
                error: "Access denied",
            });
            return;
        }
        res.status(200).json({
            success: true,
            count: applications.length,
            data: { applications },
        });
    }
    catch (error) {
        console.error("Get job applications error:", error);
        if (error instanceof mongoose_1.default.Error.CastError) {
            res.status(400).json({
                success: false,
                error: "Invalid job ID format",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch applications",
        });
    }
};
exports.getJobApplications = getJobApplications;
// ✏️ Update application status (Client only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!id || !status) {
            res.status(400).json({
                success: false,
                error: "Application ID and status are required",
            });
            return;
        }
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        // Check if user is a client
        if (userRole !== "client") {
            res.status(403).json({
                success: false,
                error: "Only clients can update application status",
            });
            return;
        }
        const validStatuses = ["pending", "accepted", "rejected"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
            return;
        }
        const application = await Application_1.default.findById(id);
        if (!application) {
            res.status(404).json({
                success: false,
                error: "Application not found",
            });
            return;
        }
        // Check if client owns the job
        if (application.clientId.toString() !== userId) {
            res.status(403).json({
                success: false,
                error: "Access denied. You can only update applications for your own jobs",
            });
            return;
        }
        // Update status
        application.status = status;
        await application.save();
        // If accepted, update job status
        if (status === "accepted") {
            await Job_1.default.findByIdAndUpdate(application.jobId, {
                status: "in_progress",
                // Note: Your Application model doesn't have freelancerId
                // You might need to update your models
            });
            // Reject all other applications for this job
            await Application_1.default.updateMany({
                jobId: application.jobId,
                _id: { $ne: application._id },
                status: "pending",
            }, { status: "rejected" });
        }
        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            data: { application },
        });
    }
    catch (error) {
        console.error("Update application status error:", error);
        if (error instanceof mongoose_1.default.Error.CastError) {
            res.status(400).json({
                success: false,
                error: "Invalid application ID format",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to update application status",
        });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
// ❌ Delete/cancel application
const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!id) {
            res.status(400).json({
                success: false,
                error: "Application ID is required",
            });
            return;
        }
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        const application = await Application_1.default.findById(id);
        if (!application) {
            res.status(404).json({
                success: false,
                error: "Application not found",
            });
            return;
        }
        let hasPermission = false;
        if (userRole === "client") {
            // Client can delete applications for their own jobs
            hasPermission = application.clientId.toString() === userId;
        }
        else if (userRole === "freelancer") {
            // Note: Your model doesn't have freelancerId field
            // You need to update your Application model to include freelancerId
            hasPermission = false; // Temporary - need model update
        }
        if (!hasPermission) {
            res.status(403).json({
                success: false,
                error: "Access denied",
            });
            return;
        }
        // Check if application can be deleted (only pending)
        if (application.status !== "pending") {
            res.status(400).json({
                success: false,
                error: `Cannot delete application with status: ${application.status}`,
            });
            return;
        }
        // Delete the application
        await Application_1.default.deleteOne({ _id: id });
        // Decrement applications count in job
        const job = await Job_1.default.findById(application.jobId);
        if (job &&
            job.applicationsCount !== undefined &&
            job.applicationsCount > 0) {
            await Job_1.default.findByIdAndUpdate(application.jobId, {
                $inc: { applicationsCount: -1 },
            });
        }
        res.status(200).json({
            success: true,
            message: "Application deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete application error:", error);
        if (error instanceof mongoose_1.default.Error.CastError) {
            res.status(400).json({
                success: false,
                error: "Invalid application ID format",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete application",
        });
    }
};
exports.deleteApplication = deleteApplication;
// 🔍 Get single application by ID
const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!id) {
            res.status(400).json({
                success: false,
                error: "Application ID is required",
            });
            return;
        }
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        const application = await Application_1.default.findById(id)
            .populate("jobId", "title description budget duration category status")
            .populate("clientId", "name email");
        if (!application) {
            res.status(404).json({
                success: false,
                error: "Application not found",
            });
            return;
        }
        // Check permissions
        let hasPermission = false;
        if (userRole === "client") {
            hasPermission = application.clientId.toString() === userId;
        }
        else if (userRole === "freelancer") {
            // Note: Your model needs freelancerId field
            // hasPermission = application.freelancerId.toString() === userId;
            hasPermission = false; // Temporary
        }
        else if (userRole === "admin") {
            hasPermission = true;
        }
        if (!hasPermission) {
            res.status(403).json({
                success: false,
                error: "Access denied",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: { application },
        });
    }
    catch (error) {
        console.error("Get application by ID error:", error);
        if (error instanceof mongoose_1.default.Error.CastError) {
            res.status(400).json({
                success: false,
                error: "Invalid application ID format",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch application",
        });
    }
};
exports.getApplicationById = getApplicationById;
// 📊 Get application statistics
const getApplicationStats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
            return;
        }
        let stats;
        if (userRole === "client") {
            // Client stats
            const totalApplications = await Application_1.default.countDocuments({
                clientId: userId,
            });
            const pendingApplications = await Application_1.default.countDocuments({
                clientId: userId,
                status: "pending",
            });
            const acceptedApplications = await Application_1.default.countDocuments({
                clientId: userId,
                status: "accepted",
            });
            stats = {
                total: totalApplications,
                pending: pendingApplications,
                accepted: acceptedApplications,
            };
        }
        else if (userRole === "freelancer") {
            // Note: Your model doesn't track freelancer applications
            // You need to update your Application model
            stats = {
                total: 0,
                pending: 0,
                accepted: 0,
                rejected: 0,
                successRate: 0,
            };
        }
        else {
            res.status(403).json({
                success: false,
                error: "Access denied",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: { stats },
        });
    }
    catch (error) {
        console.error("Get application stats error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch statistics",
        });
    }
};
exports.getApplicationStats = getApplicationStats;

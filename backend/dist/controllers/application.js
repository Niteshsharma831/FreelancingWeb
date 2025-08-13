"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getFreelancerApplications = exports.getClientApplications = exports.applyForJob = void 0;
const Application_1 = __importDefault(require("../models/Application"));
const Job_1 = __importDefault(require("../models/Job"));
const sendApplicationSuccessMail_1 = require("../utils/sendApplicationSuccessMail");
const ApplicationStatusUpadteMail_1 = require("../utils/ApplicationStatusUpadteMail");
// Apply for a job
const applyForJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const clientEmail = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
        const role = (_c = req.user) === null || _c === void 0 ? void 0 : _c.role;
        const { jobId, proposal } = req.body;
        if (!clientId || role !== "client") {
            return res.status(403).json({ error: "Only clients can apply for jobs" });
        }
        const existingApp = yield Application_1.default.findOne({ jobId, clientId });
        if (existingApp) {
            return res.status(400).json({ error: "Already applied to this job" });
        }
        const job = yield Job_1.default.findById(jobId);
        if (!job)
            return res.status(404).json({ error: "Job not found" });
        const application = yield Application_1.default.create({
            jobId: job._id,
            clientId,
            proposal,
        });
        if (clientEmail) {
            yield (0, sendApplicationSuccessMail_1.sendApplicationSuccessMail)(clientEmail, job.title, job.location, ((_d = job.budget) !== null && _d !== void 0 ? _d : 0).toString(), // ✅ safe default if undefined
            job.duration, application._id.toString(), // ✅ type cast
            job._id.toString() // ✅ type cast
            );
        }
        res.status(201).json({ message: "Application submitted", application });
    }
    catch (error) {
        console.error("Application error:", error);
        res.status(500).json({ error: "Failed to apply for job" });
    }
});
exports.applyForJob = applyForJob;
// Get all applications for a client
const getClientApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!clientId)
            return res.status(401).json({ error: "Unauthorized" });
        const applications = yield Application_1.default.find({ clientId })
            .populate("jobId", "title description skillsRequired location duration budget")
            .sort({ appliedAt: -1 });
        res.status(200).json(applications);
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});
exports.getClientApplications = getClientApplications;
// Get all applications for freelancer's posted jobs
const getFreelancerApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const freelancerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!freelancerId)
            return res.status(401).json({ error: "Unauthorized" });
        const jobs = yield Job_1.default.find({ postedBy: freelancerId }, "_id");
        const jobIds = jobs.map(j => j._id);
        const applications = yield Application_1.default.find({ jobId: { $in: jobIds } })
            .populate("jobId", "title")
            .populate("clientId", "name email")
            .sort({ appliedAt: -1 });
        res.status(200).json(applications);
    }
    catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
});
exports.getFreelancerApplications = getFreelancerApplications;
// Update application status
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const application = yield Application_1.default.findById(applicationId)
            .populate("jobId", "title _id")
            .populate("clientId", "email");
        if (!application)
            return res.status(404).json({ error: "Application not found" });
        application.status = status;
        yield application.save();
        const clientEmail = application.clientId.email;
        const jobTitle = application.jobId.title;
        const jobId = application.jobId._id;
        yield (0, ApplicationStatusUpadteMail_1.sendApplicationStatusMail)(clientEmail, jobTitle, jobId.toString(), application._id.toString(), status);
        res.status(200).json({ message: "Application status updated and email sent" });
    }
    catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ error: "Failed to update application status" });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;

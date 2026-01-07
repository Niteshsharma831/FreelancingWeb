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
exports.createJobsBulk = exports.getJobsByFreelancer = exports.getJobById = exports.deleteJob = exports.updateJob = exports.getMyJobs = exports.getAllJobs = exports.createJob = void 0;
const Job_1 = __importDefault(require("../models/Job"));
// 🚀 Create a new job (freelancer only)
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: freelancerId, role } = req.user;
        if (role !== "freelancer") {
            return res.status(403).json({ error: "Only freelancers can post jobs" });
        }
        const { title, description, duration, skillsRequired, location, category, details, jobMode, jobType, stipend, ctc, companyName, companyWebsite, companyLogo, perks, responsibilities, requirements, preferredQualifications, } = req.body;
        // ✅ Basic required fields validation
        if (!title ||
            !description ||
            !duration ||
            !skillsRequired ||
            !location ||
            !jobMode ||
            !jobType ||
            !companyName) {
            return res.status(400).json({ error: "Please fill in all required fields" });
        }
        // ✅ Validate jobType-specific fields
        if (jobType === "Internship" && !stipend) {
            return res.status(400).json({ error: "Stipend is required for internships" });
        }
        if (jobType === "Job" && !ctc) {
            return res.status(400).json({ error: "CTC is required for jobs" });
        }
        const newJob = new Job_1.default({
            title,
            description,
            duration,
            skillsRequired,
            location,
            category,
            details,
            jobMode,
            jobType,
            stipend: jobType === "Internship" ? stipend : undefined,
            ctc: jobType === "Job" ? ctc : undefined,
            companyName,
            companyWebsite,
            companyLogo,
            perks,
            responsibilities,
            requirements,
            preferredQualifications,
            budget: jobType === "Internship" ? stipend : ctc, // Optional compatibility
            postedBy: freelancerId,
        });
        yield newJob.save();
        res.status(201).json({ message: "Job posted successfully", job: newJob });
    }
    catch (error) {
        console.error("Create Job Error:", error);
        res.status(500).json({ error: "Failed to create job" });
    }
});
exports.createJob = createJob;
// 📄 Get all jobs (public)
const getAllJobs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield Job_1.default.find()
            .sort({ createdAt: -1 })
            .populate("postedBy", "name profilePic");
        res.status(200).json(jobs);
    }
    catch (error) {
        console.error("Get All Jobs Error:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});
exports.getAllJobs = getAllJobs;
// 👨‍💻 Get jobs created by logged-in freelancer
const getMyJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: freelancerId, role } = req.user;
        console.log("Freelancer ID:", freelancerId);
        console.log("User Role:", role);
        if (role !== "freelancer") {
            return res.status(403).json({ error: "Access denied: freelancers only" });
        }
        const jobs = yield Job_1.default.find({ postedBy: freelancerId })
            .sort({ createdAt: -1 })
            .populate("postedBy", "name email profilePic");
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "No jobs posted yet." });
        }
        res.status(200).json(jobs);
    }
    catch (error) {
        console.error("Get My Jobs Error:", error);
        res.status(500).json({ error: "Failed to fetch jobs", details: error.message });
    }
});
exports.getMyJobs = getMyJobs;
// ✏️ Update a job (freelancer only, own jobs)
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.id;
        const { id: freelancerId, role } = req.user;
        // Only freelancers can update jobs
        if (role !== "freelancer") {
            return res.status(403).json({ error: "Only freelancers can update jobs" });
        }
        const job = yield Job_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        if (job.postedBy.toString() !== freelancerId) {
            return res.status(403).json({ error: "Not authorized to update this job" });
        }
        const { title, description, duration, skillsRequired, location, category, details, jobMode, jobType, stipend, ctc, companyName, companyWebsite, companyLogo, perks, responsibilities, requirements, preferredQualifications, } = req.body;
        // Validate jobType-based compensation
        if (jobType === "Internship" && !stipend) {
            return res.status(400).json({ error: "Stipend is required for internships" });
        }
        if (jobType === "Job" && !ctc) {
            return res.status(400).json({ error: "CTC is required for jobs" });
        }
        // Update fields only if provided
        if (title !== undefined)
            job.title = title;
        if (description !== undefined)
            job.description = description;
        if (duration !== undefined)
            job.duration = duration;
        if (skillsRequired !== undefined)
            job.skillsRequired = skillsRequired;
        if (location !== undefined)
            job.location = location;
        if (category !== undefined)
            job.category = category;
        if (details !== undefined)
            job.details = details;
        if (jobMode !== undefined)
            job.jobMode = jobMode;
        if (jobType !== undefined)
            job.jobType = jobType;
        if (stipend !== undefined)
            job.stipend = stipend;
        if (ctc !== undefined)
            job.ctc = ctc;
        if (companyName !== undefined)
            job.companyName = companyName;
        if (companyWebsite !== undefined)
            job.companyWebsite = companyWebsite;
        if (companyLogo !== undefined)
            job.companyLogo = companyLogo;
        if (perks !== undefined)
            job.perks = perks;
        if (responsibilities !== undefined)
            job.responsibilities = responsibilities;
        if (requirements !== undefined)
            job.requirements = requirements;
        if (preferredQualifications !== undefined)
            job.preferredQualifications = preferredQualifications;
        // Auto-set budget and clear unused field
        if (job.jobType === "Internship") {
            job.budget = job.stipend;
            job.ctc = undefined;
        }
        else if (job.jobType === "Job") {
            job.budget = job.ctc;
            job.stipend = undefined;
        }
        yield job.save();
        res.status(200).json({ message: "Job updated successfully", job });
    }
    catch (error) {
        console.error("Update Job Error:", error);
        res.status(500).json({ error: "Failed to update job" });
    }
});
exports.updateJob = updateJob;
// 🗑️ Delete a job (freelancer only, own jobs)
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: freelancerId, role } = req.user;
        const { jobId } = req.params;
        if (role !== "freelancer") {
            return res.status(403).json({ error: "Only freelancers can delete jobs" });
        }
        const job = yield Job_1.default.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        // ✅ Add these logs for debugging
        console.log("Freelancer ID:", freelancerId);
        console.log("Job postedBy:", job.postedBy.toString());
        if (job.postedBy.toString() !== freelancerId) {
            return res.status(403).json({ error: "Not authorized to delete this job" });
        }
        yield job.deleteOne();
        res.status(200).json({ message: "Job deleted successfully" });
    }
    catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ error: "Failed to delete job" });
    }
});
exports.deleteJob = deleteJob;
// 📄 Get a single job by ID (public)
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const job = yield Job_1.default.findById(jobId).populate("postedBy", "name profilePic");
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(job);
    }
    catch (error) {
        console.error("Get Job By ID Error:", error);
        res.status(500).json({ error: "Failed to fetch job" });
    }
});
exports.getJobById = getJobById;
// 🎯 Get jobs by freelancerId (public or dashboard use)
const getJobsByFreelancer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { freelancerId } = req.params;
        if (!freelancerId) {
            return res.status(400).json({ error: "Freelancer ID is required" });
        }
        const jobs = yield Job_1.default.find({ postedBy: freelancerId }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    }
    catch (error) {
        console.error("Get Jobs By Freelancer Error:", error);
        res.status(500).json({ error: "Failed to fetch freelancer's jobs" });
    }
});
exports.getJobsByFreelancer = getJobsByFreelancer;
const createJobsBulk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: freelancerId, role } = req.user;
        if (role !== "freelancer") {
            return res.status(403).json({ error: "Only freelancers can post jobs" });
        }
        const jobs = req.body; // expecting an array of jobs
        if (!Array.isArray(jobs) || jobs.length === 0) {
            return res.status(400).json({ error: "No jobs provided" });
        }
        // Validate each job
        const invalidJobs = jobs.filter(job => !job.title ||
            !job.description ||
            !job.duration ||
            !job.skillsRequired ||
            !job.location ||
            !job.jobMode ||
            !job.jobType ||
            !job.companyName ||
            (job.jobType === "Job" && !job.ctc) ||
            (job.jobType === "Internship" && !job.stipend));
        if (invalidJobs.length > 0) {
            return res.status(400).json({ error: "Some jobs are missing required fields" });
        }
        // Attach freelancerId and budget automatically
        const jobsToInsert = jobs.map(job => (Object.assign(Object.assign({}, job), { postedBy: freelancerId, budget: job.jobType === "Job" ? job.ctc : job.stipend, stipend: job.jobType === "Internship" ? job.stipend : undefined, ctc: job.jobType === "Job" ? job.ctc : undefined })));
        const insertedJobs = yield Job_1.default.insertMany(jobsToInsert);
        res.status(201).json({
            message: `${insertedJobs.length} jobs posted successfully`,
            data: insertedJobs,
        });
    }
    catch (error) {
        console.error("Bulk Create Jobs Error:", error);
        res.status(500).json({ error: "Failed to create jobs", details: error.message });
    }
});
exports.createJobsBulk = createJobsBulk;

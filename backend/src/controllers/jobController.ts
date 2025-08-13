import { Request, Response } from "express";
import Job from "../models/Job";

// 🚀 Create a new job (freelancer only)
export const createJob = async (req: Request, res: Response) => {
  try {
    const { id: freelancerId, role } = (req as any).user;

    if (role !== "freelancer") {
      return res.status(403).json({ error: "Only freelancers can post jobs" });
    }

    const {
      title,
      description,
      duration,
      skillsRequired,
      location,
      category,
      details,
      jobMode,
      jobType,
      stipend,
      ctc,
      companyName,
      companyWebsite,
      companyLogo,
      perks,
      responsibilities,
      requirements,
      preferredQualifications,
    } = req.body;

    // ✅ Basic required fields validation
    if (
      !title ||
      !description ||
      !duration ||
      !skillsRequired ||
      !location ||
      !jobMode ||
      !jobType ||
      !companyName
    ) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }

    // ✅ Validate jobType-specific fields
    if (jobType === "Internship" && !stipend) {
      return res.status(400).json({ error: "Stipend is required for internships" });
    }
    if (jobType === "Job" && !ctc) {
      return res.status(400).json({ error: "CTC is required for jobs" });
    }

    const newJob = new Job({
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

    await newJob.save();

    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
};

// 📄 Get all jobs (public)
export const getAllJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name profilePic");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// 👨‍💻 Get jobs created by logged-in freelancer
export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const { id: freelancerId, role } = (req as any).user;

    console.log("Freelancer ID:", freelancerId);
    console.log("User Role:", role);

    if (role !== "freelancer") {
      return res.status(403).json({ error: "Access denied: freelancers only" });
    }

    const jobs = await Job.find({ postedBy: freelancerId })
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email profilePic");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs posted yet." });
    }

    res.status(200).json(jobs);
  } catch (error: any) {
    console.error("Get My Jobs Error:", error);
    res.status(500).json({ error: "Failed to fetch jobs", details: error.message });
  }
};


// ✏️ Update a job (freelancer only, own jobs)
export const updateJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const { id: freelancerId, role } = (req as any).user;

    // Only freelancers can update jobs
    if (role !== "freelancer") {
      return res.status(403).json({ error: "Only freelancers can update jobs" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.postedBy.toString() !== freelancerId) {
      return res.status(403).json({ error: "Not authorized to update this job" });
    }

    const {
      title,
      description,
      duration,
      skillsRequired,
      location,
      category,
      details,
      jobMode,
      jobType,
      stipend,
      ctc,
      companyName,
      companyWebsite,
      companyLogo,
      perks,
      responsibilities,
      requirements,
      preferredQualifications,
    } = req.body;

    // Validate jobType-based compensation
    if (jobType === "Internship" && !stipend) {
      return res.status(400).json({ error: "Stipend is required for internships" });
    }
    if (jobType === "Job" && !ctc) {
      return res.status(400).json({ error: "CTC is required for jobs" });
    }

    // Update fields only if provided
    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (duration !== undefined) job.duration = duration;
    if (skillsRequired !== undefined) job.skillsRequired = skillsRequired;
    if (location !== undefined) job.location = location;
    if (category !== undefined) job.category = category;
    if (details !== undefined) job.details = details;
    if (jobMode !== undefined) job.jobMode = jobMode;
    if (jobType !== undefined) job.jobType = jobType;
    if (stipend !== undefined) job.stipend = stipend;
    if (ctc !== undefined) job.ctc = ctc;
    if (companyName !== undefined) job.companyName = companyName;
    if (companyWebsite !== undefined) job.companyWebsite = companyWebsite;
    if (companyLogo !== undefined) job.companyLogo = companyLogo;
    if (perks !== undefined) job.perks = perks;
    if (responsibilities !== undefined) job.responsibilities = responsibilities;
    if (requirements !== undefined) job.requirements = requirements;
    if (preferredQualifications !== undefined) job.preferredQualifications = preferredQualifications;

    // Auto-set budget and clear unused field
    if (job.jobType === "Internship") {
      job.budget = job.stipend;
      job.ctc = undefined;
    } else if (job.jobType === "Job") {
      job.budget = job.ctc;
      job.stipend = undefined;
    }

    await job.save();

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
};
// 🗑️ Delete a job (freelancer only, own jobs)
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id: freelancerId, role } = (req as any).user;
    const { jobId } = req.params;

    if (role !== "freelancer") {
      return res.status(403).json({ error: "Only freelancers can delete jobs" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // ✅ Add these logs for debugging
    console.log("Freelancer ID:", freelancerId);
    console.log("Job postedBy:", job.postedBy.toString());

    if (job.postedBy.toString() !== freelancerId) {
      return res.status(403).json({ error: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ error: "Failed to delete job" });
  }
};
// 📄 Get a single job by ID (public)
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate("postedBy", "name profilePic");

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch job" });
  }
};

// 🎯 Get jobs by freelancerId (public or dashboard use)
export const getJobsByFreelancer = async (req: Request, res: Response) => {
  try {
    const { freelancerId } = req.params;

    if (!freelancerId) {
      return res.status(400).json({ error: "Freelancer ID is required" });
    }

    const jobs = await Job.find({ postedBy: freelancerId }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Get Jobs By Freelancer Error:", error);
    res.status(500).json({ error: "Failed to fetch freelancer's jobs" });
  }
};
// controllers/applicationController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import ApplicationModel from "../models/Application";
import JobModel from "../models/Job";
import { sendApplicationSuccessMail } from "../utils/sendApplicationSuccessMail";
import { sendApplicationStatusMail } from "../utils/ApplicationStatusUpadteMail";

// Type for authenticated user in request
interface IUser {
  id: string;
  email?: string;
  role: string;
}

interface IUserRequest extends Request {
  user?: IUser;
}

// Apply for a job
export const applyForJob = async (req: IUserRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    const clientEmail = req.user?.email;
    const role = req.user?.role;
    const { jobId, proposal } = req.body;

    if (!clientId || role !== "client") {
      return res.status(403).json({ error: "Only clients can apply for jobs" });
    }

    const existingApp = await ApplicationModel.findOne({ jobId, clientId });
    if (existingApp) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    const job = await JobModel.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const application = await ApplicationModel.create({
      jobId: job._id,
      clientId,
      proposal,
    });

    if (clientEmail) {
      await sendApplicationSuccessMail(
        clientEmail,
        job.title,
        job.location,
        (job.budget ?? 0).toString(), // ✅ safe default if undefined
        job.duration,
        (application._id as mongoose.Types.ObjectId).toString(), // ✅ type cast
        (job._id as mongoose.Types.ObjectId).toString() // ✅ type cast
      );
    }

    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ error: "Failed to apply for job" });
  }
};

// Get all applications for a client
export const getClientApplications = async (req: IUserRequest, res: Response) => {
  try {
    const clientId = req.user?.id;
    if (!clientId) return res.status(401).json({ error: "Unauthorized" });

    const applications = await ApplicationModel.find({ clientId })
      .populate("jobId", "title description skillsRequired location duration budget")
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Get all applications for freelancer's posted jobs
export const getFreelancerApplications = async (req: IUserRequest, res: Response) => {
  try {
    const freelancerId = req.user?.id;
    if (!freelancerId) return res.status(401).json({ error: "Unauthorized" });

    const jobs = await JobModel.find({ postedBy: freelancerId }, "_id");
    const jobIds = jobs.map(j => j._id);

    const applications = await ApplicationModel.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title")
      .populate("clientId", "name email")
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Update application status
export const updateApplicationStatus = async (req: IUserRequest, res: Response) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const application = await ApplicationModel.findById(applicationId)
      .populate("jobId", "title _id")
      .populate("clientId", "email");

    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = status;
    await application.save();

    const clientEmail = (application.clientId as any).email;
    const jobTitle = (application.jobId as any).title;
    const jobId = (application.jobId as any)._id;

    await sendApplicationStatusMail(
      clientEmail,
      jobTitle,
      (jobId as mongoose.Types.ObjectId).toString(),
      (application._id as mongoose.Types.ObjectId).toString(),
      status
    );

    res.status(200).json({ message: "Application status updated and email sent" });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Failed to update application status" });
  }
};

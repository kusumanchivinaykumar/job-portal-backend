import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

// ---------------- Admin Job Posting ----------------
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id; // from JWT auth middleware

    console.log("Received POST /jobs request");
    console.log("User ID:", userId);
    console.log("Company ID:", companyId);
    console.log("Request body:", req.body);

    // Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      console.warn("Validation failed: Missing required fields");
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      console.warn("Validation failed: Invalid companyId");
      return res.status(400).json({ message: "Invalid companyId", success: false });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn("Validation failed: Invalid userId");
      return res.status(400).json({ message: "Invalid userId", success: false });
    }

    // Convert requirements to array
    let requirementsArray = [];
    if (Array.isArray(requirements)) {
      requirementsArray = requirements.map((r) => r.trim()).filter(Boolean);
    } else if (typeof requirements === "string") {
      requirementsArray = requirements
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);
    }

    console.log("Processed requirements array:", requirementsArray);

    const job = await Job.create({
      title,
      description,
      requirements: requirementsArray,
      salary: Number(salary),
      location,
      jobType,
      experience: Number(experience),
      position: Number(position),
      company: companyId,
      created_by: userId,
    });

    console.log("Job created successfully:", job);

    return res.status(201).json({
      message: "Job posted successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Job creation failed:", error);

    if (error.name === "ValidationError") {
      // Log detailed Mongoose validation errors
      for (let field in error.errors) {
        console.error(`Validation error - ${field}:`, error.errors[field].message);
      }
    }

    return res.status(500).json({
      message: error.message || "Server Error",
      success: false,
    });
  }
};

// ---------------- Get All Jobs ----------------
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({ message: error.message || "Server Error", success: false });
  }
};

// ---------------- Get Job By ID ----------------
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID", success: false });
    }

    const job = await Job.findById(jobId)
      .populate("company")
      .populate("applications");

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    return res.status(500).json({ message: error.message || "Server Error", success: false });
  }
};

// ---------------- Get Jobs Created By Admin ----------------
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid Admin ID", success: false });
    }

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("Get Admin Jobs Error:", error);
    return res.status(500).json({ message: error.message || "Server Error", success: false });
  }
};

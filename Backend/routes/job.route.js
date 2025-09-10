import express from "express";
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// ---------------- Post a Job ----------------
router.post("/jobs", authenticateToken, postJob);

// ---------------- Get All Jobs ----------------
router.get("/jobs", authenticateToken, getAllJobs);

// ---------------- Get Jobs Created by Admin ----------------
router.get("/admin/jobs", authenticateToken, getAdminJobs);

// ---------------- Get Job by ID ----------------
router.get("/jobs/:id", authenticateToken, getJobById);

export default router;

import express from "express";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { companyUpload } from "../middleware/multer.js"; // For company logo uploads
import authenticateToken from "../middleware/isAuthenticated.js"; // JWT auth

const router = express.Router();

// ---------------- Register Company ----------------
// Optional file: company logo
router.post("/register", authenticateToken, companyUpload, registerCompany);

// ---------------- Get All Companies ----------------
router.get("/get", authenticateToken, getAllCompanies);

// ---------------- Get Company by ID ----------------
router.get("/get/:id", authenticateToken, getCompanyById);

// ---------------- Update Company ----------------
// Optional file: company logo
router.put("/update/:id", authenticateToken, companyUpload, updateCompany);

export default router;

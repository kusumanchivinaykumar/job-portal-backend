import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { roleBasedUpload } from "../middleware/multer.js";

const router = express.Router();

// ---------------- Register ----------------
// Registration: Students upload profilePhoto, Recruiters upload resume
router.post("/register", roleBasedUpload, register);

// ---------------- Login ----------------
router.post("/login", login);

// ---------------- Logout ----------------
router.post("/logout", logout);

// ---------------- Update Profile ----------------
// Update Profile: optional resume upload
router.post("/profile/update", authenticateToken, roleBasedUpload, updateProfile);

export default router;

import multer from "multer";
import path from "path";
import fs from "fs";

// Path to uploads folder
const uploadPath = path.join(process.cwd(), "uploads");

// Create folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("Uploads folder created at:", uploadPath);
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ✅ Uploads for role-based registration (students & recruiters)
export const roleBasedUpload = multer({ storage }).fields([
  { name: "profilePhoto", maxCount: 1 }, // Student uploads profile photo
  { name: "resume", maxCount: 1 },       // Recruiter uploads resume
]);

// ✅ Upload for company logo (single file)
export const companyUpload = multer({ storage }).single("logo");
// ⚠️ Frontend must append file with key "logo"

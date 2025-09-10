import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

// Routes
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// ---------------- Middleware ----------------
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (for form-data)
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Enable CORS for frontend with credentials (cookies)
app.use(
  cors({
    origin: ["https://job-portal-frontend-1-gj0h.onrender.com"], // your frontend URL
    credentials: true,
  })
);

// ---------------- Routes ----------------
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

// ---------------- Default route ----------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

// ---------------- Register ----------------
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, adharcard, pancard, role } = req.body;

    // Validate required fields
    if (!fullname || !email || !phoneNumber || !password || !role || !pancard || !adharcard) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }

    // Check duplicates
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already exists", success: false });
    if (await User.findOne({ adharcard })) return res.status(400).json({ message: "Aadhar number already exists", success: false });
    if (await User.findOne({ pancard })) return res.status(400).json({ message: "PAN number already exists", success: false });

    // Role-based file check
    let file;
    if (role === "Student") {
      file = req.files?.profilePhoto?.[0];
      if (!file) return res.status(400).json({ message: "Profile photo is required", success: false });
    } else if (role === "Recruiter") {
      file = req.files?.resume?.[0];
      if (!file) return res.status(400).json({ message: "Resume is required", success: false });
    }

    // Convert file to Data URI and upload to Cloudinary
    const fileUri = getDataUri(file);
    if (!fileUri || !fileUri.content) return res.status(400).json({ message: "Invalid file", success: false });
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      adharcard,
      pancard,
      password: hashedPassword,
      role,
      profile: {},
    });

    // Save uploaded file URL
    if (role === "Student") {
      newUser.profile.profilePhoto = cloudResponse.secure_url;
    } else if (role === "Recruiter") {
      newUser.profile.resume = cloudResponse.secure_url;
      newUser.profile.resumeOriginalName = file.originalname;
    }

    await newUser.save();

    return res.status(201).json({
      message: `Account created successfully for ${fullname}`,
      success: true,
      user: newUser,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message || "Server error", success: false });
  }
};

// ---------------- Login ----------------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: "Missing required fields", success: false });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Incorrect email or password", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect email or password", success: false });

    if (user.role !== role) return res.status(403).json({ message: "Role mismatch", success: false });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      adharcard: user.adharcard,
      pancard: user.pancard,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: "Strict" })
      .json({ message: `Welcome back ${user.fullname}`, user: sanitizedUser, success: true });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server Error login failed", success: false });
  }
};

// ---------------- Logout ----------------
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server Error logging out", success: false });
  }
};

// ---------------- Update Profile ----------------
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id; // from auth middleware
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    // Optional resume upload
    const file = req.files?.resume?.[0];
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user, success: true });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server Error updating profile", success: false });
  }
};

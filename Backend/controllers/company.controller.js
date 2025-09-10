import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

// ---------------- Register Company ----------------
export const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }

    // ✅ Handle logo upload (field name must be "logo")
    let logoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      if (fileUri?.content) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        logoUrl = cloudResponse.secure_url;
      }
    }

    const newCompany = await Company.create({
      name,
      description,
      website,
      location,
      logo: logoUrl,
      userId: req.id, // set by authenticateToken middleware
    });

    return res.status(201).json({
      message: "Company registered successfully",
      success: true,
      company: newCompany,
    });
  } catch (error) {
    console.error("Register Company Error:", error.message);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// ---------------- Get All Companies ----------------
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id });

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error("Get All Companies Error:", error.message);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// ---------------- Get Company by ID ----------------
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get Company by ID Error:", error.message);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// ---------------- Update Company ----------------
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const updateData = { name, description, website, location };

    // ✅ Handle logo upload (field name must be "logo")
    if (req.file) {
      const fileUri = getDataUri(req.file);
      if (fileUri?.content) {
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudResponse.secure_url;
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update Company Error:", error.message);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

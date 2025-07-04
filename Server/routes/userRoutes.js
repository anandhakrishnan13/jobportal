import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/:id/company-profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("company companyOverview");
    if (!user || user.role !== "employer") {
      return res.status(404).json({ error: "Employer not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching company profile" });
  }
});

router.put("/:id/company-overview", async (req, res) => {
  try {
    const { companyOverview } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { companyOverview },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Server error in PUT /company-overview:", err);
    res.status(500).json({ error: "Failed to update company overview" });
  }
});

router.get("/company-profile", async (req, res) => {
  try {
    const { name } = req.query;
    const user = await User.findOne({ company: name }).select("company companyOverview");
    if (!user) return res.status(404).json({ error: "Company not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id/profile", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email bio education skills");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.put("/:id/profile", async (req, res) => {
  try {
    const { name, bio, education, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, education, skills },
      { new: true, runValidators: true }
    ).select("name email bio education skills");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;

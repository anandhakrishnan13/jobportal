// controllers/applicationController.js
import Application from "../models/Application.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId, userId, coverLetter } = req.body;

    // ✅ Validate required fields
    if (!jobId || !userId || !coverLetter) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Check if the user already applied for this job
    const existingApp = await Application.findOne({ jobId, userId });
    if (existingApp) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }

    // ✅ Create new application with resume file from req.file
    const application = new Application({
      jobId,
      userId,
      coverLetter,
      appliedDate: new Date(), // or allow client to send it
      resume: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            originalName: req.file.originalname,
          }
        : undefined,
    });
    console.log("📎 Uploaded file info:", req.file);

    await application.save();
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(updatedJob);
  } catch (err) {
    console.error("Update Job Error:", err);
    res.status(500).json({ error: "Failed to update job" });
  }
};


export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete Job Error:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
};

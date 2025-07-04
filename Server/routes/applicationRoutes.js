import express from "express";
import upload from "../middleware/upload.js"; 
import { createApplication, getAllApplications } from "../controllers/applicationController.js";
import Application from "../models/Application.js"; 

const router = express.Router();

router.post("/", upload.single("resume"), createApplication);   
router.get("/", getAllApplications);   

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Status already updated and cannot be changed" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
export default router;

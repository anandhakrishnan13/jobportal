import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected", "accepted"],
      default: "pending",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    coverLetter: {
    type: String,
    required: true
  },
    resume: {
    data: Buffer,
    contentType: String,
    originalName: String,
  },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);

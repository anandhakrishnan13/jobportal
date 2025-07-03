import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const isDarkMode = useStore((state) => state.isDarkMode);

  const [job, setJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError("Failed to load job");
      }
    };
    fetchJob();
  }, [id]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!resumeFile) {
    setError("Please upload your resume.");
    return;
  }

  const formData = new FormData();
  formData.append("jobId", id || "");
  formData.append("userId", currentUser?._id || "");
  formData.append("coverLetter", coverLetter);
  formData.append("resume", resumeFile);

  try {
    const res = await fetch("http://localhost:5000/api/applications", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setSuccess("Application submitted!");
      setTimeout(() => navigate("/jobs"), 1500);
    } else {
      const err = await res.json();
      setError(err.error || "Submission failed");
    }
  } catch (err) {
    setError("Server error");
  }
};

  if (!job) return <div className="p-6">Loading job details...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Apply for: {job.title}</h1>
      <p className="text-gray-500 mb-6">
        {job.company} - {job.location}
      </p>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } p-6 shadow rounded-lg`}
      >
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            required
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setResumeFile(e.target.files[0]);
              }
            }}
            className="w-full p-3 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Cover Letter</label>
          <textarea
            required
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full p-3 border rounded"
            rows={6}
            placeholder="Write your cover letter here..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default ApplyJob;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    category: "",
  });

  const fetchJob = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
      const data = await res.json();
      setJobData({
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        salary: data.salary,
        description: data.description,
        category: data.category,
      });
    } catch (err) {
      console.error("Failed to fetch job details", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: jobData.type,
          salary: jobData.salary,
          description: jobData.description,
        }),
      });

      if (res.ok) {
        navigate("/employer/dashboard");
      } else {
        alert("Failed to update job");
      }
    } catch (err) {
      console.error("Error updating job", err);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-2xl font-bold mb-2">Edit Job</h2>
      <p className="text-sm text-yellow-600 mb-6">
        ✨ <strong>Note:</strong> Only <em>Job Type</em>, <em>Salary</em>, and <em>Description</em> can be updated. 
        All other fields are read-only for security reasons.
      </p>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          name="title"
          value={jobData.title}
          disabled
          className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-500"
        />
        <input
          type="text"
          name="company"
          value={jobData.company}
          disabled
          className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-500"
        />
        <input
          type="text"
          name="location"
          value={jobData.location}
          disabled
          className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-500"
        />
        <input
          type="text"
          name="category"
          value={jobData.category}
          disabled
          className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-500"
        />
        <select
          name="type"
          value={jobData.type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>
        <input
          type="number"
          name="salary"
          value={jobData.salary}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          placeholder="Salary"
        />
        <textarea
          name="description"
          value={jobData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded h-32"
          placeholder="Description"
        ></textarea>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/employer/dashboard")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;

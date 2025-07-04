import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const JobPost: React.FC = () => {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: currentUser?.company || "",
    location: "",
    type: "Full Time",
    description: "",
    salary: "",
    requirements: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://jobportal-480g.onrender.com/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const finalCategory =
      selectedCategory === "Other" ? customCategory.trim() : selectedCategory;

    if (!finalCategory) {
      setError("Please select or enter a category");
      return;
    }

    if (!formData.title || !formData.location || !formData.description || !formData.salary) {
      setError("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://jobportal-480g.onrender.com/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          postedBy: currentUser?._id,
          category: finalCategory,
          requirements: formData.requirements
            .split(",")
            .map((req) => req.trim())
            .filter((req) => req.length > 0),
        }),
      });

      if (res.ok) {
        setSuccess("Job posted successfully!");
        setTimeout(() => navigate("/employer/dashboard"), 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to post job");
      }
    } catch (err) {
      setError("Server error while posting job");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } shadow-md p-6 rounded-lg`}
      >
        <div className="mb-4">
          <label>Job Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label>Company</label>
          <input
            name="company"
            value={formData.company}
            disabled
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="mb-4">
          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label>Job Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </div>

        <div className="mb-4">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        {selectedCategory === "Other" && (
          <div className="mb-4">
            <label>Custom Category</label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter category name"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label>Salary (e.g. 10000-20000)</label>
          <input
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            placeholder="10000-20000"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label>Requirements <span className="text-sm text-gray-500">(Comma-separated)</span></label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="E.g. 2+ years experience, React, Node.js, etc."
            className="w-full p-2 border rounded h-24"
          ></textarea>
        </div>

        <div className="mb-4">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobPost;

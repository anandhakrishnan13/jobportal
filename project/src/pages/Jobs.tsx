import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building2, Clock } from "lucide-react";
import { Job } from "../types";
import { useStore } from "../store";

function Jobs() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const query = new URLSearchParams();
        if (searchTerm) query.append("search", searchTerm);
        if (selectedCategory) query.append("category", selectedCategory);

        const res = await fetch(
          `https://jobportal-480g.onrender.com/api/jobs?${query.toString()}`
        );
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, [searchTerm, selectedCategory]);

  const categories = [...new Set(jobs.map((job) => job.category || "Uncategorized"))];

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Next Opportunity</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div
              className={`flex items-center ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-2 shadow-md`}
            >
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } shadow-md`}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs found.</p>
        ) : (
          jobs.map((job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className={`${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50"
              } p-6 rounded-lg shadow-md transition`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Building2 className="w-4 h-4 mr-1" />
                    <span className="mr-4">{job.company}</span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {job.type}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      {job.category || "Other"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-500 mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;

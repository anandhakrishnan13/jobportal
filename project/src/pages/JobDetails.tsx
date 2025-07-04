import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";
import { MapPin, Building2, Clock, Send } from "lucide-react";
import { useStore } from "../store";
import { Job } from "../types";

function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const [companyOverview, setCompanyOverview] = useState<string>("");

  useEffect(() => {
    const fetchJobAndApplication = async () => {
      try {
        setLoading(true);

        const res = await fetch(`https://jobportal-480g.onrender.com/api/jobs/${id}`);
        if (!res.ok) throw new Error("Job not found");
        const jobData = await res.json();
        setJob(jobData);
        const companyRes = await fetch(
          `https://jobportal-480g.onrender.com/api/users/company-profile?name=${encodeURIComponent(
            jobData.company
          )}`
        );
        if (companyRes.ok) {
          const companyData = await companyRes.json();
          setCompanyOverview(companyData.companyOverview || "");
        }

        if (currentUser?.role === "jobseeker") {
          const token = localStorage.getItem("token");
          const appRes = await fetch("https://jobportal-480g.onrender.com/api/applications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const apps = await appRes.json();

          const alreadyApplied = apps.some(
            (app: any) =>
              (app.jobId._id || app.jobId) === id &&
              (app.userId._id || app.userId) === currentUser._id
          );

          setHasApplied(alreadyApplied);
        }
      } catch (err) {
        console.error("Failed to load job or application info", err);
        setError("Job not found or server error");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplication();
  }, [id, currentUser]);

  if (loading) return <div>Loading job details...</div>;
  if (error || !job) return <div>{error || "Job not found"}</div>;

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md p-8 mb-8`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {job.type}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {job.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {job.salary}
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              <span>
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {currentUser?.role === "jobseeker" && !hasApplied && (
          <Link to={`/jobs/${job._id}/apply`}>
            <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
              <Send className="w-5 h-5 mr-2" />
              Apply Now
            </button>
          </Link>
        )}

        {currentUser?.role === "jobseeker" && hasApplied && (
          <p className="text-green-600 font-semibold mb-4">
            You have already applied for this job.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-8 mb-8`}
          >
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="mb-6 whitespace-pre-line">{job.description}</p>

            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              {job.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-8`}
          >
            <h2 className="text-xl font-bold mb-4">Company Overview</h2>
            <div className="flex items-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
                {companyOverview && (
                  <div className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {companyOverview}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;

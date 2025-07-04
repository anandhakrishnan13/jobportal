import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import { Application, Job, User } from "../types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function EmployerDashboard() {
  const isDarkMode = useStore(state => state.isDarkMode);
  const currentUser = useStore(state => state.currentUser);
  const setCurrentUser = useStore(state => state.setCurrentUser);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchJobsAndApplications = async () => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser) {
      setErrorMessage("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const [jobRes, appRes] = await Promise.all([
        fetch("https://jobportal-480g.onrender.com/api/jobs", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("https://jobportal-480g.onrender.com/api/applications", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (!jobRes.ok || !appRes.ok) {
        setErrorMessage("Failed to fetch data across APIs");
        setLoading(false);
        return;
      }

      const jobData: Job[] = await jobRes.json();
      const applicationData: Application[] = await appRes.json();

      const employerJobs = jobData.filter(job => job.company === currentUser.company);
      setJobs(employerJobs);

      const employerApplications = applicationData.filter(app =>
        employerJobs.some(job => job._id === (typeof app.jobId === "string" ? app.jobId : app.jobId._id))
      );
      setApplications(employerApplications);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApplications();
  }, [currentUser]);

  const categoryData = Object.entries(jobs.reduce((acc: Record<string, number>, job) => {
    acc[job.category] = (acc[job.category] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString("default", { month: "short" });
    return { month, jobs: jobs.filter(job => new Date(job.createdAt).getMonth() === i).length };
  });

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePostJob = () => navigate("/employer/post-job");

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (errorMessage) return <div className="p-6 text-red-600">{errorMessage}</div>;

  const updateStatus = async (status: "accepted" | "rejected") => {
  if (!selectedApplication) return;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `https://jobportal-480g.onrender.com/api/applications/${selectedApplication._id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) throw new Error("Status update failed");

    const updated = await res.json();

    await fetchJobsAndApplications(); // refresh application list
    setSelectedApplication({
      ...selectedApplication,
      status: updated.status,
    });
  } catch (err) {
    console.error("Failed to update application status:", err);
    alert("Error updating status.");
  }
};

  return (
    <div className={isDarkMode ? "text-white" : "text-gray-900"}>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
        </div>
        <div>
          <button
            onClick={() => navigate("/employer/company-profile")}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition"
            title="Go to User Profile"
          >
            {/* Initial or Icon */}
            {currentUser?.name?.charAt(0).toUpperCase() || "C"}
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Active Jobs" count={jobs.length} color="text-blue-600" />
        <SummaryCard title="Total Applications" count={applications.length} color="text-green-600" />
        <SummaryCard title="Pending Review" count={applications.filter(a => a.status === "pending").length} color="text-yellow-600" />
        <SummaryCard title="Hired" count={applications.filter(a => a.status === "accepted").length} color="text-purple-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Monthly Job Postings">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jobs" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Jobs by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

            <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Applicant</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => {
                const job = jobs.find((j) => j._id === app.jobId);
                return (
                  <tr
                    key={app._id}
                    className={`${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{job?.title || "Unknown Job"}</td>
                    <td className="px-6 py-4">
                      {typeof app.userId === "string"
                        ? "N/A"
                        : (app.userId as User).name}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          app.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Application Details</h2>
                <p>
                  <strong>Job:</strong>{" "}
                  {jobs.find((j) => j._id === selectedApplication.jobId)?.title}
                </p>
                <p>
                  <strong>Applicant:</strong>{" "}
                  {(selectedApplication.userId as any)?.name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {(selectedApplication.userId as any)?.email || "N/A"}
                </p>
                <p className="mt-4">
                  <strong>Cover Letter:</strong>
                </p>
                <p className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap dark:bg-gray-700">
                  {selectedApplication.coverLetter}
                </p>

                {selectedApplication.resume?.data &&
                  (() => {
                    const base64 = btoa(
                      String.fromCharCode(
                        ...new Uint8Array(selectedApplication.resume.data)
                      )
                    );
                    const fileUrl = `data:${selectedApplication.resume.contentType};base64,${base64}`;
                    return (
                      <a
                        href={fileUrl}
                        download={selectedApplication.resume.originalName}
                        className="block mt-4 text-blue-600 hover:underline"
                      >
                        Download Resume
                      </a>
                    );
                  })()}

                <div className="mt-6 flex justify-between flex-wrap gap-3">
                  {selectedApplication.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus("accepted")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus("rejected")}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Posted Jobs Table */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md mt-10`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Posted Jobs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Posted On</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className={`${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">{job.title}</td>
                  <td className="px-6 py-4">{job.category}</td>
                  <td className="px-6 py-4">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this job?"
                          )
                        ) {
                          try {
                            const token = localStorage.getItem("token");

                            const res = await fetch(
                              `https://jobportal-480g.onrender.com/api/jobs/${job._id}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`, 
                                },
                              }
                            );

                            if (res.ok) {
                              setJobs((prev) =>
                                prev.filter((j) => j._id !== job._id)
                              );
                            } else {
                              const data = await res.json();
                              alert(data.error || "Failed to delete job");
                            }
                          } catch (err) {
                            console.error("Failed to delete job", err);
                            alert("Server error while deleting job");
                          }
                        }
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className="flex gap-4 mt-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handlePostJob}>Post Job</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

const SummaryCard = ({ title, count, color }: { title: string, count: number, color: string }) => (
  <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-800">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{count}</p>
  </div>
);

const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="p-6 rounded-lg shadow bg-white dark:bg-gray-800">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    {children}
  </div>
);

export default EmployerDashboard;

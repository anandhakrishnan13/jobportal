import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import { Application, Job, User } from "../types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function EmployerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [overviewText, setOverviewText] = useState(currentUser?.companyOverview || "");

  const fetchJobsAndApplications = async () => {
    const token = localStorage.getItem("token");

    try {
      const [jobRes, appRes] = await Promise.all([
        fetch("https://jobportal-l1t5.onrender.com/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("https://jobportal-l1t5.onrender.com/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const jobData = await jobRes.json();
      const appData = await appRes.json();

      const employerJobs = jobData.filter(
        (job: Job) => job.company === currentUser?.company
      );
      setJobs(employerJobs);

      const employerApplications = appData.filter((app: Application) =>
        employerJobs.some((job: Job) => job._id === app.jobId)
      );
      setApplications(employerApplications);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchJobsAndApplications();
  }, [currentUser]);

  const categoryData = Object.entries(
    jobs.reduce((acc: any, job) => {
      acc[job.category] = (acc[job.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString("default", { month: "short" });
    const jobsInMonth = jobs.filter((job) => {
      const createdAt = new Date(job.createdAt);
      return createdAt.getMonth() === i;
    }).length;
    return { month, jobs: jobsInMonth };
  });

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  const handleJobPost = () => {
    navigate("/employer/post-job");
  };

  const updateStatus = async (status: "accepted" | "rejected") => {
    if (!selectedApplication) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://jobportal-l1t5.onrender.com/api/applications/${selectedApplication._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const updated = await res.json();

      await fetchJobsAndApplications();
      setSelectedApplication({
        ...selectedApplication,
        status: updated.status,
      });
    } catch (err) {
      console.error(`Failed to update status: ${err}`);
    }
  };

  const handleOverviewSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://jobportal-l1t5.onrender.com/api/users/${currentUser?._id}/company-overview`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ companyOverview: overviewText }),
        }
      );
      if (res.ok) {
        setCurrentUser({ ...currentUser, companyOverview: overviewText }as User);
        alert("Company overview updated successfully.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update overview.");
      }
    } catch (err) {
      alert("Server error while updating overview.");
      console.error(err);
    }
  };

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      {/* ✅ Company Overview Section */}
      <div className={`mb-8 ${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md`}>
        <h2 className="text-xl font-bold mb-4">Company Overview</h2>
        <textarea
          value={overviewText}
          onChange={(e) => setOverviewText(e.target.value)}
          rows={4}
          className="w-full p-3 rounded border bg-white dark:bg-gray-700 dark:text-white"
          placeholder="Write a brief overview of your company"
        ></textarea>
        <button
          onClick={handleOverviewSave}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Overview
        </button>
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Active Jobs" count={jobs.length} color="text-blue-600" />
        <SummaryCard title="Total Applications" count={applications.length} color="text-green-600" />
        <SummaryCard
          title="Pending Review"
          count={applications.filter((a) => a.status === "pending").length}
          color="text-yellow-600"
        />
        <SummaryCard
          title="Hired"
          count={applications.filter((a) => a.status === "accepted").length}
          color="text-purple-600"
        />
      </div>

      {/* ✅ Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Monthly Job Postings">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Jobs by Category">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ✅ Applications Table */}
      {/* ... keep your existing Applications table and modal code here as-is ... */}

      {/* ✅ Posted Jobs Table */}
      {/* ... keep your existing Posted Jobs table code here as-is ... */}

      <div className="mt-6 flex gap-4">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
        <button onClick={handleJobPost} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Post Job
        </button>
      </div>
    </div>
  );
}

const SummaryCard = ({ title, count, color }: { title: string; count: number; color: string }) => (
  <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{count}</p>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 h-96">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

export default EmployerDashboard;

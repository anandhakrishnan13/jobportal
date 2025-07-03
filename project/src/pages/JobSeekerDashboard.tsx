import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Application, Job, StatCardProps } from "../types";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";

function JobSeekerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationData, setApplicationData] = useState<
    { week: string; applications: number }[]
  >([]);

  useEffect(() => {
    const fetchApplicationsAndJobs = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([
          fetch("https://jobportal-l1t5.onrender.com/api/applications"),
          fetch("https://jobportal-l1t5.onrender.com/api/jobs"),
        ]);
        const apps = await appRes.json();
        const jobs = await jobRes.json();
        setApplications(apps);
        setJobs(jobs);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchApplicationsAndJobs();
  }, []);

  const userApplications = useMemo(() => {
    return applications.filter((app) => {
      const userId =
        typeof app.userId === "string" ? app.userId : app.userId?._id;
      return userId === currentUser?._id;
    });
  }, [applications, currentUser?._id]);

  useEffect(() => {
    if (!currentUser || !currentUser.createdAt) return;

    const userCreatedAt = new Date(currentUser.createdAt);
    const weekMap: Record<string, number> = {};

    userApplications.forEach((app) => {
      const appliedAt = new Date(app.appliedDate);
      const diffDays = Math.floor(
        (appliedAt.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekNumber = Math.floor(diffDays / 7) + 1;
      const weekLabel = `Week ${weekNumber < 1 ? 1 : weekNumber}`;
      weekMap[weekLabel] = (weekMap[weekLabel] || 0) + 1;
    });

    if (Object.keys(weekMap).length === 0) {
      weekMap["Week 1"] = 0;
    }

    const chartData = Object.entries(weekMap)
      .sort(([a], [b]) => {
        const numA = parseInt(a.split(" ")[1]);
        const numB = parseInt(b.split(" ")[1]);
        return numA - numB;
      })
      .map(([week, count]) => ({
        week,
        applications: count,
      }));

    setApplicationData(chartData);
  }, [userApplications, currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Job Seeker Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Applications"
          value={userApplications.length}
          color="blue"
          isDarkMode={isDarkMode}
        />
        <StatCard
          label="Under Review"
          value={
            userApplications.filter((app) => app.status === "pending").length
          }
          color="yellow"
          isDarkMode={isDarkMode}
        />
        <StatCard
          label="Accepted"
          value={
            userApplications.filter((app) => app.status === "accepted").length
          }
          color="green"
          isDarkMode={isDarkMode}
        />
        <StatCard
          label="Rejected"
          value={
            userApplications.filter((app) => app.status === "rejected").length
          }
          color="red"
          isDarkMode={isDarkMode}
        />
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md mb-8`}
      >
        <h2 className="text-xl font-bold mb-4">Application Activity</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Application History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Applied Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((app) => {
                const jobId =
                  typeof app.jobId === "string"
                    ? app.jobId
                    : app.jobId?._id;
                const job = jobs.find((j) => j._id === jobId);

                return (
                  <tr
                    key={app._id}
                    className={`${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{job?.title || "N/A"}</td>
                    <td className="px-6 py-4">{job?.company || "N/A"}</td>
                    <td className="px-6 py-4">
                      {new Date(app.appliedDate).toLocaleDateString()}
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
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, isDarkMode }: StatCardProps) {
  const textColor =
    color === "blue"
      ? "text-blue-600"
      : color === "yellow"
      ? "text-yellow-600"
      : color === "green"
      ? "text-green-600"
      : "text-red-600";

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md`}
    >
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

export default JobSeekerDashboard;

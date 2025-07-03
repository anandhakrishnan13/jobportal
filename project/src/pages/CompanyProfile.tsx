import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import { User } from "../types";

const CompanyProfile = () => {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [overview, setOverview] = useState(currentUser?.companyOverview || "");
  const [website, setWebsite] = useState(currentUser?.companyWebsite || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser) return;

    setLoading(true);
    try {
      const res = await fetch(`https://jobportal-480g.onrender.com/api/users/${currentUser._id}/company-overview`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyOverview: overview, companyWebsite: website }),
      });

      if (res.ok) {
        const updated = await res.json();
        setCurrentUser({ ...currentUser, companyOverview: updated.companyOverview, companyWebsite: updated.companyWebsite } as User);
        alert("Profile updated successfully");
        navigate("/employer/dashboard");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while updating company profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Company Profile</h1>

      <label className="block mb-2 font-medium">Company Name</label>
      <input
        type="text"
        value={currentUser?.company}
        disabled
        className="w-full p-2 border rounded mb-4 bg-gray-100 dark:bg-gray-700 text-gray-500"
      />

      <label className="block mb-2 font-medium">Company Website</label>
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="https://yourcompany.com"
      />

      <label className="block mb-2 font-medium">Company Overview</label>
      <textarea
        rows={6}
        value={overview}
        onChange={(e) => setOverview(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Describe your company's mission, culture, or product..."
      />

      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CompanyProfile;

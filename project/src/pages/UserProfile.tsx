import { useEffect, useState } from "react";
import { useStore } from "../store";

function UserProfile() {
  const currentUser = useStore((state) => state.currentUser);
  const isDarkMode = useStore((state) => state.isDarkMode);

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    bio: string;
    education: string;
    skills: string[];
  }>({
    name: "",
    email: "",
    bio: "",
    education: "",
    skills: [],
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(`https://jobportal-480g.onrender.com/api/users/${currentUser._id}/profile`);
      if (!res.ok) throw new Error("Failed to fetch user profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(`https://jobportal-480g.onrender.com/api/users/${currentUser._id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setProfile(data);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to save profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (!currentUser) return <div>Please log in to view your profile.</div>;

  return (
    <div className={`p-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div className="grid gap-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            disabled={!editing}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-2 rounded border border-gray-300"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            disabled
            value={profile.email}
            className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Bio</label>
          <textarea
            disabled={!editing}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2 rounded border border-gray-300"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Education</label>
          <input
            disabled={!editing}
            value={profile.education}
            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            className="w-full px-4 py-2 rounded border border-gray-300"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Skills (comma-separated)</label>
          <input
            disabled={!editing}
            value={profile.skills.join(", ")}
            onChange={(e) =>
              setProfile({ ...profile, skills: e.target.value.split(",").map((s) => s.trim()) })
            }
            className="w-full px-4 py-2 rounded border border-gray-300"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

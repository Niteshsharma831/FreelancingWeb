import React, { useState, useEffect } from "react";
import axios from "../services/axiosservice";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFormat, setResumeFormat] = useState("");

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.charAt(0).toUpperCase() || "";
    const last = parts[1]?.charAt(0).toUpperCase() || "";
    return first + last;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Redirecting to login...");
        setTimeout(() => (window.location.href = "/login"), 1000);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        const errMsg =
          err.response?.status === 401
            ? "Session expired. Redirecting to login..."
            : err.response?.data?.error || "Failed to fetch profile.";
        setError(errMsg);
        localStorage.removeItem("token");
        setTimeout(() => (window.location.href = "/login"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const openModal = () => {
    if (!user) return;
    setPhone(user.profile?.phone || "");
    setAddress(user.profile?.address || "");
    setProfilePic(user.profile?.profilePic || "");
    setSkills((user.profile?.skills || []).join(", "));
    setResumeUrl(user.profile?.resume?.url || "");
    setResumeFormat(user.profile?.resume?.format || "");
    setShowModal(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!user || !user.email) {
      alert("You must be logged in to update your profile.");
      return;
    }

    try {
      const updatedProfile = {
        email: user.email,
        profile: {
          phone,
          address,
          profilePic,
          skills: skills.split(",").map((s) => s.trim()),
          resume: {
            url: resumeUrl,
            format: resumeFormat,
          },
        },
      };

      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200">
        <p className="text-gray-700 text-lg font-medium animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 p-6 transition-all duration-300">
        {/* Sidebar */}
        <div className="flex flex-col items-center text-center space-y-4 bg-blue-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
          {user.profile?.profilePic ? (
            <img
              src={user.profile.profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md transition hover:scale-105"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
              {getInitials(user.name)}
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">User ID: {user._id}</p>
          <div className="flex flex-col gap-2 w-full pt-4">
            <button
              onClick={openModal}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaUserEdit /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Profile Info Cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Card */}
          <div className="bg-white border p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Contact Info
            </h3>
            <div className="flex items-center gap-3 text-gray-600 mb-3">
              <FaPhone className="text-blue-600" />{" "}
              {user.profile?.phone || "N/A"}
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FaMapMarkerAlt className="text-blue-600" />{" "}
              {user.profile?.address || "N/A"}
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white border p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Skills
            </h3>
            {user.profile?.skills?.length ? (
              <div className="flex flex-wrap gap-3">
                {user.profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">N/A</p>
            )}
          </div>

          {/* Resume Card */}
          <div className="bg-white border p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Resume
            </h3>
            {user.profile?.resume?.url ? (
              <a
                href={user.profile.resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2 font-medium"
              >
                <FaFileAlt /> View Resume ({user.profile.resume.format})
              </a>
            ) : (
              <p className="text-gray-600">N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-xl shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">
              Update Profile
            </h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Profile Pic URL"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Resume URL"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Resume Format (pdf, docx, etc.)"
                value={resumeFormat}
                onChange={(e) => setResumeFormat(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              />
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

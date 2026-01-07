import React, { useState, useEffect, useRef } from "react";
import api from "../services/axiosservice"; // Your axios instance
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaStar,
  FaCheckCircle,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaFilePdf,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaCalendarAlt,
  FaDollarSign,
  FaCog,
  FaLock,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaExternalLinkAlt,
  FaShareAlt,
  FaCopy,
  FaMedal,
  FaCertificate,
  FaLanguage,
  FaUsers,
  FaProjectDiagram,
  FaChartLine,
  FaBell,
  FaShieldAlt,
  FaSignOutAlt,
  FaPlus,
  FaChevronRight,
  FaRegComment,
  FaRegThumbsUp,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
    skills: "",
    experience: "beginner",
    hourlyRate: "",
    education: "",
    languages: "",
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
    portfolioUrl: "",
  });

  // UI states
  const [activeTab, setActiveTab] = useState("overview");
  const [uploading, setUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  // File upload refs
  const profilePicRef = useRef(null);
  const resumeRef = useRef(null);

  // Sample projects/portfolio
  const [projects] = useState([
    {
      id: 1,
      title: "E-commerce Website",
      description: "Full-stack e-commerce platform with React & Node.js",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://example.com",
      featured: true,
    },
    {
      id: 2,
      title: "Mobile Banking App",
      description: "Cross-platform banking application with React Native",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      tags: ["React Native", "Firebase", "UI/UX"],
      link: "https://example.com",
    },
  ]);

  // Sample reviews
  const [reviews] = useState([
    {
      id: 1,
      client: "John Smith",
      rating: 5,
      comment:
        "Excellent work! Delivered ahead of schedule with great quality.",
      date: "2024-01-15",
      project: "Website Redesign",
    },
    {
      id: 2,
      client: "Sarah Johnson",
      rating: 4.5,
      comment: "Very professional and communicative. Will work again!",
      date: "2024-01-10",
      project: "Mobile App Development",
    },
  ]);

  // Stats
  const [stats] = useState({
    completedProjects: 12,
    totalEarnings: 24500,
    avgRating: 4.8,
    responseRate: 98,
    onTimeDelivery: 95,
    repeatClients: 8,
  });

  // Fetch user profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    console.log("🔍 Fetching profile with token:", token ? "Yes" : "No");
    if (!token) {
      setError("No authentication token found. Please login.");
      setLoading(false);
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    try {
      console.log("📡 Calling: /users/profile");

      // Make direct fetch call to debug
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Backend data:", data);

      // Handle the direct response from your backend
      const userData = data;

      // Set user state with backend data
      setUser({
        ...userData,
        profile: userData.profile || {
          skills: [],
          bio: "",
          phone: "",
          address: "",
          verified: false,
        },
      });

      // Initialize edit form
      setEditForm({
        name: userData.name || "",
        phone: userData.profile?.phone || "",
        address: userData.profile?.address || "",
        bio: userData.profile?.bio || "",
        skills: (userData.profile?.skills || []).join(", "),
        experience: userData.profile?.experience || "beginner",
        hourlyRate: userData.profile?.hourlyRate || "",
        education: userData.profile?.education || "",
        languages: (userData.profile?.languages || []).join(", "),
        website: userData.profile?.website || "",
        linkedin: userData.profile?.social?.linkedin || "",
        github: userData.profile?.social?.github || "",
        twitter: userData.profile?.social?.twitter || "",
        portfolioUrl: userData.profile?.portfolio?.url || "",
      });

      setError("");
    } catch (err) {
      console.error("❌ Profile fetch error details:", err);
      console.error("❌ Error response:", err.response);

      setError(`Failed to load profile: ${err.message}`);
      toast.error(`Failed to load profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast.error("Please login first");
      return;
    }

    try {
      setUploading(true);

      const updatedProfile = {
        name: editForm.name,
        profile: {
          phone: editForm.phone,
          address: editForm.address,
          bio: editForm.bio,
          skills: editForm.skills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
          experience: editForm.experience,
          hourlyRate: parseFloat(editForm.hourlyRate) || 0,
          education: editForm.education,
          languages: editForm.languages
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l),
          website: editForm.website,
          social: {
            linkedin: editForm.linkedin,
            github: editForm.github,
            twitter: editForm.twitter,
          },
          portfolio: {
            url: editForm.portfolioUrl,
          },
          // Preserve existing data
          profilePic: user.profile?.profilePic || "",
          resume: user.profile?.resume || null,
          verified: user.profile?.verified || false,
        },
      };

      const res = await api.put("/users/update", updatedProfile);

      if (res.data.success) {
        // Update local user state
        const updatedUser = {
          ...user,
          name: editForm.name,
          profile: {
            ...user.profile,
            ...updatedProfile.profile,
          },
        };

        setUser(updatedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully!");

        // Refresh profile data
        fetchProfile();
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  // Handle profile picture upload
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await api.put("/users/update-profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const updatedUser = { ...user };
        if (!updatedUser.profile) updatedUser.profile = {};
        updatedUser.profile.profilePic = res.data.data.profilePic;
        setUser(updatedUser);

        toast.success("Profile picture updated!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF or DOC/DOCX files only");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.put("/users/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const updatedUser = { ...user };
        if (!updatedUser.profile) updatedUser.profile = {};
        updatedUser.profile.resume = res.data.data.resume;
        setUser(updatedUser);

        toast.success("Resume uploaded successfully!");
        setShowResumeModal(false);
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      toast.error(err.response?.data?.error || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setUploading(true);

      const passwordUpdate = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      const res = await api.put("/users/change-password", passwordUpdate);

      if (res.data.success) {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          showCurrentPassword: false,
          showNewPassword: false,
          showConfirmPassword: false,
        });
      }
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setUploading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  // Share profile
  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${
      user?._id || user?.id
    }`;
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => {
        toast.success("Profile link copied to clipboard!");
        setShowShareModal(false);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;

    const requiredFields = [
      user?.name,
      user?.email,
      user?.profile?.bio,
      user?.profile?.skills?.length > 0,
      user?.profile?.phone,
      user?.profile?.profilePic,
      user?.profile?.resume,
    ];

    const completedFields = requiredFields.filter(Boolean).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            Loading your profile...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Getting everything ready for you
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {user?.name}
                </h1>
                <p className="text-sm text-gray-500">Profile Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                title="Share Profile"
              >
                <FaShareAlt className="text-lg" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              {/* Profile Picture */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                  {user?.profile?.profilePic ? (
                    <img
                      src={user.profile.profilePic}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {getInitials(user?.name)}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => profilePicRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-2 right-1/2 translate-x-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition hover:scale-105"
                >
                  <FaUpload className="text-blue-600" />
                  <input
                    ref={profilePicRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                  />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {user?.name}
                </h2>
                <p className="text-gray-600 mb-3">{user?.email}</p>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-medium">
                  {user?.profile?.verified ? (
                    <>
                      <FaCheckCircle /> Verified Professional
                    </>
                  ) : (
                    <>
                      <FaStar /> Profile under Review
                    </>
                  )}
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Profile Completion
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {calculateProfileCompletion()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProfileCompletion()}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FaBriefcase />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Projects</p>
                      <p className="text-lg font-bold">
                        {stats.completedProjects}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Earnings</p>
                    <p className="text-lg font-bold">
                      ${stats.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <FaStar />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center gap-1">
                        {renderStars(stats.avgRating)}
                        <span className="font-bold ml-1">
                          {stats.avgRating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">On Time</p>
                    <p className="text-lg font-bold">{stats.onTimeDelivery}%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                    isEditing
                      ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                  }`}
                >
                  <span className="font-medium flex items-center gap-2">
                    {isEditing ? <FaTimes /> : <FaEdit />}
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                  </span>
                  <FaChevronRight />
                </button>

                <button
                  onClick={() => setShowResumeModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition"
                >
                  <span className="font-medium flex items-center gap-2">
                    <FaFilePdf />{" "}
                    {user?.profile?.resume ? "Update Resume" : "Upload Resume"}
                  </span>
                  <FaChevronRight />
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                >
                  <span className="font-medium flex items-center gap-2">
                    <FaLock /> Change Password
                  </span>
                  <FaChevronRight />
                </button>

                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
                >
                  <span className="font-medium flex items-center gap-2">
                    <FaChartLine /> Go to Dashboard
                  </span>
                  <FaChevronRight />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200"
            >
              <div className="flex flex-wrap border-b">
                {[
                  { id: "overview", label: "Overview", icon: <FaUser /> },
                  {
                    id: "portfolio",
                    label: "Portfolio",
                    icon: <FaBriefcase />,
                  },
                  { id: "skills", label: "Skills", icon: <FaStar /> },
                  { id: "reviews", label: "Reviews", icon: <FaRegThumbsUp /> },
                  {
                    id: "education",
                    label: "Education",
                    icon: <FaGraduationCap />,
                  },
                  { id: "settings", label: "Settings", icon: <FaCog /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm md:text-base transition ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              >
                {isEditing ? (
                  /* Edit Mode */
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-gray-800">
                        Edit Profile
                      </h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={uploading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          {uploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Personal Information
                          </h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <textarea
                              value={editForm.address}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  address: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              rows="3"
                              placeholder="Enter your complete address"
                            />
                          </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Professional Information
                          </h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bio / About Me
                            </label>
                            <textarea
                              value={editForm.bio}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  bio: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              rows="4"
                              placeholder="Tell us about yourself, your experience, and what you do..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience Level
                              </label>
                              <select
                                value={editForm.experience}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    experience: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              >
                                <option value="beginner">
                                  Beginner (0-2 years)
                                </option>
                                <option value="intermediate">
                                  Intermediate (2-5 years)
                                </option>
                                <option value="advanced">
                                  Advanced (5-10 years)
                                </option>
                                <option value="expert">
                                  Expert (10+ years)
                                </option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hourly Rate ($)
                              </label>
                              <input
                                type="number"
                                value={editForm.hourlyRate}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    hourlyRate: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Skills (comma separated)
                            </label>
                            <input
                              type="text"
                              value={editForm.skills}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  skills: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              placeholder="React, Node.js, MongoDB, UI/UX Design, Project Management"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Languages (comma separated)
                            </label>
                            <input
                              type="text"
                              value={editForm.languages}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  languages: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                              placeholder="English, Spanish, French, German"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social Links & Website */}
                      <div className="pt-6 border-t">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Social Links & Portfolio
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Personal Website
                              </label>
                              <input
                                type="url"
                                value={editForm.website}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    website: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="https://yourwebsite.com"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Portfolio URL
                              </label>
                              <input
                                type="url"
                                value={editForm.portfolioUrl}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    portfolioUrl: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="https://portfolio.com/your-work"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                LinkedIn Profile
                              </label>
                              <input
                                type="url"
                                value={editForm.linkedin}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    linkedin: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="https://linkedin.com/in/username"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                GitHub Profile
                              </label>
                              <input
                                type="url"
                                value={editForm.github}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    github: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="https://github.com/username"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Education */}
                      <div className="pt-6 border-t">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Education & Certifications
                        </h4>
                        <textarea
                          value={editForm.education}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              education: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          rows="4"
                          placeholder="Add your education background, degrees, certifications, and training..."
                        />
                      </div>
                    </form>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    {activeTab === "overview" && (
                      <div className="space-y-8">
                        {/* Bio Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                About {user?.name?.split(" ")[0]}
                              </h3>
                              {user?.profile?.bio ? (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                  {user.profile.bio}
                                </p>
                              ) : (
                                <div className="text-center py-8">
                                  <FaUser className="text-4xl text-gray-300 mx-auto mb-3" />
                                  <p className="text-gray-500 mb-4">
                                    Add a bio to tell people about yourself
                                  </p>
                                  <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                  >
                                    Add Bio
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {user?.profile?.experience?.toUpperCase() ||
                                  "BEGINNER"}
                              </span>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                ${user?.profile?.hourlyRate || 0}/hr
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Contact & Social */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Contact Information */}
                          <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <FaEnvelope />
                              </div>
                              Contact Information
                            </h4>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <FaEnvelope className="text-gray-400 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium">{user?.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaPhone className="text-gray-400 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium">
                                    {user?.profile?.phone || "Not provided"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Location
                                  </p>
                                  <p className="font-medium">
                                    {user?.profile?.address || "Not provided"}
                                  </p>
                                </div>
                              </div>
                              {user?.profile?.website && (
                                <div className="flex items-center gap-3">
                                  <FaGlobe className="text-gray-400 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Website
                                    </p>
                                    <a
                                      href={user.profile.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                      {user.profile.website}
                                      <FaExternalLinkAlt className="text-xs" />
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Social Links */}
                          <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <FaUsers />
                              </div>
                              Social Profiles
                            </h4>
                            <div className="space-y-4">
                              {[
                                {
                                  icon: (
                                    <FaLinkedin className="text-blue-600" />
                                  ),
                                  label: "LinkedIn",
                                  url: user?.profile?.social?.linkedin,
                                },
                                {
                                  icon: <FaGithub className="text-gray-800" />,
                                  label: "GitHub",
                                  url: user?.profile?.social?.github,
                                },
                                {
                                  icon: <FaTwitter className="text-sky-500" />,
                                  label: "Twitter",
                                  url: user?.profile?.social?.twitter,
                                },
                              ].map(
                                (social, index) =>
                                  social.url && (
                                    <a
                                      key={index}
                                      href={social.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                                    >
                                      <div className="flex items-center gap-3">
                                        {social.icon}
                                        <span className="font-medium">
                                          {social.label}
                                        </span>
                                      </div>
                                      <FaExternalLinkAlt className="text-gray-400 group-hover:text-blue-600 transition" />
                                    </a>
                                  )
                              )}

                              {!user?.profile?.social?.linkedin &&
                                !user?.profile?.social?.github &&
                                !user?.profile?.social?.twitter && (
                                  <div className="text-center py-6">
                                    <p className="text-gray-500 mb-3">
                                      No social profiles added
                                    </p>
                                    <button
                                      onClick={() => setIsEditing(true)}
                                      className="px-4 py-2 text-blue-600 hover:text-blue-700"
                                    >
                                      Add Social Links
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Resume Section */}
                        {user?.profile?.resume && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                  <FaFilePdf className="text-2xl" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-gray-800 mb-1">
                                    Resume
                                  </h4>
                                  <p className="text-gray-600">
                                    Your resume is ready to be shared with
                                    clients
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    window.open(
                                      user.profile.resume.url,
                                      "_blank"
                                    )
                                  }
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                >
                                  <FaEye /> View Resume
                                </button>
                                <button
                                  onClick={() => setShowResumeModal(true)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "skills" && (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-800">
                            Skills & Expertise
                          </h3>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Edit Skills
                          </button>
                        </div>

                        {user?.profile?.skills?.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {user.profile.skills.map((skill, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white border rounded-xl p-4 text-center hover:shadow-lg transition shadow-sm group"
                              >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                                  <FaStar className="text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800">
                                  {skill}
                                </h4>
                                <div className="mt-2 flex justify-center">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className="text-yellow-400 text-sm"
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                              <FaStar className="text-3xl text-gray-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-700 mb-3">
                              No Skills Added Yet
                            </h4>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                              Add your skills to help clients find you and match
                              you with relevant projects.
                            </p>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition font-medium"
                            >
                              Add Your Skills
                            </button>
                          </div>
                        )}

                        {/* Languages */}
                        {user?.profile?.languages?.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mt-8">
                            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                              <FaLanguage className="text-blue-600 text-2xl" />
                              Languages
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {user.profile.languages.map((language, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-full font-medium shadow-sm"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "portfolio" && (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                              Portfolio
                            </h3>
                            <p className="text-gray-600">
                              Showcase your best work to attract clients
                            </p>
                          </div>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                          >
                            <FaPlus /> Add Project
                          </button>
                        </div>

                        {projects.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                              <div
                                key={project.id}
                                className="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition shadow-lg group"
                              >
                                <div className="relative overflow-hidden">
                                  <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                  />
                                  {project.featured && (
                                    <span className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <div className="p-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-bold text-lg text-gray-800">
                                      {project.title}
                                    </h4>
                                    <button className="text-gray-400 hover:text-blue-600">
                                      <FaRegThumbsUp />
                                    </button>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-4">
                                    {project.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <a
                                      href={project.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                    >
                                      View Project
                                      <FaExternalLinkAlt className="text-xs" />
                                    </a>
                                    <button className="text-gray-400 hover:text-blue-600">
                                      <FaRegComment />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                              <FaBriefcase className="text-3xl text-gray-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-700 mb-3">
                              No Projects Yet
                            </h4>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                              Showcase your work to attract more clients. Add
                              your best projects to build credibility.
                            </p>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition font-medium"
                            >
                              Add Your First Project
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                              Client Reviews
                            </h3>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2">
                                {renderStars(stats.avgRating)}
                                <span className="font-bold text-gray-800">
                                  {stats.avgRating}
                                </span>
                              </div>
                              <span className="text-gray-600">
                                ({reviews.length} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Response Rate
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {stats.responseRate}%
                            </p>
                          </div>
                        </div>

                        {reviews.length > 0 ? (
                          <div className="space-y-6">
                            {reviews.map((review) => (
                              <div
                                key={review.id}
                                className="bg-gray-50 rounded-2xl p-6"
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                      <span className="text-white font-bold">
                                        {review.client.charAt(0)}
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-800">
                                        {review.client}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        {review.project}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                      {renderStars(review.rating)}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                      {review.date}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-gray-700">
                                  {review.comment}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                              <FaRegThumbsUp className="text-3xl text-gray-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-700 mb-3">
                              No Reviews Yet
                            </h4>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                              Complete projects to receive reviews from clients.
                              Great reviews help you get more work!
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "education" && (
                      <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-gray-800">
                          Education & Certifications
                        </h3>

                        {user?.profile?.education ? (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-white rounded-xl shadow-sm">
                                <FaGraduationCap className="text-2xl text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="prose max-w-none">
                                  {user.profile.education
                                    .split("\n")
                                    .map((line, index) => (
                                      <p
                                        key={index}
                                        className="text-gray-700 mb-2"
                                      >
                                        {line}
                                      </p>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                              <FaGraduationCap className="text-3xl text-gray-400" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-700 mb-3">
                              No Education Added
                            </h4>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                              Add your educational background and certifications
                              to build trust with clients.
                            </p>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition font-medium"
                            >
                              Add Education
                            </button>
                          </div>
                        )}

                        {/* Certifications Section */}
                        <div className="bg-white border rounded-2xl p-6">
                          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FaCertificate className="text-orange-500" />
                            Certifications
                          </h4>
                          <div className="text-center py-8">
                            <FaCertificate className="text-4xl text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                              No certifications added yet
                            </p>
                            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                              Add Certifications
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "settings" && (
                      <div className="space-y-8 max-w-2xl">
                        <h3 className="text-2xl font-bold text-gray-800">
                          Account Settings
                        </h3>

                        {/* Account Security */}
                        <div className="bg-white border rounded-2xl p-6">
                          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FaShieldAlt className="text-green-600" />
                            Account Security
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-gray-500">
                                  Last changed 2 months ago
                                </p>
                              </div>
                              <button
                                onClick={() => setShowPasswordModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                              >
                                Change Password
                              </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">
                                  Two-Factor Authentication
                                </p>
                                <p className="text-sm text-gray-500">
                                  Add an extra layer of security
                                </p>
                              </div>
                              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
                                Enable 2FA
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Notification Preferences */}
                        <div className="bg-white border rounded-2xl p-6">
                          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FaBell className="text-purple-600" />
                            Notification Preferences
                          </h4>
                          <div className="space-y-4">
                            {[
                              { label: "Email Notifications", checked: true },
                              { label: "Project Updates", checked: true },
                              { label: "New Messages", checked: true },
                              { label: "Marketing Emails", checked: false },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span className="font-medium">
                                  {item.label}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked={item.checked}
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                          <h4 className="text-xl font-bold text-red-800 mb-4">
                            Danger Zone
                          </h4>
                          <p className="text-red-700 mb-6">
                            These actions are permanent and cannot be undone.
                          </p>
                          <div className="space-y-4">
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to deactivate your account? You can reactivate within 30 days."
                                  )
                                ) {
                                  toast.info(
                                    "Account deactivation feature coming soon"
                                  );
                                }
                              }}
                              className="w-full flex items-center justify-between p-4 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
                            >
                              <span className="font-medium">
                                Deactivate Account
                              </span>
                              <FaChevronRight />
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you absolutely sure? This will permanently delete your account and all data."
                                  )
                                ) {
                                  toast.info(
                                    "Account deletion feature coming soon"
                                  );
                                }
                              }}
                              className="w-full flex items-center justify-between p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              <span className="font-medium">
                                Delete Account Permanently
                              </span>
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={
                      passwordData.showCurrentPassword ? "text" : "password"
                    }
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordData({
                        ...passwordData,
                        showCurrentPassword: !passwordData.showCurrentPassword,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {passwordData.showCurrentPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordData.showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordData({
                        ...passwordData,
                        showNewPassword: !passwordData.showNewPassword,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {passwordData.showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={
                      passwordData.showConfirmPassword ? "text" : "password"
                    }
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordData({
                        ...passwordData,
                        showConfirmPassword: !passwordData.showConfirmPassword,
                      })
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {passwordData.showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Share Profile
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Profile Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/profile/${
                      user?._id || user?.id
                    }`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={handleShareProfile}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    title="Copy link"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  <FaLinkedin />
                </button>
                <button className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-900">
                  <FaGithub />
                </button>
                <button className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600">
                  <FaTwitter />
                </button>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {user?.profile?.resume ? "Update Resume" : "Upload Resume"}
            </h3>

            {user?.profile?.resume && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <FaFilePdf className="text-green-600 text-xl" />
                  <div>
                    <p className="font-medium">Current Resume</p>
                    <a
                      href={user.profile.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      View Resume
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
                <FaFilePdf className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">
                  Upload your resume (PDF or DOC)
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Max file size: 10MB
                </p>
                <label className="cursor-pointer">
                  <span className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block">
                    Choose File
                  </span>
                  <input
                    ref={resumeRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                {user?.profile?.resume && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to remove your resume?"
                        )
                      ) {
                        toast.info("Resume removal feature coming soon");
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Remove Resume
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillAlt,
  FaBuilding,
  FaCalendar,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaEye,
  FaExternalLinkAlt,
  FaFilter,
  FaChevronDown,
  FaBriefcase,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiSearch, FiTrendingUp } from "react-icons/fi";

const MyJobsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "https://freelancingweb-plac.onrender.com/api/applications/my-applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const apps = res.data || [];
        setApplications(apps);

        // Calculate stats
        const stats = {
          total: apps.length,
          pending: apps.filter((app) => app.status === "pending").length,
          accepted: apps.filter((app) => app.status === "accepted").length,
          rejected: apps.filter((app) => app.status === "rejected").length,
        };
        setStats(stats);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FaHourglassHalf className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      app.jobId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobId?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobId?.skillsRequired?.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const StatusFilter = () => (
    <div className="flex flex-wrap gap-2">
      {[
        {
          key: "all",
          label: "All Applications",
          color: "bg-blue-100 text-blue-800",
        },
        {
          key: "pending",
          label: "Pending",
          color: "bg-yellow-100 text-yellow-800",
        },
        {
          key: "accepted",
          label: "Accepted",
          color: "bg-green-100 text-green-800",
        },
        {
          key: "rejected",
          label: "Rejected",
          color: "bg-red-100 text-red-800",
        },
      ].map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            filter === key
              ? `${color} shadow-sm`
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label}
          {key !== "all" && (
            <span className="ml-2 px-2 py-0.5 bg-white/50 rounded-full text-xs">
              {stats[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center">
            <FaBriefcase className="w-20 h-20 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Access Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your job applications and track your progress.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
          >
            Log In to Continue
          </button>
        </motion.div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm p-12 border border-gray-100"
          >
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <FaBriefcase className="w-24 h-24 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Applications Yet
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              You haven't applied to any jobs yet. Start your journey by
              exploring available opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/alljobs")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
              >
                Browse Jobs
              </button>
              <button
                onClick={() => navigate("/internships")}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
              >
                Explore Internships
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track all your job applications in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              key: "total",
              label: "Total Applications",
              icon: <FaBriefcase className="w-6 h-6" />,
              color: "from-blue-500 to-cyan-500",
            },
            {
              key: "pending",
              label: "Pending",
              icon: <FaHourglassHalf className="w-6 h-6" />,
              color: "from-yellow-500 to-orange-500",
            },
            {
              key: "accepted",
              label: "Accepted",
              icon: <FaCheckCircle className="w-6 h-6" />,
              color: "from-green-500 to-emerald-500",
            },
            {
              key: "rejected",
              label: "Rejected",
              icon: <FaTimesCircle className="w-6 h-6" />,
              color: "from-red-500 to-pink-500",
            },
          ].map(({ key, label, icon, color }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay:
                  key === "total"
                    ? 0
                    : key === "pending"
                    ? 0.1
                    : key === "accepted"
                    ? 0.2
                    : 0.3,
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${color} text-white mb-3`}
                  >
                    {icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats[key]}
                  </div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
                <FiTrendingUp className="w-8 h-8 text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative max-w-md">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusFilter />
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredApplications.map((app, index) => {
              const job = app.jobId;

              if (!job) {
                return (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 border border-gray-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Job Not Available
                        </h3>
                        <p className="text-sm text-gray-600">
                          This job has been removed
                        </p>
                      </div>
                      <FaTimesCircle className="w-6 h-6 text-gray-400" />
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Job Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                            {job.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              app.status
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(app.status)}
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <FaBuilding className="w-4 h-4" />
                            {job.company || "Anonymous"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendar className="w-4 h-4" />
                            Applied{" "}
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/job/${job._id}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition"
                      >
                        <FaExternalLinkAlt className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaMapMarkerAlt className="text-blue-500" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaClock className="text-purple-500" />
                        {job.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaMoneyBillAlt className="text-green-500" />₹
                        {job.budget ||
                          job.stipend ||
                          job.ctc ||
                          "Not specified"}
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skillsRequired?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skillsRequired.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{job.skillsRequired.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Application Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Your Application
                        <span className="text-xs font-normal text-gray-500">
                          {new Date(app.createdAt).toLocaleString()}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {app.proposal}
                      </p>

                      {app.status === "pending" && (
                        <div className="flex items-center gap-2 text-sm text-yellow-600">
                          <FaHourglassHalf className="w-4 h-4 animate-pulse" />
                          Under review by employer
                        </div>
                      )}

                      {app.status === "accepted" && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <FaCheckCircle className="w-4 h-4" />
                          Congratulations! Your application was accepted
                        </div>
                      )}

                      {app.status === "rejected" && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <FaTimesCircle className="w-4 h-4" />
                          Application not selected this time
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/job/${job._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                      >
                        <FaEye className="w-4 h-4" />
                        View Job Details
                      </button>
                      {app.status === "accepted" && (
                        <button
                          onClick={() => {
                            /* Handle next steps */
                          }}
                          className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-md transition"
                        >
                          Next Steps
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty Filter State */}
        {filteredApplications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FiSearch className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Tips */}
        {applications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
              Application Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Follow Up",
                  desc: "Consider sending a polite follow-up email after 7-10 days.",
                },
                {
                  title: "Improve Profile",
                  desc: "Update your profile to increase acceptance chances.",
                },
                {
                  title: "Diversify",
                  desc: "Apply to multiple relevant positions to increase opportunities.",
                },
              ].map((tip, idx) => (
                <div key={idx} className="bg-white/50 p-4 rounded-xl">
                  <div className="font-semibold text-gray-900 mb-1">
                    {tip.title}
                  </div>
                  <div className="text-sm text-gray-600">{tip.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyJobsPage;

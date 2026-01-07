import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillAlt,
  FaBuilding,
  FaGlobe,
  FaCalendarAlt,
  FaUserTie,
  FaBriefcase,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaArrowLeft,
} from "react-icons/fa";
import {
  FiUsers,
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiStar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalText, setProposalText] = useState("");
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const [jobRes, jobsRes] = await Promise.all([
          axios.get(
            `https://freelancingweb-plac.onrender.com/api/jobs/jobbyid/${id}`
          ),
          axios.get("https://freelancingweb-plac.onrender.com/api/jobs/all"),
        ]);
        setJob(jobRes.data);

        // Filter similar jobs
        const similar = jobsRes.data
          .filter((j) => j._id !== id && j.jobType === jobRes.data.jobType)
          .slice(0, 4);
        setSimilarJobs(similar);

        setLoading(false);
      } catch (err) {
        console.error("Error loading job:", err);
        toast.error("Failed to load job details.");
        navigate("/alljobs");
      }
    };

    const checkApplied = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          "https://freelancingweb-plac.onrender.com/api/applications/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const appliedIds = res.data.map((app) =>
          typeof app.jobId === "object" ? app.jobId._id : app.jobId
        );
        if (appliedIds.includes(id)) {
          setApplied(true);
        }
      } catch (err) {
        console.error("Error checking applied status");
      }
    };

    fetchJobDetails();
    checkApplied();
  }, [id, token, navigate]);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.info("Please log in to apply.");
      return navigate("/login");
    }
    if (!proposalText.trim()) {
      toast.warn("Please enter a cover letter.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        "https://freelancingweb-plac.onrender.com/api/applications/apply",
        { jobId: id, proposal: proposalText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Applied successfully!");
      setApplied(true);
      setProposalText("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to submit proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this ${job?.jobType} opportunity`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const toggleSave = () => {
    setSaved(!saved);
    toast.success(!saved ? "Saved for later!" : "Removed from saved");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const getSalaryRange = () => {
    if (job.jobType === "Internship") {
      return `₹${job.stipend}/month`;
    }
    return `₹${(job.ctc / 100000).toFixed(1)} LPA`;
  };

  const getJobTypeColor = () => {
    return job.jobType === "Internship"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-16">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getJobTypeColor()}`}
                >
                  {job.jobType}
                </span>
                {job.isUrgent && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FiStar className="w-3 h-3" /> Urgent Hiring
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" />
                  <span>{job.companyName || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleSave}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition"
              >
                {saved ? (
                  <FaBookmark className="w-5 h-5 text-yellow-300" />
                ) : (
                  <FaRegBookmark className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition"
              >
                <FaShareAlt className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaMoneyBillAlt className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Stipend/CTC</div>
                    <div className="text-xl font-bold text-gray-900">
                      {getSalaryRange()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FaClock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-xl font-bold text-gray-900">
                      {job.duration}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaUserTie className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Experience</div>
                    <div className="text-xl font-bold text-gray-900">
                      {job.experience || "Fresher"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FiTarget className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Applications</div>
                    <div className="text-xl font-bold text-gray-900">
                      {Math.floor(Math.random() * 100)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="border-b border-gray-100">
                <div className="flex flex-wrap gap-2 px-6 pt-6">
                  {[
                    "overview",
                    "responsibilities",
                    "requirements",
                    "perks",
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        activeTab === tab
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "overview" && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">
                          Job Overview
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {job.description}
                        </p>

                        {job.details && (
                          <>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Additional Details
                            </h4>
                            <p className="text-gray-700 leading-relaxed">
                              {job.details}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {activeTab === "responsibilities" && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">
                          Key Responsibilities
                        </h3>
                        <ul className="space-y-3">
                          {job.responsibilities?.length > 0 ? (
                            job.responsibilities.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="mt-1 flex-shrink-0">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))
                          ) : (
                            <p className="text-gray-500">
                              No specific responsibilities listed
                            </p>
                          )}
                        </ul>
                      </div>
                    )}

                    {activeTab === "requirements" && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">
                          Skills & Requirements
                        </h3>
                        {job.skillsRequired?.length > 0 && (
                          <>
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {job.skillsRequired.map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </>
                        )}

                        <div className="space-y-3">
                          {job.experience && (
                            <div className="flex items-center gap-3">
                              <FiTrendingUp className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-700">
                                Experience: {job.experience}
                              </span>
                            </div>
                          )}
                          {job.education && (
                            <div className="flex items-center gap-3">
                              <FiAward className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-700">
                                Education: {job.education}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "perks" && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">
                          Benefits & Perks
                        </h3>
                        {job.perks?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.perks.map((perk, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <FiStar className="w-5 h-5 text-yellow-500" />
                                <span className="text-gray-700">{perk}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            No specific perks listed
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Company Info */}
            {job.companyName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  About the Company
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                  {job.companyLogo && (
                    <div className="flex-shrink-0">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-24 h-24 object-contain rounded-xl border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {job.companyName}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {job.companyDescription ||
                        "A forward-thinking company looking for talented individuals."}
                    </p>
                    {job.companyWebsite && (
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Visit Website <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Posted By */}
            {job.postedBy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Posted By
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={job.postedBy.profilePic || "/default-avatar.png"}
                    alt={job.postedBy.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {job.postedBy.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {job.postedBy.role || "Recruiter"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <FiUsers className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {Math.floor(Math.random() * 50) + 10} jobs posted
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Apply Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {getSalaryRange()}
                </div>
                <div className="text-gray-600">
                  {job.jobType === "Internship"
                    ? "Monthly Stipend"
                    : "Annual CTC"}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600">Job Mode</span>
                  <span className="font-semibold">{job.jobMode}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{job.location}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{job.duration}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">
                    {job.experience || "Fresher"}
                  </span>
                </div>
              </div>

              {applied ? (
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
                  <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-green-700 mb-1">
                    Application Submitted!
                  </h4>
                  <p className="text-green-600 text-sm">
                    You've successfully applied for this position
                  </p>
                  <Link
                    to="/myjobs"
                    className="inline-block mt-3 text-sm text-green-700 hover:text-green-800 font-medium"
                  >
                    View Applications →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleProposalSubmit}>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Quick Apply
                  </h4>
                  <textarea
                    rows="4"
                    placeholder="Tell us why you're a great fit for this role..."
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                      submitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>

                  {!token && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                      >
                        Log in
                      </Link>{" "}
                      to apply
                    </p>
                  )}
                </form>
              )}
            </motion.div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Similar Jobs
                </h3>
                <div className="space-y-4">
                  {similarJobs.map((j) => (
                    <Link
                      key={j._id}
                      to={`/job/${j._id}`}
                      className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                          {j.title}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {j.jobType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <FaBuilding className="w-3 h-3" />
                          {j.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMoneyBillAlt className="w-3 h-3" />
                          {j.jobType === "Internship"
                            ? `₹${j.stipend}`
                            : `₹${j.ctc}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          {j.location}
                        </span>
                        <span className="text-xs text-blue-600 font-medium">
                          View Details →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/alljobs"
                  className="block text-center mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View All Jobs
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

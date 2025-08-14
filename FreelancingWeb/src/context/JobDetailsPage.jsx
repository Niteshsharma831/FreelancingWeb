import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalText, setProposalText] = useState("");
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchJobDetails = async () => {
      try {
        const [jobRes, jobsRes] = await Promise.all([
          axios.get(
            `https://freelancingweb-plac.onrender.com/api/jobs/jobbyid/${id}`
          ),
          axios.get("https://freelancingweb-plac.onrender.com/api/jobs/all"),
        ]);
        setJob(jobRes.data);
        setJobs(jobsRes.data);
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
      toast.error("Failed to submit proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading job details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-10 mt-20">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Job Details */}
        <div className="w-full lg:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 mb-6"
          >
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
              {job.title}
            </h1>
            <p className="text-gray-700 mb-4 text-justify">{job.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-500" /> {job.location}
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-purple-500" /> {job.duration}
              </div>
              <div className="flex items-center gap-2">
                <FaMoneyBillAlt className="text-green-500" />
                {job.jobType === "Internship" && <> ₹{job.stipend} Stipend</>}
                {job.jobType === "Job" && <> ₹{job.ctc} CTC</>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <strong>Job Type:</strong> {job.jobType}
              </div>
              <div>
                <strong>Mode:</strong> {job.jobMode}
              </div>
              <div>
                <strong>Company:</strong> {job.companyName}
              </div>
            </div>

            {job.details && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Job Details:
                </h3>
                <p className="text-gray-700 text-justify text-sm">
                  {job.details}
                </p>
              </div>
            )}

            {job.companyLogo && (
              <img
                src={job.companyLogo}
                alt="Logo"
                className="w-28 h-28 object-contain mb-4 rounded-lg shadow"
              />
            )}
            {job.companyWebsite && (
              <p className="text-sm mb-4">
                <strong>Website: </strong>
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {job.companyWebsite}
                </a>
              </p>
            )}

            {job.perks?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Perks:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {job.perks.map((perk, i) => (
                    <li key={i}>{perk}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.responsibilities?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Responsibilities:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Requirements:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {job.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.preferredQualifications?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Preferred Qualifications:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {job.preferredQualifications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.skillsRequired?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Skills Required:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.postedBy && (
              <div className="mt-6 border-t pt-4 flex items-center gap-3">
                <img
                  src={job.postedBy.profilePic || "/default.png"}
                  alt="profile"
                  className="w-12 h-12 rounded-full shadow"
                />
                <span className="text-gray-800 font-medium">
                  {job.postedBy.name}
                </span>
              </div>
            )}

            {/* Apply Section */}
            <div className="mt-6 lg:hidden">
              {!applied ? (
                <form
                  onSubmit={handleProposalSubmit}
                  className="bg-white p-4 rounded-2xl shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    ✍️ Submit Your Proposal
                  </h3>
                  <textarea
                    rows="5"
                    placeholder="Write your cover letter..."
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full px-6 py-2 rounded-lg text-white font-medium shadow-md transition ${
                      submitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Apply Now"}
                  </button>
                </form>
              ) : (
                <p className="text-green-600 font-medium mt-2">
                  ✅ You have already applied.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar for Desktop */}
        <div className="hidden lg:flex lg:flex-col w-full lg:w-1/3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-xl"
          >
            {!applied ? (
              <form onSubmit={handleProposalSubmit}>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  ✍️ Submit Your Proposal
                </h3>
                <textarea
                  rows="5"
                  placeholder="Write your cover letter..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-6 py-2 rounded-lg text-white font-medium shadow-md transition ${
                    submitting
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {submitting ? "Submitting..." : "Apply Now"}
                </button>
              </form>
            ) : (
              <p className="text-green-600 font-medium mt-2">
                ✅ You have already applied.
              </p>
            )}
          </motion.div>

          {/* More Jobs */}
          {jobs.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                🔎 More Jobs
              </h3>
              {jobs
                .filter((j) => j._id !== id)
                .slice(0, 3)
                .map((j) => (
                  <Link
                    to={`/job/${j._id}`}
                    key={j._id}
                    className="block border border-gray-200 rounded-lg p-3 mb-3 hover:bg-indigo-50 transition"
                  >
                    <h4 className="text-md font-medium text-gray-800 mb-1">
                      {j.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ₹{j.jobType === "Internship" ? j.stipend : j.ctc} -{" "}
                      {j.duration}
                    </p>
                  </Link>
                ))}
              <Link
                to="/alljobs"
                className="block text-sm text-indigo-600 mt-3 hover:underline"
              >
                View All Jobs →
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

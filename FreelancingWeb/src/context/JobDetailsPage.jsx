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
          axios.get(`http://localhost:5000/api/jobs/jobbyid/${id}`),
          axios.get("http://localhost:5000/api/jobs/all"),
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
          "http://localhost:5000/api/applications/my-applications",
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
        "http://localhost:5000/api/applications/apply",
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
        <p className="text-lg text-gray-600">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-indigo-100 via-white to-purple-100 mt-20">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Left Side: Job Details */}
      <div className="w-full p-4 sm:p-6 lg:p-8 lg:w-2/3">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h1>
          <p className="text-gray-700 mb-4 text-justify">{job.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
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
              <h3 className="font-semibold text-gray-700 mb-2">Job Details:</h3>
              <p className="text-gray-700 text-justify text-sm">
                {job.details}
              </p>
            </div>
          )}

          {job.companyLogo && (
            <img
              src={job.companyLogo}
              alt="Logo"
              className="w-24 h-24 object-contain mb-2"
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
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Posted By:</h3>
              <div className="flex items-center gap-3">
                <img
                  src={job.postedBy.profilePic || "/default.png"}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-800 font-medium">
                  {job.postedBy.name}
                </span>
              </div>
            </div>
          )}

          {/* Apply Section for Mobile */}
          <div className="lg:hidden mt-6">
            {!applied ? (
              <form
                onSubmit={handleProposalSubmit}
                className="bg-white/80 p-4 rounded-xl shadow"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  ✍️ Submit Your Proposal
                </h3>
                <textarea
                  rows="5"
                  placeholder="Write your cover letter..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg text-sm mb-3"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full px-6 py-2 rounded-lg text-white font-medium shadow-md ${
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
      <div className="hidden lg:flex lg:flex-col w-full lg:w-1/3 p-4 sm:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4"
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
                className="w-full border px-4 py-2 rounded-lg text-sm mb-3"
              />
              <button
                type="submit"
                disabled={submitting}
                className={`w-full px-6 py-2 rounded-lg text-white font-medium shadow-md ${
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              🔎 More Job
            </h3>
            {jobs
              .filter((j) => j._id !== id)
              .slice(0, 1)
              .map((j) => (
                <Link
                  to={`/job/${j._id}`}
                  key={j._id}
                  className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition"
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
  );
};

export default JobDetailsPage;

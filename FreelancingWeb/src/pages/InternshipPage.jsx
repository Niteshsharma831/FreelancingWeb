import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const InternshipPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const [jobsRes, appliedRes] = await Promise.all([
          axios.get("http://localhost:5000/api/jobs/all"),
          token
            ? axios.get(
                "http://localhost:5000/api/applications/my-applications",
                { headers: { Authorization: `Bearer ${token}` } }
              )
            : Promise.resolve({ data: [] }),
        ]);

        const internships = jobsRes.data.filter(
          (job) => job.jobType === "Internship"
        );
        setJobs(internships);

        const appliedIds = appliedRes.data.map((app) =>
          typeof app.jobId === "object" ? app.jobId._id : app.jobId
        );
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error("Error fetching internships:", err);
        toast.error("Failed to load internships");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [token]);

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleApplyClick = (job) => {
    if (!token) {
      toast.info("Please log in to apply.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    const isSmallScreen = window.innerWidth < 1024; // Tailwind lg breakpoint
    if (isSmallScreen) {
      navigate(`/job/${job._id}`);
      return;
    }

    if (appliedJobIds.includes(job._id)) {
      toast.success("✅ Already applied for this internship.");
      setExpandedJob(null);
      return;
    }

    setExpandedJob(job);
    setProposalText("");
  };

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!proposalText.trim()) {
      toast.warn("Please write your proposal.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/applications/apply",
        { jobId: expandedJob._id, proposal: proposalText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Application submitted successfully!");
      setAppliedJobIds((prev) => [...prev, expandedJob._id]);
      setExpandedJob(null);
    } catch (err) {
      console.error("Error applying:", err);
      const errorMsg =
        err.response?.data?.error || "Failed to apply. Try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium animate-pulse">
          Loading internships...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-4xl font-bold text-center mb-8">
        🎓 Internship Vacancies
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div
          className={`flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}
        >
          {jobs.map((job) => {
            const alreadyApplied = appliedJobIds.includes(job._id);
            return (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 p-6 border border-gray-100"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-500" />{" "}
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-purple-500" /> {job.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMoneyBillAlt className="text-green-500" /> ₹{job.stipend}
                  </div>
                </div>

                {alreadyApplied && (
                  <p className="text-green-700 font-medium text-sm mb-2">
                    ✅ Already applied
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetails(job._id)}
                    className="flex-1 border border-indigo-500 text-indigo-500 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApplyClick(job)}
                    disabled={alreadyApplied}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition ${
                      alreadyApplied
                        ? "bg-green-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {alreadyApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right-side proposal panel only on large screens */}
        {expandedJob && (
          <div className="lg:w-1/3">
            <div className="sticky top-6 bg-white border border-gray-300 p-6 rounded-xl shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                ✍️ Apply for: {expandedJob.title}
              </h2>

              <form onSubmit={submitProposal}>
                <textarea
                  rows="6"
                  placeholder="Introduce yourself, your experience, and why you're a great fit..."
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg text-sm mb-3"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedJob(null)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-4 py-2 rounded-lg text-sm text-white transition ${
                      submitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Submit Proposal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipPage;

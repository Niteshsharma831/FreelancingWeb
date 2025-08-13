import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const InternshipPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

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
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
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

  const handleApply = async (jobId) => {
    if (!token) {
      toast.info("Please log in to apply.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (appliedJobIds.includes(jobId)) {
      toast.success("✅ Already applied for this internship.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/applications/apply",
        { jobId, proposal: "I am interested in this internship." }, // default proposal
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application submitted successfully!");
      setAppliedJobIds((prev) => [...prev, jobId]);
    } catch (err) {
      console.error("Error applying:", err);
      toast.error("Failed to apply. Try again.");
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

      {jobs.length === 0 ? (
        <p className="text-center text-gray-600">
          No internships available right now.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {jobs.map((job) => {
            const alreadyApplied = appliedJobIds.includes(job._id);
            return (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 p-6 border border-gray-100"
              >
                {/* Job Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {job.title}
                </h2>

                {/* Short Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Skills */}
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

                {/* Meta Info */}
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

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetails(job._id)}
                    className="flex-1 border border-indigo-500 text-indigo-500 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApply(job._id)}
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
      )}
    </div>
  );
};

export default InternshipPage;

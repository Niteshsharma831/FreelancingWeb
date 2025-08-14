import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillAlt,
  FaFilter,
  FaChevronDown,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Remote",
];

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    location: [],
    skills: [],
    duration: [],
    experience: [],
  });
  const [filterOpen, setFilterOpen] = useState({
    jobType: false,
    location: false,
    skills: false,
    duration: false,
    experience: false,
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const [jobsRes, appliedRes] = await Promise.all([
          axios.get("https://freelancingweb-plac.onrender.com/api/jobs/all"),
          token
            ? axios.get(
                "https://freelancingweb-plac.onrender.com/api/applications/my-applications",
                { headers: { Authorization: `Bearer ${token}` } }
              )
            : Promise.resolve({ data: [] }),
        ]);
        setJobs(jobsRes.data);
        const appliedIds = appliedRes.data.map((app) =>
          typeof app.jobId === "object" ? app.jobId._id : app.jobId
        );
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobsAndApplications();
  }, [token]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const current = prev[field];
      if (current.includes(value)) {
        // remove
        return { ...prev, [field]: current.filter((v) => v !== value) };
      } else {
        // add
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matches = (field) =>
      filters[field].length === 0 ||
      filters[field].includes(job[field]) ||
      (field === "skills" &&
        filters.skills.every((skill) => job.skillsRequired.includes(skill)));
    return (
      matches("jobType") &&
      matches("location") &&
      matches("skills") &&
      matches("duration") &&
      matches("experience")
    );
  });

  const handleApplyClick = (job) => {
    if (!token) {
      toast.info("Please log in to apply.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    const isSmallScreen = window.innerWidth < 1024;
    if (isSmallScreen) {
      navigate(`/job/${job._id}`);
      return;
    }
    if (appliedJobIds.includes(job._id)) {
      toast.success("✅ You have already applied for this job.");
      setExpandedJob(null);
      return;
    }
    setExpandedJob(job);
    setProposalText("");
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const submitProposal = async (e) => {
    e.preventDefault();
    if (!proposalText.trim()) {
      toast.warn("Please write a cover letter.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        "https://freelancingweb-plac.onrender.com/api/applications/apply",
        { jobId: expandedJob._id, proposal: proposalText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Application submitted successfully!");
      setAppliedJobIds((prev) => [...prev, expandedJob._id]);
      setExpandedJob(null);
    } catch (err) {
      console.error("Application failed:", err);
      toast.error(
        err.response?.data?.error || "❌ Failed to apply. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const MultiSelectFilter = ({ label, field, options }) => (
    <div className="border-b border-gray-200 pb-2">
      <button
        onClick={() =>
          setFilterOpen((prev) => ({ ...prev, [field]: !prev[field] }))
        }
        className="flex justify-between items-center w-full py-2 text-gray-800 font-medium"
      >
        {label}
        <FaChevronDown
          className={`transition-transform ${
            filterOpen[field] ? "rotate-180" : ""
          }`}
        />
      </button>
      {filterOpen[field] && (
        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center">
              <input
                type="checkbox"
                name={field}
                value={opt}
                checked={filters[field].includes(opt)}
                onChange={() => handleFilterChange(field, opt)}
                className="mr-2"
              />
              <label>{opt}</label>
            </div>
          ))}
          <button
            className="text-sm text-blue-600 mt-1"
            onClick={() => setFilters((prev) => ({ ...prev, [field]: [] }))}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
        <p className="text-lg text-gray-700 font-medium animate-pulse">
          Loading jobs...
        </p>
      </div>
    );
  }

  const jobTypes = [...new Set(jobs.map((j) => j.jobType))];
  const skills = [...new Set(jobs.flatMap((j) => j.skillsRequired))];
  const durations = [...new Set(jobs.map((j) => j.duration))];
  const experiences = [...new Set(jobs.map((j) => j.experience))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 mt-15">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Mobile filter button */}
      <div className="lg:hidden px-4 mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <FaFilter className="mr-2" /> Filters
        </button>
      </div>

      <div className="flex">
        {/* Desktop filter sidebar */}
        <div className="hidden lg:block lg:w-1/4 xl:w-1/5 sticky top-0 h-screen bg-white p-4 shadow-lg border-r overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <MultiSelectFilter
            label="Job Type"
            field="jobType"
            options={jobTypes}
          />
          <MultiSelectFilter
            label="Location"
            field="location"
            options={indianStates}
          />
          <MultiSelectFilter label="Skills" field="skills" options={skills} />
          <MultiSelectFilter
            label="Duration"
            field="duration"
            options={durations}
          />
          <MultiSelectFilter
            label="Experience"
            field="experience"
            options={experiences}
          />
        </div>

        {/* Jobs scrollable */}
        <div className="flex-1 lg:h-screen lg:overflow-y-auto p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const alreadyApplied = appliedJobIds.includes(job._id);
            const isExpanded = expandedJob && expandedJob._id === job._id;
            return (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
              >
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {job.description.slice(0, 120)}...
                </p>
                <div className="text-sm text-gray-500 flex items-center mb-1">
                  <FaMapMarkerAlt className="text-indigo-500 mr-1" />{" "}
                  {job.location}
                </div>
                <div className="text-sm text-gray-500 flex items-center mb-1">
                  <FaClock className="text-purple-500 mr-1" /> {job.duration}
                </div>
                <div className="text-sm text-gray-500 flex items-center mb-4">
                  <FaMoneyBillAlt className="text-green-500 mr-1" />{" "}
                  {job.jobType === "Internship"
                    ? `Stipend: ₹${job.stipend}`
                    : `CTC: ₹${job.ctc}`}
                </div>
                <div className="flex justify-between">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded"
                    onClick={() => handleViewDetails(job._id)}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApplyClick(job)}
                    disabled={alreadyApplied}
                    className={`px-3 py-1 rounded text-white ${
                      alreadyApplied
                        ? "bg-green-500"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {alreadyApplied ? "Applied" : "Apply"}
                  </button>
                </div>

                {/* Desktop proposal form */}
                {isExpanded && !alreadyApplied && (
                  <form onSubmit={submitProposal} className="mt-4">
                    <textarea
                      value={proposalText}
                      onChange={(e) => setProposalText(e.target.value)}
                      placeholder="Write your cover letter here..."
                      className="w-full border p-2 rounded mb-2 resize-none"
                      rows="3"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile filter overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
          <div className="bg-white w-3/4 p-4 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-red-500"
              >
                Close
              </button>
            </div>
            <MultiSelectFilter
              label="Job Type"
              field="jobType"
              options={jobTypes}
            />
            <MultiSelectFilter
              label="Location"
              field="location"
              options={indianStates}
            />
            <MultiSelectFilter label="Skills" field="skills" options={skills} />
            <MultiSelectFilter
              label="Duration"
              field="duration"
              options={durations}
            />
            <MultiSelectFilter
              label="Experience"
              field="experience"
              options={experiences}
            />
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default JobPage;

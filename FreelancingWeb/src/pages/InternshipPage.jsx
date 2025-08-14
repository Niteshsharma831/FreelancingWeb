import React, { useEffect, useState, useMemo, useCallback } from "react";
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

const ITEMS_PER_PAGE = 20;

const InternshipPage = () => {
  const [internships, setInternships] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    skills: "",
    duration: "",
    experience: "",
  });
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchInternships = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      try {
        if (reset) setLoading(true);
        const params = {
          jobType: "Internship",
          location: filters.location,
          skills: filters.skills,
          duration: filters.duration,
          experience: filters.experience,
          page: reset ? 1 : page,
          limit: ITEMS_PER_PAGE,
        };

        const [jobsRes, appliedRes] = await Promise.all([
          axios.get("https://freelancingweb-plac.onrender.com/api/jobs/all", {
            withCredentials: true,
          }),
          token
            ? axios.get(
                "https://freelancingweb-plac.onrender.com/api/applications/my-applications",
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
            : Promise.resolve({ data: [] }),
        ]);

        let fetchedJobs = jobsRes.data.jobs || jobsRes.data; // Adjust depending on backend response
        fetchedJobs.forEach((job) => {
          if (!indianStates.includes(job.location)) job.location = "Remote";
        });

        setInternships((prev) =>
          reset ? fetchedJobs : [...prev, ...fetchedJobs]
        );
        setPage((prev) => (reset ? 2 : prev + 1));
        setHasMore(fetchedJobs.length === ITEMS_PER_PAGE);

        const appliedIds = appliedRes.data.map((app) =>
          typeof app.jobId === "object" ? app.jobId._id : app.jobId
        );
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error("Error fetching internships:", err);
        toast.error("Failed to load internships.");
      } finally {
        setLoading(false);
      }
    },
    [filters, page, token, hasMore]
  );

  useEffect(() => {
    fetchInternships(true); // Reset when filters change
  }, [filters, fetchInternships]);

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleApplyClick = (job) => {
    if (!token) {
      toast.info("Please log in to apply.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    const isSmallScreen = window.innerWidth < 1024;
    if (isSmallScreen) {
      navigate(`/internship/${job._id}`);
      return;
    }
    if (appliedJobIds.includes(job._id)) {
      toast.success("✅ You have already applied for this internship.");
      setExpandedJob(null);
      return;
    }
    setExpandedJob(job);
    setProposalText("");
  };

  const handleViewDetails = (jobId) => navigate(`/job/${jobId}`);

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

  const DropdownFilter = ({ label, field, options }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="border-b border-gray-200 pb-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center w-full py-2 text-gray-800 font-medium"
        >
          {label}
          <FaChevronDown
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={field}
                  value={opt}
                  checked={filters[field] === opt}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                  className="mr-2"
                />
                <label>{opt}</label>
              </div>
            ))}
            <button
              className="text-sm text-blue-600 mt-1"
              onClick={() => handleFilterChange(field, "")}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  };

  // Infinite scroll
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight &&
      !loading &&
      hasMore
    ) {
      fetchInternships();
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, fetchInternships]);

  // Prepare unique filter options
  const skills = useMemo(
    () => [...new Set(internships.flatMap((j) => j.skillsRequired))],
    [internships]
  );
  const durations = useMemo(
    () => [...new Set(internships.map((j) => j.duration))],
    [internships]
  );
  const experiences = useMemo(
    () => [...new Set(internships.map((j) => j.experience))],
    [internships]
  );

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
          <DropdownFilter
            label="Location"
            field="location"
            options={indianStates}
          />
          <DropdownFilter label="Skills" field="skills" options={skills} />
          <DropdownFilter
            label="Duration"
            field="duration"
            options={durations}
          />
          <DropdownFilter
            label="Experience"
            field="experience"
            options={experiences}
          />
        </div>

        {/* Internships */}
        <div className="flex-1 lg:h-screen lg:overflow-y-auto p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading && internships.length === 0
            ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md p-5 animate-pulse h-56"
                ></div>
              ))
            : internships.map((job) => {
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
                      <FaClock className="text-purple-500 mr-1" />{" "}
                      {job.duration}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mb-4">
                      <FaMoneyBillAlt className="text-green-500 mr-1" />{" "}
                      Stipend: ₹{job.stipend}
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
                    {isExpanded && !alreadyApplied && (
                      <form onSubmit={submitProposal} className="mt-4">
                        <textarea
                          value={proposalText}
                          onChange={(e) => setProposalText(e.target.value)}
                          placeholder="Write your cover letter here..."
                          className="w-full border p-2 rounded mb-2"
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
          {!hasMore && (
            <p className="text-center col-span-full text-gray-500 mt-4">
              No more internships
            </p>
          )}
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
            <DropdownFilter
              label="Location"
              field="location"
              options={indianStates}
            />
            <DropdownFilter label="Skills" field="skills" options={skills} />
            <DropdownFilter
              label="Duration"
              field="duration"
              options={durations}
            />
            <DropdownFilter
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

export default InternshipPage;

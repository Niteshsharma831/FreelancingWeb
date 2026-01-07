import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillAlt,
  FaFilter,
  FaChevronDown,
  FaSearch,
  FaFire,
  FaStar,
  FaBuilding,
  FaGraduationCap,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaTimes,
  FaCheckCircle,
  FaRegHeart,
  FaHeart,
  FaSortAmountDown,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FiTrendingUp,
  FiBookmark,
  FiShare2,
  FiEye,
  FiTarget,
} from "react-icons/fi";
import { HiOutlineLightningBolt, HiOutlineSparkles } from "react-icons/hi";

const indianStates = [
  "Remote",
  "Bangalore",
  "Delhi",
  "Mumbai",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Gurgaon",
  "Noida",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Indore",
  "Bhubaneswar",
  "Coimbatore",
  "Goa",
  "Kerala",
  "Other",
];

const MultiSelectFilter = React.memo(
  ({
    label,
    field,
    options,
    filters,
    handleFilterChange,
    filterOpen,
    setFilterOpen,
    icon: Icon,
  }) => {
    const [search, setSearch] = useState("");

    const filteredOptions = options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="border-b border-gray-100 pb-4 mb-4">
        <button
          onClick={() =>
            setFilterOpen((prev) => ({ ...prev, [field]: !prev[field] }))
          }
          className="flex justify-between items-center w-full py-2 text-gray-800 font-semibold text-lg hover:text-blue-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            {label}
            {filters[field].length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                {filters[field].length}
              </span>
            )}
          </div>
          <FaChevronDown
            className={`transition-transform duration-300 ${
              filterOpen[field] ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {filterOpen[field] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {options.length > 5 && (
                <div className="relative mb-2">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                {filteredOptions.map((opt, idx) => (
                  <motion.label
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      name={field}
                      value={opt}
                      checked={filters[field].includes(opt)}
                      onChange={() => handleFilterChange(field, opt)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{opt}</span>
                    {filters[field].includes(opt) && (
                      <FaCheckCircle className="ml-auto text-green-500 w-4 h-4" />
                    )}
                  </motion.label>
                ))}
              </div>

              {filters[field].length > 0 && (
                <button
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => handleFilterChange(field, null, true)}
                >
                  Clear all
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");

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

  // UI pagination
  const [uiPage, setUiPage] = useState(1);
  const pageSize = 12;

  // server pagination
  const [serverPage, setServerPage] = useState(1);
  const [serverHasMore, setServerHasMore] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!token) {
          setAppliedJobIds([]);
          return;
        }
        const appliedRes = await axios.get(
          "https://freelancingweb-plac.onrender.com/api/applications/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const appliedIds = (appliedRes.data || []).map((app) =>
          typeof app.jobId === "object" ? app.jobId._id : app.jobId
        );
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error("Error fetching applications:", err);
        toast.error("Failed to load your applications.");
      }
    };
    fetchApplications();
  }, [token]);

  const fetchServerJobs = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://freelancingweb-plac.onrender.com/api/jobs/all`,
        {
          params: {
            page: pageNum,
            limit: pageSize,
            ...(searchQuery && { search: searchQuery }),
          },
        }
      );
      const incoming = Array.isArray(res.data)
        ? res.data
        : res.data?.jobs || [];

      // Enhance jobs with additional data
      const enhancedIncoming = incoming.map((job) => ({
        ...job,
        isFeatured: Math.random() > 0.7,
        isUrgent: Math.random() > 0.8,
        postedAt: job.createdAt || new Date().toISOString(),
      }));

      setJobs((prev) => {
        const existingIds = new Set(prev.map((j) => j._id));
        const deduped = enhancedIncoming.filter((j) => !existingIds.has(j._id));
        return [...prev, ...deduped];
      });

      setServerHasMore(incoming.length === pageSize);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const resetAndFetch = async () => {
      setJobs([]);
      setUiPage(1);
      setServerPage(1);
      setServerHasMore(true);
      await fetchServerJobs(1);
    };
    resetAndFetch();
  }, [searchQuery]);

  useEffect(() => {
    fetchServerJobs(serverPage);
  }, [serverPage]);

  const handleFilterChange = (field, value, clear = false) => {
    if (clear) {
      setFilters((prev) => ({ ...prev, [field]: [] }));
      setUiPage(1);
      return;
    }
    setFilters((prev) => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
    setUiPage(1);
  };

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matches = (field) =>
        filters[field].length === 0 ||
        filters[field].includes(job[field]) ||
        (field === "skills" &&
          Array.isArray(job.skillsRequired) &&
          filters.skills.every((skill) => job.skillsRequired.includes(skill)));
      return (
        matches("jobType") &&
        matches("location") &&
        matches("skills") &&
        matches("duration") &&
        matches("experience")
      );
    });

    // Sort
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    } else if (sortBy === "salary") {
      filtered.sort((a, b) => {
        const salaryA = a.jobType === "Internship" ? a.stipend : a.ctc || 0;
        const salaryB = b.jobType === "Internship" ? b.stipend : b.ctc || 0;
        return salaryB - salaryA;
      });
    } else if (sortBy === "urgent") {
      filtered.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
    }

    return filtered;
  }, [jobs, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const start = (uiPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedJobs = filteredJobs.slice(start, end);

  useEffect(() => {
    if (uiPage > totalPages) setUiPage(totalPages);
    if (uiPage < 1) setUiPage(1);
  }, [totalPages, uiPage]);

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

  const jobTypes = [...new Set(jobs.map((j) => j.jobType).filter(Boolean))];
  const skills = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "UI/UX",
    "Marketing",
    "Data Science",
    "Mobile Development",
    "Web Development",
    "Machine Learning",
    "Graphic Design",
    "Content Writing",
    ...new Set(
      jobs.flatMap((j) =>
        Array.isArray(j.skillsRequired) ? j.skillsRequired : []
      )
    ),
  ];
  const durations = [
    "1 month",
    "2 months",
    "3 months",
    "6 months",
    "1 year",
    ...new Set(jobs.map((j) => j.duration).filter(Boolean)),
  ];
  const experiences = [
    "Fresher",
    "Beginner",
    "Intermediate",
    "Expert",
    ...new Set(jobs.map((j) => j.experience).filter(Boolean)),
  ];

  const handlePrev = () => {
    setUiPage((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = async () => {
    if (uiPage < totalPages) {
      setUiPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (serverHasMore && !loading) {
      const nextServerPage = serverPage + 1;
      await fetchServerJobs(nextServerPage);
      setServerPage(nextServerPage);
      setTimeout(() => {
        const newTotalPages = Math.max(
          1,
          Math.ceil(filteredJobs.length / pageSize)
        );
        if (uiPage < newTotalPages) {
          setUiPage((p) => p + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (!serverHasMore) {
          toast.info("No more jobs to show.");
        }
      }, 0);
    } else {
      toast.info("No more jobs to show.");
    }
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
        toast.success("Removed from saved jobs");
      } else {
        newSet.add(jobId);
        toast.success("Saved for later");
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      location: [],
      skills: [],
      duration: [],
      experience: [],
    });
    setSearchQuery("");
  };

  const jobStats = {
    total: jobs.length,
    internships: jobs.filter((j) => j.jobType === "Internship").length,
    fullTime: jobs.filter((j) => j.jobType === "Job").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Find Your Perfect Job
          </h1>
          <p className="text-blue-100 mb-6 max-w-2xl">
            Discover thousands of opportunities from top companies. Your dream
            job awaits.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FaFire className="text-orange-500" />
                <span className="font-semibold">{jobStats.total}</span>
                <span className="text-gray-600">Active Jobs</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" />
                <span className="font-semibold">{jobStats.internships}</span>
                <span className="text-gray-600">Internships</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-green-500" />
                <span className="font-semibold">{jobStats.fullTime}</span>
                <span className="text-gray-600">Full-time</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">Latest First</option>
                <option value="salary">Highest Salary</option>
                <option value="urgent">Urgent Hiring</option>
              </select>
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <FaFilter /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex">
        {/* Desktop Filters */}
        <div className="hidden lg:block lg:w-1/4 xl:w-1/5 pr-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>

            <MultiSelectFilter
              label="Job Type"
              field="jobType"
              options={jobTypes}
              filters={filters}
              handleFilterChange={handleFilterChange}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              icon={FaBriefcase}
            />

            <MultiSelectFilter
              label="Location"
              field="location"
              options={indianStates}
              filters={filters}
              handleFilterChange={handleFilterChange}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              icon={FaMapMarkerAlt}
            />

            <MultiSelectFilter
              label="Skills"
              field="skills"
              options={skills}
              filters={filters}
              handleFilterChange={handleFilterChange}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              icon={FaStar}
            />

            <MultiSelectFilter
              label="Duration"
              field="duration"
              options={durations}
              filters={filters}
              handleFilterChange={handleFilterChange}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              icon={FaCalendarAlt}
            />

            <MultiSelectFilter
              label="Experience"
              field="experience"
              options={experiences}
              filters={filters}
              handleFilterChange={handleFilterChange}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              icon={FiTrendingUp}
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-3">Job Insights</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Remote Jobs</span>
                <span className="font-semibold">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Immediate Hiring</span>
                <span className="font-semibold">42%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Demand Skills</span>
                <span className="font-semibold">React, Python</span>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="flex-1">
          {/* Active Filters */}
          {Object.values(filters).some((arr) => arr.length > 0) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, values]) =>
                values.map((value, idx) => (
                  <div
                    key={`${key}-${idx}`}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm"
                  >
                    {value}
                    <button
                      onClick={() => handleFilterChange(key, value)}
                      className="hover:text-blue-900"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {loading && jobs.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-64 animate-pulse"
                />
              ))
            ) : pagedJobs.length > 0 ? (
              pagedJobs.map((job) => {
                const alreadyApplied = appliedJobIds.includes(job._id);
                const isExpanded = expandedJob && expandedJob._id === job._id;
                const isSaved = savedJobs.has(job._id);

                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Job Header */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                              {job.title}
                            </h2>
                            {job.isFeatured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full flex items-center gap-1">
                                <FaStar className="w-3 h-3" /> Featured
                              </span>
                            )}
                            {job.isUrgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center gap-1">
                                <HiOutlineSparkles className="w-3 h-3" /> Urgent
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <FaBuilding className="w-4 h-4" />
                              {job.company || "Anonymous Company"}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {job.jobType}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSaveJob(job._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          {isSaved ? (
                            <FaHeart className="w-5 h-5 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                        {job.description || "No description provided"}
                      </p>

                      {/* Job Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-700">
                            <FaMapMarkerAlt className="text-blue-500" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <FaClock className="text-purple-500" />
                            <span>{job.duration || "Flexible"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <FaMoneyBillAlt className="text-green-500" />
                            <span className="font-semibold">
                              {job.jobType === "Internship"
                                ? `₹${job.stipend}/month`
                                : `₹${(job.ctc / 100000).toFixed(1)} LPA`}
                            </span>
                          </div>
                        </div>

                        {/* Skills */}
                        {Array.isArray(job.skillsRequired) &&
                          job.skillsRequired.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {job.skillsRequired
                                .slice(0, 3)
                                .map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {job.skillsRequired.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{job.skillsRequired.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetails(job._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                          Details
                        </button>
                        <button
                          onClick={() => handleApplyClick(job)}
                          disabled={alreadyApplied}
                          className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                            alreadyApplied
                              ? "bg-green-100 text-green-700"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                          }`}
                        >
                          {alreadyApplied ? (
                            <span className="flex items-center justify-center gap-2">
                              <FaCheckCircle /> Applied
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <HiOutlineLightningBolt /> Apply Now
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Quick Apply Form */}
                      {isExpanded && !alreadyApplied && (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          onSubmit={submitProposal}
                          className="mt-6 border-t pt-6"
                        >
                          <h4 className="font-semibold mb-3">Quick Apply</h4>
                          <textarea
                            value={proposalText}
                            onChange={(e) => setProposalText(e.target.value)}
                            placeholder="Write a short cover letter explaining why you're a good fit..."
                            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="3"
                          />
                          <div className="flex gap-3 mt-4">
                            <button
                              type="button"
                              onClick={() => setExpandedJob(null)}
                              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition"
                            >
                              {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Submitting...
                                </span>
                              ) : (
                                "Submit Application"
                              )}
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </div>

                    {/* Job Footer */}
                    <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          Posted {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiEye className="w-4 h-4" />
                          {Math.floor(Math.random() * 100)} views
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4 text-6xl">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagedJobs.length > 0 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-600">
                Showing {start + 1} to {Math.min(end, filteredJobs.length)} of{" "}
                {filteredJobs.length} jobs
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={uiPage === 1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (uiPage <= 3) {
                      pageNum = i + 1;
                    } else if (uiPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = uiPage - 2 + i;
                    }

                    return pageNum <= totalPages ? (
                      <button
                        key={i}
                        onClick={() => {
                          setUiPage(pageNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-10 h-10 rounded-lg transition ${
                          uiPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ) : null;
                  })}

                  {totalPages > 5 && uiPage < totalPages - 2 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => {
                          setUiPage(totalPages);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-10 h-10 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={loading || (uiPage >= totalPages && !serverHasMore)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <FaChevronDown className="w-4 h-4 rotate-90" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex lg:hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="bg-white w-4/5 max-w-sm h-full overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <MultiSelectFilter
                  label="Job Type"
                  field="jobType"
                  options={jobTypes}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  filterOpen={filterOpen}
                  setFilterOpen={setFilterOpen}
                />

                <MultiSelectFilter
                  label="Location"
                  field="location"
                  options={indianStates}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  filterOpen={filterOpen}
                  setFilterOpen={setFilterOpen}
                />

                <MultiSelectFilter
                  label="Skills"
                  field="skills"
                  options={skills}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  filterOpen={filterOpen}
                  setFilterOpen={setFilterOpen}
                />

                <MultiSelectFilter
                  label="Duration"
                  field="duration"
                  options={durations}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  filterOpen={filterOpen}
                  setFilterOpen={setFilterOpen}
                />

                <MultiSelectFilter
                  label="Experience"
                  field="experience"
                  options={experiences}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  filterOpen={filterOpen}
                  setFilterOpen={setFilterOpen}
                />

                <div className="sticky bottom-0 bg-white pt-6 border-t">
                  <button
                    onClick={clearAllFilters}
                    className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </motion.div>
            <div
              className="flex-1"
              onClick={() => setMobileFilterOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobPage;

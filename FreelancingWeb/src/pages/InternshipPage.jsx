import React, { useEffect, useMemo, useState, useCallback } from "react";
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

const INDIAN_STATES = [
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

const ITEMS_PER_PAGE = 21;

const DropdownFilter = ({ label, field, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 pb-2">
      <button
        onClick={() => setOpen((v) => !v)}
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
                checked={value === opt}
                onChange={(e) => onChange(field, e.target.value)}
                className="mr-2"
              />
              <label>{opt}</label>
            </div>
          ))}
          <button
            className="text-sm text-blue-600 mt-1"
            onClick={() => onChange(field, "")}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

const InternshipPage = () => {
  // Accumulated jobs fetched from server (we append server pages)
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI pagination (exactly 20 per page)
  const [uiPage, setUiPage] = useState(1);

  // Server pagination (when UI needs more data, we fetch next server page)
  const [serverPage, setServerPage] = useState(1);
  const [serverHasMore, setServerHasMore] = useState(true);

  // Filters (single-select dropdowns here)
  const [filters, setFilters] = useState({
    location: "",
    skills: "",
    duration: "",
    experience: "",
  });

  // Applications & apply flow
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // -------- Fetch applications once (on mount / token change) --------
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

  // -------- Build server params from filters --------
  const buildParams = useCallback(
    (page) => {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        jobType: "Internship",
      };
      if (filters.location) params.location = filters.location;
      if (filters.skills) params.skills = filters.skills;
      if (filters.duration) params.duration = filters.duration;
      if (filters.experience) params.experience = filters.experience;
      return params;
    },
    [filters]
  );

  // -------- Fetch a page from the server and append --------
  const fetchServerPage = useCallback(
    async (pageToFetch) => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://freelancingweb-plac.onrender.com/api/jobs/all",
          { params: buildParams(pageToFetch), withCredentials: true }
        );

        let incoming = Array.isArray(res.data)
          ? res.data
          : res.data?.jobs || [];

        // Normalize location to "Remote" if it's not in the list
        incoming = incoming.map((job) => ({
          ...job,
          location: INDIAN_STATES.includes(job.location)
            ? job.location
            : "Remote",
        }));

        setInternships((prev) => {
          const seen = new Set(prev.map((j) => j._id));
          const deduped = incoming.filter((j) => !seen.has(j._id));
          return [...prev, ...deduped];
        });

        setServerHasMore(incoming.length === ITEMS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching internships:", err);
        toast.error("Failed to load internships.");
      } finally {
        setLoading(false);
      }
    },
    [buildParams]
  );

  // -------- Initial load & when filters change: reset everything --------
  useEffect(() => {
    const resetAndFetch = async () => {
      setInternships([]);
      setUiPage(1);
      setServerPage(1);
      setServerHasMore(true);
      await fetchServerPage(1);
    };
    resetAndFetch();
  }, [filters, fetchServerPage]);

  // -------- Derived filter options from currently loaded internships --------
  const skillOptions = useMemo(
    () => [
      ...new Set(
        internships.flatMap((j) =>
          Array.isArray(j.skillsRequired) ? j.skillsRequired : []
        )
      ),
    ],
    [internships]
  );
  const durationOptions = useMemo(
    () => [...new Set(internships.map((j) => j.duration).filter(Boolean))],
    [internships]
  );
  const experienceOptions = useMemo(
    () => [...new Set(internships.map((j) => j.experience).filter(Boolean))],
    [internships]
  );

  // -------- Client-side filtered list (in case backend didn't filter some fields) --------
  const clientFiltered = useMemo(() => {
    return internships.filter((job) => {
      const locOk = !filters.location || job.location === filters.location;
      const durOk = !filters.duration || job.duration === filters.duration;
      const expOk =
        !filters.experience || job.experience === filters.experience;
      const skillOk =
        !filters.skills ||
        (Array.isArray(job.skillsRequired) &&
          job.skillsRequired.includes(filters.skills));
      // Ensure Internship only (defensive)
      const typeOk = job.jobType === "Internship";
      return locOk && durOk && expOk && skillOk && typeOk;
    });
  }, [internships, filters]);

  // -------- UI pagination over clientFiltered --------
  const totalPages = Math.max(
    1,
    Math.ceil(clientFiltered.length / ITEMS_PER_PAGE)
  );
  const start = (uiPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pagedInternships = clientFiltered.slice(start, end);

  // Keep uiPage in range
  useEffect(() => {
    if (uiPage > totalPages) setUiPage(totalPages);
    if (uiPage < 1) setUiPage(1);
  }, [uiPage, totalPages]);

  // -------- Handlers --------
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

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

  const handlePrev = () => {
    setUiPage((p) => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = async () => {
    // If next UI page exists locally, just page forward
    if (uiPage < totalPages) {
      setUiPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Otherwise, try to fetch another server page if available
    if (serverHasMore && !loading) {
      const nextServer = serverPage + 1;
      await fetchServerPage(nextServer);
      setServerPage(nextServer);
      // after fetch, if new items added, advance one UI page
      setTimeout(() => {
        const newTotal = Math.max(
          1,
          Math.ceil(clientFiltered.length / ITEMS_PER_PAGE)
        );
        if (uiPage < newTotal) {
          setUiPage((p) => p + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (!serverHasMore) {
          toast.info("No more internships to show.");
        }
      }, 0);
    } else {
      toast.info("No more internships to show.");
    }
  };

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
            options={INDIAN_STATES}
            value={filters.location}
            onChange={handleFilterChange}
          />
          <DropdownFilter
            label="Skills"
            field="skills"
            options={skillOptions}
            value={filters.skills}
            onChange={handleFilterChange}
          />
          <DropdownFilter
            label="Duration"
            field="duration"
            options={durationOptions}
            value={filters.duration}
            onChange={handleFilterChange}
          />
          <DropdownFilter
            label="Experience"
            field="experience"
            options={experienceOptions}
            value={filters.experience}
            onChange={handleFilterChange}
          />
        </div>

        {/* Internships list */}
        <div className="flex-1 p-4">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {loading && internships.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-xl h-40 animate-pulse"
                />
              ))
            ) : pagedInternships.length > 0 ? (
              pagedInternships.map((job) => {
                const alreadyApplied = appliedJobIds.includes(job._id);
                const isExpanded = expandedJob && expandedJob._id === job._id;
                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
                  >
                    <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {(job.description || "").slice(0, 120)}...
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
              })
            ) : (
              <p className="text-gray-700 col-span-full text-center">
                No internships found with selected filters.
              </p>
            )}
          </div>

          {/* UI Pagination (exactly 20 items per page) */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={uiPage === 1}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="font-medium">
              Page {uiPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              className="bg-gray-300 px-4 py-2 rounded"
              disabled={loading && !serverHasMore && uiPage >= totalPages}
            >
              Next
            </button>
          </div>

          {!loading && pagedInternships.length === 0 && serverHasMore && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Try changing filters.
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
              options={INDIAN_STATES}
              value={filters.location}
              onChange={handleFilterChange}
            />
            <DropdownFilter
              label="Skills"
              field="skills"
              options={skillOptions}
              value={filters.skills}
              onChange={handleFilterChange}
            />
            <DropdownFilter
              label="Duration"
              field="duration"
              options={durationOptions}
              value={filters.duration}
              onChange={handleFilterChange}
            />
            <DropdownFilter
              label="Experience"
              field="experience"
              options={experienceOptions}
              value={filters.experience}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default InternshipPage;

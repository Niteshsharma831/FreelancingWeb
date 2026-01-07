import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  Pencil,
  Eye,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import freelancerApi from "../../services/freelancerAxiosService";

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [freelancerName, setFreelancerName] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    expired: 0,
  });
  const navigate = useNavigate();

  // Base URLs for both environments
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://freelancingweb-plac.onrender.com/api"
      : "http://localhost:5000/api";

  const fetchFreelancer = async () => {
    try {
      // Try to get freelancer user from localStorage first
      const freelancerUser = JSON.parse(
        localStorage.getItem("freelancer_user") || "{}"
      );
      if (freelancerUser.name) {
        setFreelancerName(freelancerUser.name);
        return;
      }

      // Fallback to API call
      const token = localStorage.getItem("freelancer_token");
      if (!token) {
        console.warn("No freelancer token found");
        return;
      }

      const res = await axios.get(`${BASE_URL}/freelancers/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFreelancerName(res.data.name);
    } catch (err) {
      console.error("Failed to fetch freelancer", err);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("freelancer_token");
      if (!token) {
        toast.error("Please login as a freelancer first");
        navigate("/freelancer-auth");
        return;
      }

      console.log("Fetching jobs with token:", token ? "Present" : "Missing");

      // Try multiple endpoints
      let response;

      // Option 1: Try freelancer-specific endpoint
      try {
        response = await freelancerApi.get("/jobs");
        console.log("✅ Jobs fetched via freelancerApi:", response.data);
      } catch (error1) {
        console.log(
          "Freelancer API failed, trying regular API...",
          error1.message
        );

        // Option 2: Try regular API with freelancer token
        try {
          response = await axios.get(`${BASE_URL}/jobs/my-jobs`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("✅ Jobs fetched via regular API:", response.data);
        } catch (error2) {
          console.log(
            "Regular API failed, trying jobs endpoint...",
            error2.message
          );

          // Option 3: Try /jobs endpoint
          try {
            response = await axios.get(`${BASE_URL}/jobs`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("✅ Jobs fetched via /jobs endpoint:", response.data);
          } catch (error3) {
            console.error("All endpoints failed:", error3.message);
            throw error3;
          }
        }
      }

      const jobsData = response.data || [];
      setJobs(jobsData);

      // Calculate stats
      const now = new Date();
      const activeJobs = jobsData.filter((job) => {
        if (!job.applicationDeadline) return true;
        const deadline = new Date(job.applicationDeadline);
        return deadline > now;
      });

      setStats({
        total: jobsData.length,
        active: activeJobs.length,
        draft: jobsData.filter((job) => job.status === "draft").length,
        expired: jobsData.length - activeJobs.length,
      });
    } catch (err) {
      console.error("Job fetch error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("freelancer_token");
        localStorage.removeItem("freelancer_user");
        navigate("/freelancer-auth");
      } else {
        toast.error("Failed to load jobs. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this job? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("freelancer_token");

      // Try multiple delete endpoints
      let success = false;

      // Option 1: Try freelancer API
      try {
        await freelancerApi.delete(`/jobs/${jobId}`);
        success = true;
      } catch (error1) {
        console.log("Freelancer delete failed, trying regular API...");

        // Option 2: Try regular API
        try {
          await axios.delete(`${BASE_URL}/jobs/delete/${jobId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          success = true;
        } catch (error2) {
          console.log("Regular delete failed, trying jobs endpoint...");

          // Option 3: Try /jobs endpoint
          try {
            await axios.delete(`${BASE_URL}/jobs/${jobId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            success = true;
          } catch (error3) {
            throw error3;
          }
        }
      }

      if (success) {
        toast.success("✅ Job deleted successfully");
        fetchJobs(); // Refresh the list
      }
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.status === 401) {
        toast.error("You are not authorized to delete this job");
      } else if (err.response?.status === 404) {
        toast.error("Job not found");
      } else {
        toast.error("Failed to delete job. Please try again.");
      }
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/FreelancerDashboard/edit-job/${jobId}`);
  };

  const handleViewApplications = (jobId) => {
    navigate(`/FreelancerDashboard/applications?jobId=${jobId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getJobStatus = (job) => {
    if (!job.applicationDeadline) return "active";
    const deadline = new Date(job.applicationDeadline);
    const now = new Date();
    return deadline > now ? "active" : "expired";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    fetchFreelancer();
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <Helmet>
        <title>Manage Jobs | Freelancer Dashboard</title>
      </Helmet>

      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Your Jobs
            </h1>
            {freelancerName && (
              <p className="text-gray-600">
                Welcome back,{" "}
                <span className="font-semibold text-blue-600">
                  {freelancerName}
                </span>
                ! Here are all your posted jobs.
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/FreelancerDashboard/post-job")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md hover:shadow-lg"
          >
            + Post New Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Draft Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expired Jobs</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.expired}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Posted Jobs
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage, edit, or delete your job postings
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="mx-auto text-gray-300" size={64} />
            <h3 className="mt-4 text-xl font-semibold text-gray-700">
              No Jobs Posted Yet
            </h3>
            <p className="text-gray-500 mt-2">
              Get started by posting your first job opportunity!
            </p>
            <button
              onClick={() => navigate("/FreelancerDashboard/post-job")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map((job) => {
              const status = getJobStatus(job);
              return (
                <div
                  key={job._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {job.companyLogo && (
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="w-12 h-12 rounded-lg object-cover border"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                status
                              )}`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Briefcase size={14} />
                              <span>{job.companyName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{job.location || "Remote"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>
                                {job.ctc
                                  ? `₹${job.ctc.toLocaleString()}`
                                  : job.stipend
                                  ? `₹${job.stipend.toLocaleString()}/month`
                                  : "Salary not specified"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>
                                Deadline: {formatDate(job.applicationDeadline)}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 line-clamp-2">
                            {job.description || "No description provided."}
                          </p>

                          {job.skillsRequired &&
                            job.skillsRequired.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {job.skillsRequired
                                  .slice(0, 4)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                {job.skillsRequired.length > 4 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{job.skillsRequired.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewApplications(job._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
                        title="View Applications"
                      >
                        <Eye size={16} />
                        Applications
                      </button>
                      <button
                        onClick={() => handleEdit(job._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium"
                        title="Edit Job"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium"
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-1">
            <Briefcase size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800">
              Tips for Managing Jobs
            </h4>
            <ul className="text-blue-700 text-sm mt-1 space-y-1">
              <li>
                • Keep job descriptions updated to attract the right candidates
              </li>
              <li>• Monitor application deadlines to keep jobs active</li>
              <li>• Edit job details if requirements change</li>
              <li>• Remove expired jobs to keep your dashboard clean</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJobsPage;





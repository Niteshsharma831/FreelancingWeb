import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Loader, AlertCircle } from "lucide-react";
import freelancerApi from "../../services/freelancerAxiosService";

const EditJobPage = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    companyWebsite: "",
    companyLogo: "",
    jobType: "Job",
    jobMode: "Remote",
    location: "",
    category: "",
    duration: "",
    stipend: "",
    ctc: "",
    budget: "",
    applicationDeadline: "",
    contactEmail: "",
    description: "",
    details: "",
    skillsRequired: [""],
    responsibilities: [""],
    requirements: [""],
    preferredQualifications: [""],
    perks: [""],
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Base URLs for both environments
  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://freelancingweb-plac.onrender.com/api"
      : "http://localhost:5000/api";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("freelancer_token");
        if (!token) {
          toast.error("Please login as a freelancer first");
          navigate("/freelancer-auth");
          return;
        }

        console.log("🔍 Fetching job with ID:", jobId);
        console.log("🔑 Token exists:", !!token);

        let response;
        let endpointUsed = "";

        // Option 1: Try freelancer-specific endpoint
        try {
          endpointUsed = "freelancerApi /jobs/:id";
          response = await freelancerApi.get(`/jobs/${jobId}`);
          console.log("✅ Job fetched via freelancerApi:", response.data);
        } catch (error1) {
          console.log("❌ Freelancer API failed:", error1.message);

          // Option 2: Try regular API with freelancer token
          try {
            endpointUsed = `/api/jobs/jobbyid/${jobId}`;
            response = await axios.get(`${BASE_URL}/jobs/jobbyid/${jobId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("✅ Job fetched via regular API:", response.data);
          } catch (error2) {
            console.log("❌ Regular API failed:", error2.message);

            // Option 3: Try /jobs/:id endpoint
            try {
              endpointUsed = `/api/jobs/${jobId}`;
              response = await axios.get(`${BASE_URL}/jobs/${jobId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(
                "✅ Job fetched via /jobs/:id endpoint:",
                response.data
              );
            } catch (error3) {
              console.log("❌ All endpoints failed:", error3.message);
              throw error3;
            }
          }
        }

        if (!response || !response.data) {
          throw new Error("No job data received");
        }

        const job = response.data;
        console.log("📋 Job data received:", job);

        const format = (arr) => {
          if (!arr) return [""];
          if (Array.isArray(arr)) return arr.length > 0 ? arr : [""];
          if (typeof arr === "string")
            return arr
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s);
          return [""];
        };

        setFormData({
          title: job.title || "",
          companyName: job.companyName || "",
          companyWebsite: job.companyWebsite || "",
          companyLogo: job.companyLogo || "",
          jobType: job.jobType || "Job",
          jobMode: job.jobMode || "Remote",
          location: job.location || "",
          category: job.category || "",
          duration: job.duration || "",
          stipend: job.stipend || "",
          ctc: job.ctc || "",
          budget: job.budget || "",
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline).toISOString().split("T")[0]
            : "",
          contactEmail: job.contactEmail || "",
          description: job.description || "",
          details: job.details || "",
          skillsRequired: format(job.skillsRequired),
          responsibilities: format(job.responsibilities),
          requirements: format(job.requirements),
          preferredQualifications: format(job.preferredQualifications),
          perks: format(job.perks),
        });
      } catch (err) {
        console.error("❌ Fetch job error:", err);
        setError(err.response?.data?.error || "Failed to load job");

        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("freelancer_token");
          localStorage.removeItem("freelancer_user");
          navigate("/freelancer-auth");
        } else if (err.response?.status === 404) {
          toast.error("Job not found. It may have been deleted.");
          navigate("/FreelancerDashboard/manage-jobs");
        } else {
          toast.error(err.response?.data?.error || "❌ Failed to load job");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, navigate, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const handleAddField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveField = (field, index) => {
    if (formData[field].length <= 1) return; // Keep at least one field
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const validateForm = () => {
    const {
      title,
      companyName,
      location,
      duration,
      description,
      contactEmail,
      jobType,
      ctc,
      stipend,
    } = formData;

    if (
      !title ||
      !companyName ||
      !location ||
      !duration ||
      !description ||
      !contactEmail
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    if (jobType === "Job" && !ctc) {
      toast.error("CTC is required for Job type.");
      return false;
    }

    if (jobType === "Internship" && !stipend) {
      toast.error("Stipend is required for Internship type.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setUpdating(true);
    setError(null);

    try {
      const token = localStorage.getItem("freelancer_token");
      if (!token) {
        toast.error("Please login as a freelancer first");
        navigate("/freelancer-auth");
        return;
      }

      console.log("🔄 Updating job:", jobId);

      // Prepare payload
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        responsibilities: formData.responsibilities
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        requirements: formData.requirements
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        preferredQualifications: formData.preferredQualifications
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        perks: formData.perks.map((s) => s.trim()).filter((s) => s !== ""),
        stipend: formData.stipend ? Number(formData.stipend) : undefined,
        ctc: formData.ctc ? Number(formData.ctc) : undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
      };

      console.log("📤 Payload:", payload);

      let success = false;
      let endpointUsed = "";

      // Option 1: Try PUT to update endpoint
      try {
        endpointUsed = `${BASE_URL}/jobs/update/${jobId}`;
        await axios.put(endpointUsed, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        success = true;
      } catch (error1) {
        console.log("❌ PUT /update failed:", error1.message);

        // Option 2: Try PATCH
        try {
          endpointUsed = `${BASE_URL}/jobs/${jobId}`;
          await axios.patch(endpointUsed, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          success = true;
        } catch (error2) {
          console.log("❌ PATCH failed:", error2.message);

          // Option 3: Try freelancer API
          try {
            endpointUsed = "freelancerApi /jobs/:id";
            await freelancerApi.put(`/jobs/${jobId}`, payload);
            success = true;
          } catch (error3) {
            console.log("❌ freelancerApi failed:", error3.message);
            throw error3;
          }
        }
      }

      if (success) {
        console.log("✅ Job updated successfully");
        toast.success("✅ Job updated successfully!");

        // Redirect after short delay
        setTimeout(() => {
          navigate("/FreelancerDashboard/manage-jobs");
        }, 1000);
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      setError(err.response?.data?.error || "Failed to update job");

      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("freelancer_token");
        navigate("/freelancer-auth");
      } else if (err.response?.status === 403) {
        toast.error("You don't have permission to update this job.");
      } else if (err.response?.status === 404) {
        toast.error("Job not found. It may have been deleted.");
      } else if (err.response?.status === 400) {
        toast.error("Invalid data. Please check all fields.");
      } else {
        toast.error(err.response?.data?.error || "❌ Failed to update job");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate("/FreelancerDashboard/manage-jobs");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-red-800">
                Error Loading Job
              </h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate("/FreelancerDashboard/manage-jobs")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Manage Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stringFields = [
    { name: "title", label: "Job Title", required: true },
    { name: "companyName", label: "Company Name", required: true },
    { name: "companyWebsite", label: "Company Website", required: false },
    { name: "companyLogo", label: "Company Logo URL", required: false },
    { name: "location", label: "Location", required: true },
    { name: "category", label: "Category", required: true },
    { name: "duration", label: "Duration", required: true },
    { name: "stipend", label: "Stipend (for internships)", required: false },
    { name: "ctc", label: "CTC (for jobs)", required: false },
    { name: "budget", label: "Budget", required: false },
    {
      name: "contactEmail",
      label: "Contact Email",
      required: true,
      type: "email",
    },
  ];

  const largeFields = [
    { name: "description", label: "Job Description", required: true },
    { name: "details", label: "Job Details", required: false },
  ];

  const arrayFields = [
    { name: "skillsRequired", label: "Skills Required", required: true },
    { name: "responsibilities", label: "Responsibilities", required: false },
    { name: "requirements", label: "Requirements", required: false },
    {
      name: "preferredQualifications",
      label: "Preferred Qualifications",
      required: false,
    },
    { name: "perks", label: "Perks & Benefits", required: false },
  ];

  const selectFields = [
    {
      name: "jobType",
      label: "Job Type",
      required: true,
      options: ["Job", "Internship", "Contract", "Part-time"],
    },
    {
      name: "jobMode",
      label: "Job Mode",
      required: true,
      options: ["Remote", "Hybrid", "Onsite"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Editing Job</h3>
              <p className="text-blue-700 text-sm">
                Update the details of your job posting. All changes will be
                visible to applicants immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="max-w-6xl mx-auto space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stringFields.map(({ name, label, required, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder={label}
                  required={required}
                />
              </div>
            ))}

            {selectFields.map(({ name, label, required, options }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <select
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required={required}
                >
                  <option value="">Select {label}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Job Description & Details
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {largeFields.map(({ name, label, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  rows={required ? 6 : 4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                  placeholder={label}
                  required={required}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lists */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Lists & Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {arrayFields.map(({ name, label, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="space-y-3">
                  {formData[name].map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(name, index, e.target.value)
                        }
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder={`${label} ${index + 1}`}
                        required={required && index === 0}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveField(name, index)}
                        disabled={formData[name].length <= 1}
                        className={`px-3 rounded-lg ${
                          formData[name].length <= 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddField(name)}
                  className="mt-3 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                >
                  + Add {label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={updating}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <>
                <Loader className="animate-spin" size={20} />
                Updating...
              </>
            ) : (
              <>
                <Save size={20} />
                Update Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axiosservice";
import toast from "react-hot-toast";

const EditJobPage = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/jobs/jobbyid/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const job = res.data;

        const format = (arr) => (Array.isArray(arr) ? arr : []);
        setFormData({
          ...job,
          skillsRequired: format(job.skillsRequired),
          responsibilities: format(job.responsibilities),
          requirements: format(job.requirements),
          preferredQualifications: format(job.preferredQualifications),
          perks: format(job.perks),
        });
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.error || "❌ Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

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
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired.map((s) => s.trim()),
        responsibilities: formData.responsibilities.map((s) => s.trim()),
        requirements: formData.requirements.map((s) => s.trim()),
        preferredQualifications: formData.preferredQualifications.map((s) =>
          s.trim()
        ),
        perks: formData.perks.map((s) => s.trim()),
      };

      await api.put(`/api/jobs/update/${jobId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Job updated successfully!");
      navigate("/FreelancerDashboard/manage-jobs");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "❌ Failed to update job");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading job data...</div>
    );
  if (!formData)
    return <div className="p-6 text-center text-red-500">Job not found</div>;

  const stringFields = [
    { name: "title", label: "Job Title" },
    { name: "companyName", label: "Company Name" },
    { name: "companyWebsite", label: "Company Website" },
    { name: "companyLogo", label: "Company Logo URL" },
    { name: "jobType", label: "Job Type" },
    { name: "jobMode", label: "Job Mode" },
    { name: "location", label: "Location" },
    { name: "category", label: "Category" },
    { name: "duration", label: "Duration" },
    { name: "stipend", label: "Stipend" },
    { name: "ctc", label: "CTC" },
    { name: "budget", label: "Budget" },
    { name: "applicationDeadline", label: "Application Deadline" },
    { name: "contactEmail", label: "Contact Email" },
  ];

  const largeFields = [
    { name: "description", label: "Job Description" },
    { name: "details", label: "Job Details" },
  ];

  const arrayFields = [
    { name: "skillsRequired", label: "Skills Required" },
    { name: "responsibilities", label: "Responsibilities" },
    { name: "requirements", label: "Requirements" },
    { name: "preferredQualifications", label: "Preferred Qualifications" },
    { name: "perks", label: "Perks" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">✏️ Edit Job</h1>

      <form onSubmit={handleUpdate} className="space-y-10">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            🗂 Basic Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stringFields.map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                  placeholder={label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            📝 Details
          </h2>
          <div className="grid grid-cols-1 gap-5">
            {largeFields.map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <textarea
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                  placeholder={label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lists */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            📋 Lists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {arrayFields.map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <div className="space-y-2">
                  {formData[name].map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(name, index, e.target.value)
                      }
                      className="w-full border p-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                      placeholder={`${label} ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddField(name)}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  + Add More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold rounded-lg shadow transition duration-200"
          >
            {updating ? "Updating..." : "✅ Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobPage;

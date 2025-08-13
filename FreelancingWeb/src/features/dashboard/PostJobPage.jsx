import React, { useState } from "react";
import api from "../../services/axiosservice";

// Reusable Label
const Label = ({ text, required = false }) => (
  <label className="block mb-1 font-medium text-gray-700">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

// Reusable Input
const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    {...props}
  />
);

// Reusable Textarea
const Textarea = ({ rows = 3, ...props }) => (
  <textarea
    rows={rows}
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    {...props}
  />
);

const JobPostForm = () => {
  const [loading, setLoading] = useState(false);
  // All required fields, including those with comma-separated input
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    companyWebsite: "",
    companyLogo: "",
    jobType: "Job", // "Job" or "Internship"
    jobMode: "Remote", // "Remote", "Hybrid", "Onsite"
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
    skillsRequired: "", // comma separated (e.g., "JavaScript,React")
    responsibilities: "", // comma separated
    requirements: "", // comma separated
    preferredQualifications: "", // comma separated
    perks: "", // comma separated
  });

  // Handle changes for simple inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Parse comma-separated string into an array (trimming spaces)
  const parseToArray = (str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

  // Basic form validation: check required fields
  const validateForm = () => {
    const {
      title,
      companyName,
      location,
      duration,
      jobType,
      jobMode,
      description,
      skillsRequired,
      contactEmail,
      // For Job type, ctc must be provided;
      // for Internship, stipend must be provided.
      ctc,
      stipend,
    } = formData;

    if (
      !title ||
      !companyName ||
      !location ||
      !duration ||
      !description ||
      !skillsRequired ||
      !contactEmail
    ) {
      alert("Please fill in all required fields.");
      return false;
    }
    if (jobType === "Job" && !ctc) {
      alert("CTC is required for Job type.");
      return false;
    }
    if (jobType === "Internship" && !stipend) {
      alert("Stipend is required for Internship type.");
      return false;
    }
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        skillsRequired: parseToArray(formData.skillsRequired),
        responsibilities: parseToArray(formData.responsibilities),
        requirements: parseToArray(formData.requirements),
        preferredQualifications: parseToArray(formData.preferredQualifications),
        perks: parseToArray(formData.perks),
        // Convert numeric fields
        stipend: formData.stipend ? Number(formData.stipend) : undefined,
        ctc: formData.ctc ? Number(formData.ctc) : undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
      };

      await api.post("/api/jobs/create", payload, {
        withCredentials: true,
      });
      alert("Job posted successfully!");

      // Reset form after success
      setFormData({
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
        skillsRequired: "",
        responsibilities: "",
        requirements: "",
        preferredQualifications: "",
        perks: "",
      });
    } catch (err) {
      console.error("Error:", err);
      alert(err?.response?.data?.error || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Title, Company Name, Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label text="Job Title" required />
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label text="Company Name" required />
            <Input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label text="Location" required />
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 2: Company Website, Company Logo, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label text="Company Website" />
            <Input
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label text="Company Logo URL" />
            <Input
              name="companyLogo"
              value={formData.companyLogo}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label text="Category" required />
            <Input
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 3: Job Type, Job Mode, Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label text="Job Type" required />
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Job</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <Label text="Job Mode" required />
            <select
              name="jobMode"
              value={formData.jobMode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
          </div>
          <div>
            <Label text="Duration" required />
            <Input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 4: Stipend / CTC and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formData.jobType === "Internship" && (
            <div>
              <Label text="Stipend" required />
              <Input
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
              />
            </div>
          )}
          {formData.jobType === "Job" && (
            <div>
              <Label text="CTC" required />
              <Input
                type="number"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
              />
            </div>
          )}
          <div>
            <Label text="Budget" />
            <Input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 5: Application Deadline and Contact Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Application Deadline" required />
            <Input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label text="Contact Email" required />
            <Input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 6: Skills Required */}
        <div>
          <Label text="Skills Required (comma separated)" required />
          <Input
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js"
          />
        </div>

        {/* Row 7: Description */}
        <div>
          <Label text="Description" required />
          <Textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Row 8: Details */}
        <div>
          <Label text="Details (Optional)" />
          <Textarea
            name="details"
            rows={3}
            value={formData.details}
            onChange={handleChange}
          />
        </div>

        {/* Row 9: Responsibilities */}
        <div>
          <Label text="Responsibilities (comma separated)" />
          <Input
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            placeholder="e.g., Develop UI, Fix bugs"
          />
        </div>

        {/* Row 10: Requirements */}
        <div>
          <Label text="Requirements (comma separated)" />
          <Input
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="e.g., 2+ years experience, Bachelor's degree"
          />
        </div>

        {/* Row 11: Preferred Qualifications */}
        <div>
          <Label text="Preferred Qualifications (comma separated)" />
          <Input
            name="preferredQualifications"
            value={formData.preferredQualifications}
            onChange={handleChange}
          />
        </div>

        {/* Row 12: Perks */}
        <div>
          <Label text="Perks (comma separated)" />
          <Input
            name="perks"
            value={formData.perks}
            onChange={handleChange}
            placeholder="e.g., Health Insurance, Paid Time Off"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;

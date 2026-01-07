// import React, { useState, useEffect } from "react";
// import freelancerApi from "../../services/freelancerAxiosService";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Reusable Label
// const Label = ({ text, required = false }) => (
//   <label className="block mb-1 font-medium text-gray-700">
//     {text} {required && <span className="text-red-500">*</span>}
//   </label>
// );

// // Reusable Input
// const Input = ({ type = "text", ...props }) => (
//   <input
//     type={type}
//     className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//     {...props}
//   />
// );

// // Reusable Textarea
// const Textarea = ({ rows = 3, ...props }) => (
//   <textarea
//     rows={rows}
//     className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//     {...props}
//   />
// );

// const JobPostForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [testingEndpoints, setTestingEndpoints] = useState(false);
//   const [apiStatus, setApiStatus] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     companyName: "",
//     companyWebsite: "",
//     companyLogo: "",
//     jobType: "Job",
//     jobMode: "Remote",
//     location: "",
//     category: "",
//     duration: "",
//     stipend: "",
//     ctc: "",
//     budget: "",
//     applicationDeadline: "",
//     contactEmail: "",
//     description: "",
//     details: "",
//     skillsRequired: "",
//     responsibilities: "",
//     requirements: "",
//     preferredQualifications: "",
//     perks: "",
//   });

//   // Set minimum date for application deadline
//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     if (!formData.applicationDeadline) {
//       setFormData((prev) => ({ ...prev, applicationDeadline: today }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const parseToArray = (str) =>
//     str
//       .split(",")
//       .map((s) => s.trim())
//       .filter((s) => s !== "");

//   const validateForm = () => {
//     const {
//       title,
//       companyName,
//       location,
//       duration,
//       description,
//       skillsRequired,
//       contactEmail,
//       jobType,
//       ctc,
//       stipend,
//       applicationDeadline,
//     } = formData;

//     // Check all required fields
//     const requiredFields = {
//       "Job Title": title,
//       "Company Name": companyName,
//       Location: location,
//       Duration: duration,
//       Description: description,
//       "Skills Required": skillsRequired,
//       "Contact Email": contactEmail,
//       "Application Deadline": applicationDeadline,
//     };

//     const missingFields = Object.entries(requiredFields)
//       .filter(([_, value]) => !value)
//       .map(([key]) => key);

//     if (missingFields.length > 0) {
//       toast.error(`Missing required fields: ${missingFields.join(", ")}`);
//       return false;
//     }

//     // Job type specific validations
//     if (jobType === "Job" && !ctc) {
//       toast.error("CTC is required for Job type.");
//       return false;
//     }
//     if (jobType === "Internship" && !stipend) {
//       toast.error("Stipend is required for Internship type.");
//       return false;
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(contactEmail)) {
//       toast.error("Please enter a valid email address.");
//       return false;
//     }

//     // Validate date
//     const selectedDate = new Date(applicationDeadline);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     if (selectedDate < today) {
//       toast.error("Application deadline cannot be in the past.");
//       return false;
//     }

//     return true;
//   };

//   const testEndpoints = async () => {
//     setTestingEndpoints(true);
//     const endpoints = [
//       "/jobs/all", // GET - should work
//       "/jobs/create", // POST - check if route exists
//       "/jobs/my-jobs", // GET - should work for auth users
//       "/create", // Try without /jobs prefix
//       "/jobs", // Root jobs endpoint
//     ];

//     const results = [];

//     for (const endpoint of endpoints) {
//       try {
//         // Use GET for testing most endpoints
//         const response = await freelancerApi.get(endpoint);
//         results.push({
//           endpoint,
//           method: "GET",
//           status: "✅ Working",
//           statusCode: response.status,
//         });
//       } catch (err) {
//         // If GET fails, it might be a POST-only endpoint
//         if (err.response?.status === 405 || err.response?.status === 404) {
//           try {
//             // Try POST with minimal data
//             const postResponse = await freelancerApi.post(endpoint, {
//               test: true,
//             });
//             results.push({
//               endpoint,
//               method: "POST",
//               status: "✅ Working",
//               statusCode: postResponse.status,
//             });
//           } catch (postErr) {
//             results.push({
//               endpoint,
//               method: "POST",
//               status: err.response
//                 ? `❌ ${err.response.status}`
//                 : "❌ Network Error",
//               statusCode: err.response?.status,
//               message: err.message,
//             });
//           }
//         } else {
//           results.push({
//             endpoint,
//             method: "GET",
//             status: err.response
//               ? `❌ ${err.response.status}`
//               : "❌ Network Error",
//             statusCode: err.response?.status,
//             message: err.message,
//           });
//         }
//       }
//     }

//     setApiStatus(results);
//     setTestingEndpoints(false);

//     console.log("🔍 Endpoint Test Results:");
//     results.forEach((result) => {
//       console.log(`${result.method} ${result.endpoint}: ${result.status}`);
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       // Check if user is authenticated
//       const token = localStorage.getItem("freelancer_token");
//       const freelancerId = localStorage.getItem("freelancerId");

//       if (!token || !freelancerId) {
//         toast.error("You are not logged in. Please login first.");
//         window.location.href = "/freelancer-auth";
//         return;
//       }

//       // Create the payload matching your backend expectations
//       const payload = {
//         title: formData.title,
//         companyName: formData.companyName,
//         companyWebsite: formData.companyWebsite || undefined,
//         companyLogo: formData.companyLogo || undefined,
//         jobType: formData.jobType,
//         jobMode: formData.jobMode,
//         location: formData.location,
//         category: formData.category || undefined,
//         duration: formData.duration,
//         stipend:
//           formData.jobType === "Internship"
//             ? Number(formData.stipend)
//             : undefined,
//         ctc: formData.jobType === "Job" ? Number(formData.ctc) : undefined,
//         contactEmail: formData.contactEmail,
//         description: formData.description,
//         details: formData.details || undefined,
//         skillsRequired: parseToArray(formData.skillsRequired),
//         responsibilities: formData.responsibilities
//           ? parseToArray(formData.responsibilities)
//           : [],
//         requirements: formData.requirements
//           ? parseToArray(formData.requirements)
//           : [],
//         preferredQualifications: formData.preferredQualifications
//           ? parseToArray(formData.preferredQualifications)
//           : [],
//         perks: formData.perks ? parseToArray(formData.perks) : [],
//       };

//       console.log("🚀 Sending POST request to /jobs/create");
//       console.log("Full URL:", freelancerApi.defaults.baseURL + "/jobs/create");
//       console.log("Payload:", JSON.stringify(payload, null, 2));
//       console.log("Token present:", !!token);

//       // Make the request
//       const response = await freelancerApi.post("/jobs/create", payload);

//       console.log("✅ Job created successfully:", response.data);

//       toast.success("Job posted successfully!");

//       // Reset form
//       setFormData({
//         title: "",
//         companyName: "",
//         companyWebsite: "",
//         companyLogo: "",
//         jobType: "Job",
//         jobMode: "Remote",
//         location: "",
//         category: "",
//         duration: "",
//         stipend: "",
//         ctc: "",
//         budget: "",
//         applicationDeadline: new Date().toISOString().split("T")[0],
//         contactEmail: "",
//         description: "",
//         details: "",
//         skillsRequired: "",
//         responsibilities: "",
//         requirements: "",
//         preferredQualifications: "",
//         perks: "",
//       });

//       // Redirect to jobs page after successful post
//       setTimeout(() => {
//         window.location.href = "/freelancer/jobs";
//       }, 1500);
//     } catch (err) {
//       console.error("❌ Job posting error:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//         url: err.config?.url,
//         headers: err.config?.headers,
//       });

//       // Check for specific issues
//       if (err.response?.status === 404) {
//         // Test if the endpoint exists with a simple GET
//         console.log("🔍 Testing endpoint existence...");
//         try {
//           const testResponse = await freelancerApi.get("/create");
//           console.log("GET /create works:", testResponse.status);
//         } catch (getErr) {
//           console.log("GET /create failed:", getErr.response?.status);
//         }

//         try {
//           const testResponse2 = await freelancerApi.get("/jobs");
//           console.log("GET /jobs works:", testResponse2.status);
//         } catch (getErr2) {
//           console.log("GET /jobs failed:", getErr2.response?.status);
//         }

//         toast.error(
//           `Endpoint not found. Tried: ${err.config?.url}\n` +
//             `Check: 1. Backend running 2. Route defined 3. No typos`
//         );
//       } else if (err.response?.status === 401) {
//         toast.error("Authentication failed. Please login again.");
//         localStorage.removeItem("freelancer_token");
//         localStorage.removeItem("freelancer_user");
//         localStorage.removeItem("freelancerId");
//         setTimeout(() => {
//           window.location.href = "/freelancer-auth";
//         }, 2000);
//       } else if (err.response?.status === 403) {
//         toast.error("Only freelancers can post jobs.");
//       } else if (err.response?.status === 400) {
//         const errorMsg =
//           err.response?.data?.error || "Please check your inputs.";
//         toast.error(`Validation error: ${errorMsg}`);
//       } else if (err.message.includes("Network Error")) {
//         toast.error(
//           "Cannot connect to server. Is backend running on port 5000?"
//         );
//       } else {
//         toast.error(
//           err?.response?.data?.error || "Failed to post job. Please try again."
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
//         <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
//         <p className="text-sm text-gray-600 mb-6">
//           Post a job opportunity for freelancers. All fields with{" "}
//           <span className="text-red-500">*</span> are required.
//         </p>

//         {/* Debug Section */}
//         <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-bold text-gray-700">Debug Information</h3>
//             <button
//               type="button"
//               onClick={testEndpoints}
//               disabled={testingEndpoints}
//               className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 disabled:opacity-50"
//             >
//               {testingEndpoints ? "Testing..." : "Test Endpoints"}
//             </button>
//           </div>

//           <div className="text-sm">
//             <p>
//               <strong>Token:</strong>{" "}
//               {localStorage.getItem("freelancer_token")
//                 ? "✅ Present"
//                 : "❌ Missing"}
//             </p>
//             <p>
//               <strong>User ID:</strong>{" "}
//               {localStorage.getItem("freelancerId") || "❌ Missing"}
//             </p>
//             <p>
//               <strong>Base URL:</strong>{" "}
//               {freelancerApi.defaults.baseURL || "Not set"}
//             </p>
//             <p>
//               <strong>Using Endpoint:</strong> POST /jobs/create
//             </p>

//             {apiStatus && (
//               <div className="mt-3">
//                 <p className="font-medium mb-1">Endpoint Status:</p>
//                 <div className="max-h-40 overflow-y-auto">
//                   {apiStatus.map((status, index) => (
//                     <div key={index} className="flex items-center text-xs mb-1">
//                       <span className="w-4">
//                         {status.status.includes("✅") ? "✅" : "❌"}
//                       </span>
//                       <span className="ml-2 font-mono bg-gray-100 px-1 rounded">
//                         {status.method}
//                       </span>
//                       <span className="ml-2 font-mono">{status.endpoint}</span>
//                       <span className="ml-auto text-gray-500">
//                         {status.statusCode || "N/A"}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Row 1 */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label text="Job Title" required />
//               <Input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g., Senior Frontend Developer"
//                 required
//               />
//             </div>
//             <div>
//               <Label text="Company Name" required />
//               <Input
//                 name="companyName"
//                 value={formData.companyName}
//                 onChange={handleChange}
//                 placeholder="e.g., TechCorp Inc."
//                 required
//               />
//             </div>
//             <div>
//               <Label text="Location" required />
//               <Input
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 placeholder="e.g., New York, NY or Remote"
//                 required
//               />
//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label text="Company Website" />
//               <Input
//                 name="companyWebsite"
//                 value={formData.companyWebsite}
//                 onChange={handleChange}
//                 placeholder="https://example.com"
//                 type="url"
//               />
//             </div>
//             <div>
//               <Label text="Company Logo URL" />
//               <Input
//                 name="companyLogo"
//                 value={formData.companyLogo}
//                 onChange={handleChange}
//                 placeholder="https://example.com/logo.png"
//                 type="url"
//               />
//             </div>
//             <div>
//               <Label text="Category" />
//               <Input
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 placeholder="e.g., Software Development"
//               />
//             </div>
//           </div>

//           {/* Row 3 */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label text="Job Type" required />
//               <select
//                 name="jobType"
//                 value={formData.jobType}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 required
//               >
//                 <option value="Job">Job</option>
//                 <option value="Internship">Internship</option>
//               </select>
//             </div>
//             <div>
//               <Label text="Job Mode" required />
//               <select
//                 name="jobMode"
//                 value={formData.jobMode}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 required
//               >
//                 <option value="Remote">Remote</option>
//                 <option value="Hybrid">Hybrid</option>
//                 <option value="Onsite">Onsite</option>
//               </select>
//             </div>
//             <div>
//               <Label text="Duration" required />
//               <Input
//                 name="duration"
//                 value={formData.duration}
//                 onChange={handleChange}
//                 placeholder="e.g., 6 months, Permanent"
//                 required
//               />
//             </div>
//           </div>

//           {/* Row 4 - Conditional based on job type */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {formData.jobType === "Internship" && (
//               <div>
//                 <Label text="Stipend (per month)" required />
//                 <Input
//                   type="number"
//                   name="stipend"
//                   value={formData.stipend}
//                   onChange={handleChange}
//                   placeholder="e.g., 15000"
//                   required
//                   min="0"
//                 />
//               </div>
//             )}
//             {formData.jobType === "Job" && (
//               <div>
//                 <Label text="CTC (per annum)" required />
//                 <Input
//                   type="number"
//                   name="ctc"
//                   value={formData.ctc}
//                   onChange={handleChange}
//                   placeholder="e.g., 1200000"
//                   required
//                   min="0"
//                 />
//               </div>
//             )}
//             <div>
//               <Label text="Contact Email" required />
//               <Input
//                 type="email"
//                 name="contactEmail"
//                 value={formData.contactEmail}
//                 onChange={handleChange}
//                 placeholder="hr@company.com"
//                 required
//               />
//             </div>
//           </div>

//           {/* Row 5: Application Deadline */}
//           <div>
//             <Label text="Application Deadline" required />
//             <Input
//               type="date"
//               name="applicationDeadline"
//               value={formData.applicationDeadline}
//               onChange={handleChange}
//               min={new Date().toISOString().split("T")[0]}
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Note: This field is for display only. Your backend doesn't store
//               this field.
//             </p>
//           </div>

//           {/* Row 6: Skills */}
//           <div>
//             <Label text="Skills Required (comma separated)" required />
//             <Input
//               name="skillsRequired"
//               value={formData.skillsRequired}
//               onChange={handleChange}
//               placeholder="e.g., JavaScript, React, Node.js, MongoDB"
//               required
//             />
//           </div>

//           {/* Row 7: Description */}
//           <div>
//             <Label text="Job Description" required />
//             <Textarea
//               name="description"
//               rows={4}
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Describe the job role, what the candidate will be working on..."
//               required
//             />
//           </div>

//           {/* Row 8: Details */}
//           <div>
//             <Label text="Additional Details (Optional)" />
//             <Textarea
//               name="details"
//               rows={3}
//               value={formData.details}
//               onChange={handleChange}
//               placeholder="Any additional information about the job..."
//             />
//           </div>

//           {/* Row 9: Responsibilities */}
//           <div>
//             <Label text="Responsibilities (comma separated)" />
//             <Input
//               name="responsibilities"
//               value={formData.responsibilities}
//               onChange={handleChange}
//               placeholder="e.g., Develop UI components, Fix bugs, Write tests"
//             />
//           </div>

//           {/* Row 10: Requirements */}
//           <div>
//             <Label text="Requirements (comma separated)" />
//             <Input
//               name="requirements"
//               value={formData.requirements}
//               onChange={handleChange}
//               placeholder="e.g., 2+ years experience, Bachelor's degree in CS"
//             />
//           </div>

//           {/* Row 11: Preferred Qualifications */}
//           <div>
//             <Label text="Preferred Qualifications (comma separated)" />
//             <Input
//               name="preferredQualifications"
//               value={formData.preferredQualifications}
//               onChange={handleChange}
//               placeholder="e.g., Experience with AWS, Knowledge of TypeScript"
//             />
//           </div>

//           {/* Row 12: Perks */}
//           <div>
//             <Label text="Perks & Benefits (comma separated)" />
//             <Input
//               name="perks"
//               value={formData.perks}
//               onChange={handleChange}
//               placeholder="e.g., Health Insurance, Flexible Hours, Remote Work"
//             />
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Posting Job...
//                 </span>
//               ) : (
//                 "Post Job"
//               )}
//             </button>

//             <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-700">
//               <p className="font-medium">Backend Integration Notes:</p>
//               <ul className="list-disc list-inside mt-1">
//                 <li>
//                   Using endpoint:{" "}
//                   <code className="bg-gray-100 px-1 rounded">
//                     POST /jobs/create
//                   </code>
//                 </li>
//                 <li>Authentication: Bearer token required</li>
//                 <li>Job Type: Only "Job" or "Internship" supported</li>
//                 <li>
//                   Fields not in backend model: Budget, Application Deadline
//                   (display only)
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default JobPostForm;
import React, { useState, useEffect } from "react";
import freelancerApi from "../../services/freelancerAxiosService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    contactEmail: "",
    description: "",
    details: "",
    skillsRequired: "",
    responsibilities: "",
    requirements: "",
    preferredQualifications: "",
    perks: "",
    applicationDeadline: "",
  });

  // Set minimum date for application deadline
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!formData.applicationDeadline) {
      setFormData((prev) => ({ ...prev, applicationDeadline: today }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseToArray = (str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

  const validateForm = () => {
    const {
      title,
      companyName,
      location,
      duration,
      description,
      skillsRequired,
      contactEmail,
      jobType,
      ctc,
      stipend,
      applicationDeadline,
    } = formData;

    // Check all required fields
    const requiredFields = {
      "Job Title": title,
      "Company Name": companyName,
      Location: location,
      Duration: duration,
      Description: description,
      "Skills Required": skillsRequired,
      "Contact Email": contactEmail,
      "Application Deadline": applicationDeadline,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    // Job type specific validations
    if (jobType === "Job" && !ctc) {
      toast.error("CTC is required for Job type.");
      return false;
    }
    if (jobType === "Internship" && !stipend) {
      toast.error("Stipend is required for Internship type.");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // Validate date
    const selectedDate = new Date(applicationDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Application deadline cannot be in the past.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Check if user is authenticated
      const token = localStorage.getItem("freelancer_token");
      const freelancerId = localStorage.getItem("freelancerId");

      if (!token || !freelancerId) {
        toast.error("You are not logged in. Please login first.");
        window.location.href = "/freelancer-auth";
        return;
      }

      // Create the payload matching your backend expectations
      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite || undefined,
        companyLogo: formData.companyLogo || undefined,
        jobType: formData.jobType,
        jobMode: formData.jobMode,
        location: formData.location,
        category: formData.category || undefined,
        duration: formData.duration,
        stipend:
          formData.jobType === "Internship"
            ? Number(formData.stipend)
            : undefined,
        ctc: formData.jobType === "Job" ? Number(formData.ctc) : undefined,
        contactEmail: formData.contactEmail,
        description: formData.description,
        details: formData.details || undefined,
        skillsRequired: parseToArray(formData.skillsRequired),
        responsibilities: formData.responsibilities
          ? parseToArray(formData.responsibilities)
          : [],
        requirements: formData.requirements
          ? parseToArray(formData.requirements)
          : [],
        preferredQualifications: formData.preferredQualifications
          ? parseToArray(formData.preferredQualifications)
          : [],
        perks: formData.perks ? parseToArray(formData.perks) : [],
      };

      // Make the request
      const response = await freelancerApi.post("/jobs/create", payload);

      toast.success("Job posted successfully!");

      // Reset form
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
        contactEmail: "",
        description: "",
        details: "",
        skillsRequired: "",
        responsibilities: "",
        requirements: "",
        preferredQualifications: "",
        perks: "",
        applicationDeadline: new Date().toISOString().split("T")[0],
      });

      // Redirect to jobs page after successful post
      setTimeout(() => {
        window.location.href = "/freelancer/jobs";
      }, 1500);
    } catch (err) {
      console.error("Job posting error:", err);

      // Enhanced error handling
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("freelancer_token");
        localStorage.removeItem("freelancer_user");
        localStorage.removeItem("freelancerId");
        setTimeout(() => {
          window.location.href = "/freelancer-auth";
        }, 2000);
      } else if (err.response?.status === 403) {
        toast.error("Only freelancers can post jobs.");
      } else if (err.response?.status === 400) {
        const errorMsg =
          err.response?.data?.error || "Please check your inputs.";
        toast.error(`Validation error: ${errorMsg}`);
      } else if (err.response?.status === 404) {
        toast.error(
          "Job posting service is currently unavailable. Please try again later."
        );
      } else if (err.message.includes("Network Error")) {
        toast.error(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        toast.error(
          err?.response?.data?.error || "Failed to post job. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Post a New Job
          </h2>
          <p className="text-gray-600">
            Fill out the form below to create a new job posting. All fields
            marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label text="Job Title" required />
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              <div>
                <Label text="Company Name" required />
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g., TechCorp Inc."
                  required
                />
              </div>
              <div>
                <Label text="Location" required />
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY or Remote"
                  required
                />
              </div>
              <div>
                <Label text="Company Website" />
                <Input
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              <div>
                <Label text="Company Logo URL" />
                <Input
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  type="url"
                />
              </div>
              <div>
                <Label text="Category" />
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Software Development"
                />
              </div>
            </div>
          </div>

          {/* Job Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Job Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label text="Job Type" required />
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Job">Full-time Job</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <Label text="Job Mode" required />
                <select
                  name="jobMode"
                  value={formData.jobMode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
              <div>
                <Label text="Duration" required />
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 6 months, Permanent"
                  required
                />
              </div>
              {formData.jobType === "Internship" && (
                <div>
                  <Label text="Stipend (per month)" required />
                  <Input
                    type="number"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    placeholder="e.g., 15000"
                    required
                    min="0"
                  />
                </div>
              )}
              {formData.jobType === "Job" && (
                <div>
                  <Label text="CTC (per annum)" required />
                  <Input
                    type="number"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                    placeholder="e.g., 1200000"
                    required
                    min="0"
                  />
                </div>
              )}
              <div>
                <Label text="Application Deadline" required />
                <Input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full p-3"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h3>
            <div className="max-w-md">
              <div>
                <Label text="Contact Email" required />
                <Input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="hr@company.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Job Description
            </h3>
            <div className="space-y-6">
              <div>
                <Label text="Job Description" required />
                <Textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the job role, responsibilities, and what the candidate will be working on..."
                  required
                />
              </div>
              <div>
                <Label text="Additional Details (Optional)" />
                <Textarea
                  name="details"
                  rows={3}
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Any additional information about the job, company culture, or project specifics..."
                />
              </div>
            </div>
          </div>

          {/* Skills & Requirements Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Skills & Requirements
            </h3>
            <div className="space-y-6">
              <div>
                <Label text="Skills Required (comma separated)" required />
                <Input
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, React, Node.js, MongoDB"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple skills with commas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label text="Responsibilities (comma separated)" />
                  <Textarea
                    name="responsibilities"
                    rows={3}
                    value={formData.responsibilities}
                    onChange={handleChange}
                    placeholder="e.g., Develop UI components, Fix bugs, Write tests"
                  />
                </div>
                <div>
                  <Label text="Requirements (comma separated)" />
                  <Textarea
                    name="requirements"
                    rows={3}
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="e.g., 2+ years experience, Bachelor's degree in CS"
                  />
                </div>
              </div>

              <div>
                <Label text="Preferred Qualifications (comma separated)" />
                <Textarea
                  name="preferredQualifications"
                  rows={2}
                  value={formData.preferredQualifications}
                  onChange={handleChange}
                  placeholder="e.g., Experience with AWS, Knowledge of TypeScript"
                />
              </div>

              <div>
                <Label text="Perks & Benefits (comma separated)" />
                <Textarea
                  name="perks"
                  rows={2}
                  value={formData.perks}
                  onChange={handleChange}
                  placeholder="e.g., Health Insurance, Flexible Hours, Remote Work"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Make sure all required fields are filled before submitting.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Posting Job...
                  </span>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your job will be visible to freelancers immediately after
                    posting. You can edit or remove it anytime from the Manage
                    Jobs section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default JobPostForm;

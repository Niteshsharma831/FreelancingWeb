import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";
import { Helmet } from "react-helmet";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [freelancerName, setFreelancerName] = useState("");
  const navigate = useNavigate();

  const fetchFreelancer = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://freelancingweb-plac.onrender.com/api/freelancers/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFreelancerName(res.data.name); // assuming { name: "John Doe" }
    } catch (err) {
      console.error("Failed to fetch freelancer", err);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://freelancingweb-plac.onrender.com/api/jobs/my-jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(res.data);
    } catch (err) {
      toast.error("❌ Failed to load jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "⚠️ Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://freelancingweb-plac.onrender.com/api/jobs/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("✅ Job deleted successfully");
      fetchJobs();
    } catch (err) {
      toast.error("🚫 You are not authorized to delete this job");
      console.error(err);
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/FreelancerDashboard/edit-job/${jobId}`);
  };

  useEffect(() => {
    fetchFreelancer();
    fetchJobs();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <Helmet>
        <title>Manage Jobs</title>
      </Helmet>

      <Toaster position="top-right" reverseOrder={false} />

      {freelancerName && (
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Welcome, <span className="font-semibold">{freelancerName}</span> 👋
        </h2>
      )}

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Manage Your Posted Jobs
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-all"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-500">{job.companyName}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(job._id)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Job"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Job"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobsPage;

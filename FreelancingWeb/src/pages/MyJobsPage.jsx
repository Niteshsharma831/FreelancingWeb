import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaMoneyBillAlt } from "react-icons/fa";

const pastelColors = [
  "bg-pink-100",
  "bg-purple-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-blue-100",
  "bg-orange-100",
  "bg-indigo-100",
];

const MyJobsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "https://freelancingweb-plac.onrender.com/api/applications/my-applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Fetching your applications...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-red-500 font-medium">
          Please log in to view your applied jobs.
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="text-center">
          <img
            src="https://illustrations.popsy.co/gray/job-search.svg"
            alt="No Jobs"
            className="w-64 mx-auto mb-6"
          />
          <p className="text-gray-600 text-lg font-medium">
            You haven’t applied to any jobs yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 mt-10">
          📝 My Applied Jobs
        </h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, index) => {
            const job = app.jobId;
            const colorClass = pastelColors[index % pastelColors.length];

            if (!job) {
              return (
                <div
                  key={app._id}
                  className={`rounded-xl p-6 shadow-sm ${colorClass}`}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Job Not Found
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    This job might have been deleted by the poster.
                  </p>
                </div>
              );
            }

            return (
              <div
                key={app._id}
                className={`rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 p-6 flex flex-col justify-between ${colorClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {job.title}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {job.company || ""}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skillsRequired?.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-white/40 border border-white text-gray-800 px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired?.length > 5 && (
                      <span className="text-xs text-gray-600">+ more</span>
                    )}
                  </div>

                  <div className="space-y-1 text-gray-700 text-xs mb-4">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-indigo-500 text-sm" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-purple-500 text-sm" />
                      {job.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBillAlt className="text-green-500 text-sm" />₹
                      {job.budget}
                    </div>
                  </div>

                  <div className="mb-2">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">
                      Your Proposal
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {app.proposal}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mt-1 ${
                      app.status === "pending"
                        ? "bg-yellow-200 text-yellow-900"
                        : app.status === "accepted"
                        ? "bg-green-200 text-green-900"
                        : "bg-red-200 text-red-900"
                    }`}
                  >
                    {app.status.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="mt-6 w-full bg-gray-900 text-white text-xs font-semibold py-2 rounded-md hover:bg-black transition duration-200"
                >
                  View Job Details
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage;

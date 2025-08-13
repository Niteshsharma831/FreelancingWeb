import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(null);
  const [loadingUser, setLoadingUser] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "https://freelancingweb-plac.onrender.com/api/applications/freelancer",
        { withCredentials: true }
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    setLoadingStatus(applicationId + newStatus);
    try {
      await axios.put(
        `https://freelancingweb-plac.onrender.com/api/applications/update-status/${applicationId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Application ${newStatus}`);
      fetchApplications();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    } finally {
      setLoadingStatus(null);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleUserDetails = async (app) => {
    setLoadingUser(app._id);
    try {
      const res = await axios.get(
        `https://freelancingweb-plac.onrender.com/api/users/get-user-by-id/${app.clientId._id}`,
        { withCredentials: true }
      );
      setSelectedUser(res.data);
      toast.success("User details loaded");
    } catch (err) {
      console.error("Failed to fetch client details", err);
      toast.error("Failed to fetch user details");
    } finally {
      setLoadingUser(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Applications List */}
      <div className="flex-1 space-y-4 overflow-auto max-h-screen pr-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center lg:text-left">
          All Applications
        </h2>

        {applications.length === 0 ? (
          <p className="text-gray-500 text-center">No applications found.</p>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleExpand(app._id)}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-t-2xl"
              >
                <div className="text-left">
                  <p className="text-base font-semibold text-gray-800 truncate">
                    {app?.clientId?.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {app?.jobId?.title}
                  </p>
                </div>
                <div className="text-gray-500">
                  {expanded === app._id ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded === app._id ? "max-h-[1000px] p-4" : "max-h-0 p-0"
                } bg-white rounded-b-2xl text-sm md:text-base`}
              >
                {expanded === app._id && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p>
                        <strong>Client Email:</strong> {app?.clientId?.email}
                      </p>
                      <p>
                        <strong>Job Title:</strong> {app?.jobId?.title}
                      </p>
                      <p>
                        <strong>Job Type:</strong> {app?.jobId?.jobType}
                      </p>
                      <p>
                        <strong>Mode:</strong> {app?.jobId?.jobMode}
                      </p>
                      <p>
                        <strong>Location:</strong> {app?.jobId?.location}
                      </p>
                    </div>

                    <p>
                      <strong>Proposal:</strong> {app?.proposal}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold capitalize ${
                          app.status === "accepted"
                            ? "text-green-600"
                            : app.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {app.status}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => updateStatus(app._id, "accepted")}
                        disabled={loadingStatus === app._id + "accepted"}
                        className={`${
                          loadingStatus === app._id + "accepted"
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white px-4 py-2 rounded-xl`}
                      >
                        {loadingStatus === app._id + "accepted"
                          ? "Accepting..."
                          : "Accept"}
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, "rejected")}
                        disabled={loadingStatus === app._id + "rejected"}
                        className={`${
                          loadingStatus === app._id + "rejected"
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white px-4 py-2 rounded-xl`}
                      >
                        {loadingStatus === app._id + "rejected"
                          ? "Rejecting..."
                          : "Reject"}
                      </button>
                      <button
                        onClick={() => handleUserDetails(app)}
                        disabled={loadingUser === app._id}
                        className={`${
                          loadingUser === app._id
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white px-4 py-2 rounded-xl`}
                      >
                        {loadingUser === app._id
                          ? "Loading..."
                          : "User Details"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Details Panel */}
      <div className="lg:w-1/3 bg-white border border-gray-200 shadow-md rounded-xl p-4 sticky top-4 h-fit">
        <h3 className="text-xl font-bold mb-4 text-gray-800">User Details</h3>
        {selectedUser ? (
          <>
            {selectedUser?.profile?.profilePic && (
              <img
                src={selectedUser.profile.profilePic}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
            )}
            <p>
              <strong>Name:</strong> {selectedUser?.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser?.email}
            </p>
            <p>
              <strong>Gender:</strong> {selectedUser?.gender || "Not specified"}
            </p>
            <p>
              <strong>Phone:</strong> {selectedUser?.profile?.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {selectedUser?.profile?.address || "N/A"}
            </p>

            <div className="my-2">
              <strong>Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedUser?.profile?.skills?.length > 0 ? (
                  selectedUser.profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>
            </div>

            <p className="mt-2">
              <strong>Resume:</strong>{" "}
              {selectedUser?.profile?.resumeUrl ? (
                <a
                  href={selectedUser.profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              ) : (
                <span className="text-gray-500">Not uploaded</span>
              )}
            </p>
          </>
        ) : (
          <p className="text-gray-500">Click "User Details" to view info.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;

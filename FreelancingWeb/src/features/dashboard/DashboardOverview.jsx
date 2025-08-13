import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Briefcase, FileText, Users } from "lucide-react";

const DashboardOverview = () => {
  const [freelancer, setFreelancer] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [uniqueApplicants, setUniqueApplicants] = useState(0);
  const [loading, setLoading] = useState(true);

  const freelancerId = localStorage.getItem("freelancerId");

  useEffect(() => {
    fetchFreelancerDetails();
    fetchDashboardStats();
  }, []);

  const fetchFreelancerDetails = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/freelancers/me", {
        withCredentials: true, // ensure cookie (token) is sent
      });
      setFreelancer(res.data);
    } catch (err) {
      console.error("Error fetching freelancer details:", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const jobsRes = await axios.get(`http://localhost:5000/api/jobs/my-jobs`);
      const applicationsRes = await axios.get(
        `http://localhost:5000/api/applications/by-freelancer/${freelancerId}`
      );

      setTotalJobs(jobsRes.data.length || 0);
      setTotalApplications(applicationsRes.data.length || 0);

      const uniqueClientIds = new Set(
        applicationsRes.data.map((app) => app.clientId?._id).filter(Boolean)
      );
      setUniqueApplicants(uniqueClientIds.size || 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Freelancer Dashboard | WorkBridge</title>
      </Helmet>

      {/* Greeting */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome{freelancer?.name ? `, ${freelancer.name}` : ""}!
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Jobs Posted */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
            <Briefcase size={20} /> Total Jobs Posted
          </div>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {loading ? "..." : totalJobs}
          </p>
        </div>

        {/* Applications Received */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
            <FileText size={20} /> Applications Received
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : totalApplications}
          </p>
        </div>

        {/* Unique Users Applied */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-800">
            <Users size={20} /> Unique Applicants
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {loading ? "..." : uniqueApplicants}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

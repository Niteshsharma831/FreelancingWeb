import React, { useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import PostJobPage from "./PostJobPage";
import ManageJobsPage from "./ManageJobsPage";
import ApplicationsPage from "./ApplicationsPage";
import DashboardOverview from "./DashboardOverview";
import EditJobPage from "./EditJobPage";

const FreelancerDashboard = () => {
  const navigate = useNavigate();

  // 🚫 Protect Route on Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/register/recruiter");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/register/recruiter");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 bg-blue-900 text-white p-6 space-y-6 fixed h-full overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Freelancer Panel</h2>
        <nav className="space-y-3">
          <NavLink
            to="/FreelancerDashboard/dashboard"
            className={({ isActive }) =>
              `block hover:text-blue-200 ${
                isActive ? "font-bold underline" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/FreelancerDashboard/post-job"
            className={({ isActive }) =>
              `block hover:text-blue-200 ${
                isActive ? "font-bold underline" : ""
              }`
            }
          >
            Post Job
          </NavLink>
          <NavLink
            to="/FreelancerDashboard/manage-jobs"
            className={({ isActive }) =>
              `block hover:text-blue-200 ${
                isActive ? "font-bold underline" : ""
              }`
            }
          >
            Manage Jobs
          </NavLink>
          <NavLink
            to="/FreelancerDashboard/applications"
            className={({ isActive }) =>
              `block hover:text-blue-200 ${
                isActive ? "font-bold underline" : ""
              }`
            }
          >
            Applications
          </NavLink>
          <button
            onClick={handleLogout}
            className="block hover:text-red-300 mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 overflow-auto">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h1 className="text-xl font-bold text-gray-800">Freelancer Panel</h1>
          <Menu className="text-gray-600" />
        </div>

        <Routes>
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="post-job" element={<PostJobPage />} />
          <Route path="manage-jobs" element={<ManageJobsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="/edit-job/:id" element={<EditJobPage />} />
          <Route path="*" element={<DashboardOverview />} />
        </Routes>
      </main>
    </div>
  );
};

export default FreelancerDashboard;

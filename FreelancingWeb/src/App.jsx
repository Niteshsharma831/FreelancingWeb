import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/Home";
import Navbar from "./components/Navbar";
import JobPage from "./pages/allJobs";
import InternshipPage from "./pages/InternshipPage";
import PrivacyPolicy from "./pages/PolicyPage";
import Services from "./pages/Services";
import TermsAndConditions from "./pages/TermsAndConditions";
import MyJobsPage from "./pages/MyJobsPage";
import JobDetailsPage from "./context/JobDetailsPage";
import LoginPage from "./features/auth/Login";
import ClientDashboard from "./features/dashboard/ClientDashboard";
import FreelancerDashboard from "./features/dashboard/FreelancerDashboard";
import FreelancerAuth from "./features/dashboard/FreelancerAuth";
import PrivateRoute from "./services/PrivateRoute";
import ScrollToTop from "./context/ScrollToTop";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app startup
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoadingUser(false);
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    // Redirect to home page after logout
    window.location.href = "/";
  };

  const isFreelancer = user?.role === "freelancer";

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading app...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        {/* Show Navbar for all users except freelancers */}
        {!isFreelancer && <Navbar user={user} onLogout={handleLogout} />}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/alljobs" element={<JobPage />} />
            <Route path="/internships" element={<InternshipPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/services" element={<Services />} />
            <Route path="/ternandconditions" element={<TermsAndConditions />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginPage onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/myjobs"
              element={
                <PrivateRoute>
                  <MyJobsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/ClientDashboard"
              element={
                <PrivateRoute>
                  <ClientDashboard user={user} />
                </PrivateRoute>
              }
            />

            {/* Freelancer Routes */}
            <Route
              path="/FreelancerDashboard/*"
              element={
                <PrivateRoute>
                  <FreelancerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/FreelancerDashboard"
              element={<Navigate to="/FreelancerDashboard/dashboard" replace />}
            />
            <Route
              path="/register/recruiter"
              element={
                user ? (
                  <Navigate to="/FreelancerDashboard" replace />
                ) : (
                  <FreelancerAuth onLogin={handleLoginSuccess} />
                )
              }
            />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Show Footer for all users except freelancers */}
        {!isFreelancer && <Footer />}
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ClientDashboard from "./features/dashboard/ClientDashboard";
import FreelancerDashboard from "./features/dashboard/FreelancerDashboard";
import LoginPage from "./features/auth/Login";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./services/PrivateRoute";
import JobPage from "./pages/allJobs";
import MyJobsPage from "./pages/MyJobsPage";
import ScrollToTop from "./context/ScrollToTop";
import FreelancerAuth from "./features/dashboard/FreelancerAuth";
import PrivacyPolicy from "./pages/PolicyPage";
import JobDetailsPage from "./context/JobDetailsPage";
import InternshipPage from "./pages/InternshipPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
    setLoadingUser(false); // ✅ finished loading user
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isFreelancer = user?.role === "freelancer";

  // ✅ Prevent UI from rendering until user is loaded
  if (loadingUser) return null;

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        {!isFreelancer && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alljobs" element={<JobPage />} />
            <Route path="/internships" element={<InternshipPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
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
            <Route path="/login" element={<LoginPage setUser={setUser} />} />

            <Route
              path="/ClientDashboard"
              element={
                <PrivateRoute>
                  <ClientDashboard user={user} />
                </PrivateRoute>
              }
            />
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
          </Routes>
        </main>
        {!isFreelancer && <Footer />}
      </div>
    </Router>
  );
};

export default App;

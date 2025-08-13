import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/axiosservice"; // Axios instance with base URL

const FreelancerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/FreelancerDashboard", { replace: true });
    }
  }, [navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email before requesting OTP.");
      return;
    }
    try {
      await api.post("/api/users/send-otp", { email });
      setOtpSent(true);
      toast.success("OTP sent successfully to your email.");
    } catch (error) {
      console.error("Send OTP Error:", error.response?.data || error.message);
      toast.error("Failed to send OTP. Try again later.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !gender || !email || !otp) {
      toast.error("Please fill in all fields and enter the OTP.");
      return;
    }
    try {
      await api.post("/api/freelancers/register", { name, gender, email, otp });
      toast.success("Registered successfully! Please login.");
      resetForm();
      setIsLogin(true);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("User already registered. Please login.");
      } else {
        console.error("Register Error:", error.response?.data || error.message);
        toast.error("Registration failed. Check OTP and try again.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Please enter email and OTP.");
      return;
    }
    try {
      const res = await api.post("/api/freelancers/login", { email, otp });
      const { token, user } = res.data;

      // Save user and token
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("freelancerId", user._id); // Optional: if needed elsewhere

      toast.success("Logged in successfully!");

      // Navigate after short delay
      setTimeout(() => {
        navigate("/FreelancerDashboard", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      toast.error("Failed to login. Check OTP and email.");
    }
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setOtp("");
    setOtpSent(false);
    setGender("male");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 flex items-center justify-center px-4 py-12">
      <ToastContainer />
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="text-center lg:text-left max-w-xl flex-shrink-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Freelancer Hiring Portal{" "}
            <span className="text-green-600">2025</span>
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Find gigs and projects that match your skills and passion.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
            <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium">
              10,000+ Freelance Jobs
            </span>
            <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium">
              Work From Anywhere
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
              {isLogin ? "Freelancer Login" : "Freelancer Registration"}
            </h2>

            <form
              className="space-y-4"
              onSubmit={isLogin ? handleLogin : handleRegister}
            >
              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  >
                    <option value="" disabled>
                      Choose Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </>
              )}

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
                required
              />

              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={!otpSent}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="ml-2 text-blue-600 hover:underline text-sm"
                >
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              <button
                type="submit"
                className={`w-full ${
                  isLogin
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white py-2 rounded transition`}
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <p className="text-sm text-center mt-4">
              {isLogin ? "New here?" : "Already registered?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="text-blue-600 hover:underline"
              >
                {isLogin ? "Register Now" : "Login"}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FreelancerAuth;

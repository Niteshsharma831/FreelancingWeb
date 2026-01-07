import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/axiosservice";
import {
  FaEnvelope,
  FaUser,
  FaVenusMars,
  FaKey,
  FaArrowRight,
  FaGoogle,
  FaLinkedin,
  FaBuilding,
  FaBriefcase,
  FaRupeeSign,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState({
    sendOtp: false,
    login: false,
    register: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading((prev) => ({ ...prev, sendOtp: true }));
    try {
      await api.post("/users/send-otp", { email });
      setOtpSent(true);
      setOtpTimer(60);
      toast.success("OTP sent to your email!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Email not found. Please register first.");
      } else if (error.response?.status === 429) {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, sendOtp: false }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !gender || !email || !otp) {
      toast.error("Please fill all fields");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading((prev) => ({ ...prev, register: true }));
    try {
      await api.post("/users/create", {
        name,
        gender,
        email,
        otp,
      });

      toast.success("Registration successful! Please login.");
      resetForm();
      setIsLogin(true);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info("User already registered. Please login.");
        setIsLogin(true);
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid OTP");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading((prev) => ({ ...prev, register: false }));
    }
  };

  // In your handleLogin function in React:
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Please enter email and OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setLoading((prev) => ({ ...prev, login: true }));
    try {
      const response = await api.post("/users/login", {
        email,
        otp,
      });

      const { data } = response; // Extract data from response

      if (data.success) {
        const { token, user } = data.data; // Access nested user data

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success(`Welcome back, ${user.name}!`);

        // Redirect to home page
        setTimeout(() => navigate("/", { replace: true }), 1500);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      // Handle Axios error response
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
      setOtp(""); // Clear OTP on error
    } finally {
      setLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setOtp("");
    setOtpSent(false);
    setGender("male");
    setOtpTimer(0);
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login integration coming soon!`);
  };

  const features = [
    {
      icon: <FaBuilding />,
      text: "Top 100+ Companies",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaBriefcase />,
      text: "30,000+ Jobs Available",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaRupeeSign />,
      text: "Up to ₹25LPA CTC",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaCheckCircle />,
      text: "Verified Employers",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 text-center lg:text-left px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 lg:mb-12"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              🚀 Exclusive Hiring Drive 2025
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent leading-tight">
              Connect with Top
              <span className="block">Tech Companies</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl">
              Accelerate your career with India's leading tech companies. Get
              matched with your dream job in minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 lg:mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl shadow`}
                >
                  <span className="text-white text-xl">{feature.icon}</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-r from-blue-400 to-purple-400 shadow"
                    ></div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">10K+ Hired</p>
                  <p className="text-sm text-gray-500">Last 6 months</p>
                </div>
              </div>

              <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>

              <div>
                <p className="font-bold text-gray-900 text-lg">
                  ⭐ 4.8/5 Rating
                </p>
                <p className="text-sm text-gray-500">2,500+ verified reviews</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <p className="text-gray-700 font-medium">
                <span className="text-blue-600 font-bold">Pro Tip:</span>{" "}
                Complete your profile to increase interview chances by 70%
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 max-w-md w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
                <FaKey className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="text-gray-500 mt-2">
                {isLogin
                  ? "Sign in to continue your job search"
                  : "Start your journey with us"}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => {
                  setIsLogin(true);
                  resetForm();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  resetForm();
                }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  !isLogin
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                onSubmit={isLogin ? handleLogin : handleRegister}
              >
                {!isLogin && (
                  <>
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaUser className="inline mr-2 text-gray-400" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Gender Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaVenusMars className="inline mr-2 text-gray-400" />
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setGender(option.value)}
                            className={`py-3 rounded-xl font-medium transition-all duration-300 ${
                              gender === option.value
                                ? `bg-gradient-to-r ${
                                    option.value === "male"
                                      ? "from-blue-500 to-blue-600"
                                      : option.value === "female"
                                      ? "from-pink-500 to-pink-600"
                                      : "from-purple-500 to-purple-600"
                                  } text-white shadow`
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* OTP Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaKey className="inline mr-2 text-gray-400" />
                    OTP Verification
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          setOtp(value);
                        }}
                        disabled={!otpSent}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-center tracking-widest font-mono text-lg"
                        required
                      />
                      {otp.length > 0 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                          {otp.length}/6
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading.sendOtp || otpTimer > 0}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        otpTimer > 0 || loading.sendOtp
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow hover:shadow-lg"
                      }`}
                    >
                      {loading.sendOtp ? (
                        <FaSpinner className="animate-spin" />
                      ) : otpTimer > 0 ? (
                        `Resend in ${otpTimer}s`
                      ) : otpSent ? (
                        "Resend OTP"
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                  {otpSent && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <FaCheckCircle />
                      OTP sent to {email}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading.login || loading.register}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${
                    loading.login || loading.register
                      ? "bg-gray-300 cursor-not-allowed"
                      : isLogin
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  } text-white`}
                >
                  {loading.login || loading.register ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <FaArrowRight />
                    </>
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              {/* Switch Form */}
              <p className="text-center text-gray-600 mb-6">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    resetForm();
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  {isLogin ? "Sign up here" : "Sign in here"}
                </button>
              </p>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-3 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <FaGoogle className="text-red-500" />
                  <span className="font-medium">Google</span>
                </button>
                <button
                  onClick={() => handleSocialLogin("LinkedIn")}
                  className="flex items-center justify-center gap-3 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <FaLinkedin className="text-blue-600" />
                  <span className="font-medium">LinkedIn</span>
                </button>
              </div>

              {/* Terms */}
              <p className="text-center text-xs text-gray-500 mt-6">
                By continuing, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;

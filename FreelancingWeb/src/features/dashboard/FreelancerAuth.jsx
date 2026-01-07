import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import freelancerApi from "../../services/freelancerAxiosService";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaCheckCircle,
  FaRocket,
  FaCode,
  FaBuilding,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import { HiOutlineSparkles, HiOutlineUserGroup } from "react-icons/hi";

const FreelancerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("freelancer_token");
    if (token) {
      navigate("/FreelancerDashboard/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-submit when OTP reaches 6 digits
  useEffect(() => {
    if (otp.length === 6 && showOtpInput && !loading && !otpVerifying) {
      if (isLogin) {
        handleLoginSubmit();
      } else {
        handleRegisterSubmit();
      }
    }
  }, [otp]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await freelancerApi.post("/send-otp", { email });
      setOtpSent(true);
      setShowOtpInput(true);
      setCountdown(60);
      toast.success("OTP sent successfully to your email!");
    } catch (error) {
      console.error("Send OTP error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async () => {
    if (!name || !gender || !email || !otp) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setOtpVerifying(true);
    try {
      console.log("Registering with:", { name, gender, email, otp });
      const response = await freelancerApi.post("/register", {
        name,
        gender,
        email,
        otp,
      });

      console.log("Registration response:", response.data);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem("freelancer_token", token);
      localStorage.setItem("freelancer_user", JSON.stringify(user));
      localStorage.setItem("freelancerId", user._id || user.id);

      toast.success("Registration successful! Redirecting to dashboard...");

      // IMPORTANT: Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate("/FreelancerDashboard/dashboard", { replace: true });
      }, 1000);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 409) {
        toast.info("Freelancer already exists. Switching to login mode.");
        setIsLogin(true);
        setShowOtpInput(true);
      } else if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.error || "Invalid OTP. Please try again."
        );
      } else {
        toast.error(
          error.response?.data?.error ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    handleRegisterSubmit();
  };

  const handleLoginSubmit = async () => {
    if (!email || !otp) {
      toast.error("Please enter email and OTP.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setOtpVerifying(true);
    try {
      console.log("Logging in with:", { email, otp });
      const response = await freelancerApi.post("/login", { email, otp });
      console.log("Login response:", response.data);

      const { token, user } = response.data;

      // Store with specific freelancer prefix
      localStorage.setItem("freelancer_token", token);
      localStorage.setItem("freelancer_user", JSON.stringify(user));
      localStorage.setItem("freelancerId", user._id || user.id);

      toast.success("Welcome back! Redirecting to dashboard...");

      // IMPORTANT: Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        navigate("/FreelancerDashboard/dashboard", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error || "Invalid OTP or email. Please try again."
      );
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    handleLoginSubmit();
  };

  const resetForm = () => {
    setEmail("");
    setName("");
    setOtp("");
    setGender("");
    setOtpSent(false);
    setShowOtpInput(false);
    setCountdown(0);
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login coming soon!`);
  };

  const freelancerStats = [
    { icon: <FaCode />, value: "50,000+", label: "Active Projects" },
    { icon: <FaBuilding />, value: "15,000+", label: "Companies Hiring" },
    { icon: <FaUser />, value: "200,000+", label: "Freelancers" },
    { icon: <FaChartLine />, value: "₹85L", label: "Avg. Annual Earnings" },
  ];

  const popularSkills = [
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Data Science",
    "Graphic Design",
    "Video Editing",
  ];

  // Update OTP input to show verification status
  const renderOtpInput = () => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OTP Verification
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            disabled={otpVerifying}
            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
              otpVerifying ? "bg-gray-100" : ""
            }`}
            required
          />
          {otpVerifying && otp.length === 6 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <FaSpinner className="animate-spin text-green-600" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">OTP sent to {email}</span>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={countdown > 0 || loading || otpVerifying}
            className="text-sm text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-6">
              <HiOutlineSparkles className="text-green-600" />
              <span className="font-semibold text-green-700">
                Global Freelance Revolution 2025
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Dream Freelance Career
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Join India's fastest-growing community of freelancers. Work with
              top companies, set your own rates, and build a career on your
              terms.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {freelancerStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Popular Skills */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Top In-Demand Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-sm hover:border-green-300 hover:text-green-700 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                "✓ Work with Fortune 500 companies",
                "✓ Get paid securely & on time",
                "✓ Set your own schedule & rates",
                "✓ Access premium projects & clients",
                "✓ 24/7 dedicated support",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <FaCheckCircle className="text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <div className="flex justify-center">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    {isLogin ? (
                      <FaUser className="w-8 h-8" />
                    ) : (
                      <HiOutlineUserGroup className="w-8 h-8" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {isLogin ? "Welcome Back" : "Join Freelance Elite"}
                  </h2>
                  <p className="text-green-100">
                    {isLogin
                      ? "Sign in to access premium projects"
                      : "Start your freelance journey in minutes"}
                  </p>
                </div>

                {/* Form Body */}
                <div className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.form
                      key={isLogin ? "login-form" : "register-form"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                      onSubmit={isLogin ? handleLogin : handleRegister}
                    >
                      {!isLogin && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                  className={`py-3 rounded-xl border transition ${
                                    gender === option.value
                                      ? "bg-green-50 border-green-500 text-green-600"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={showOtpInput}
                            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                              showOtpInput ? "bg-gray-100" : ""
                            }`}
                            required
                          />
                        </div>
                      </div>

                      {showOtpInput && renderOtpInput()}

                      <div className="pt-4">
                        <button
                          type={showOtpInput ? "submit" : "button"}
                          onClick={!showOtpInput ? handleSendOtp : undefined}
                          disabled={loading || otpVerifying}
                          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 ${
                            loading || otpVerifying
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg hover:scale-[1.02]"
                          }`}
                        >
                          {loading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Sending OTP...
                            </>
                          ) : otpVerifying ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Verifying...
                            </>
                          ) : showOtpInput ? (
                            <>
                              {isLogin ? "Sign In" : "Create Account"}
                              <FaArrowRight />
                            </>
                          ) : (
                            <>
                              Send OTP
                              <FaRocket />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  </AnimatePresence>

                  {/* Divider */}
                  <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">
                      Or continue with
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                      onClick={() => handleSocialLogin("Google")}
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center"
                    >
                      <FaUser className="text-red-500" />
                    </button>
                    <button
                      onClick={() => handleSocialLogin("LinkedIn")}
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center"
                    >
                      <FaUser className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleSocialLogin("GitHub")}
                      className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center"
                    >
                      <FaUser className="text-gray-800" />
                    </button>
                  </div>

                  {/* Toggle between Login and Register */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      {isLogin
                        ? "New to freelancing?"
                        : "Already have an account?"}{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          resetForm();
                        }}
                        className="text-green-600 hover:text-green-800 font-semibold"
                      >
                        {isLogin ? "Start Here" : "Sign In"}
                      </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                      By continuing, you agree to our{" "}
                      <a
                        href="/terms"
                        className="text-green-600 hover:underline"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-green-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Success Stories */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Success Stories
                </h4>
                <p className="text-sm text-gray-600">
                  "Joined as a beginner, now earning ₹2.5L/month working with
                  international clients!"
                  <span className="block font-medium mt-1">
                    - Priya Sharma, Web Developer
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerAuth;

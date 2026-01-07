// services/freelancerAxiosService.js
import axios from "axios";

// Choose baseURL depending on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://freelancingweb-plac.onrender.com/api/freelancers"
    : "http://localhost:5000/api/freelancers";

console.log(`🌐 Freelancer API Base URL: ${baseURL}`);

const freelancerApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add freelancer token from localStorage
freelancerApi.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 Freelancer API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    // Skip adding token for public endpoints
    const publicEndpoints = ["/send-otp", "/register", "/login", "/logout"];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Only add token for private endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("freelancer_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Freelancer token added to headers");
      } else {
        console.warn("⚠️ No freelancer token found in localStorage");
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Freelancer request setup error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
freelancerApi.interceptors.response.use(
  (response) => {
    console.log(
      `✅ Freelancer API Success: ${response.status} ${response.config.url}`
    );
    return response;
  },
  (error) => {
    console.error("❌ Freelancer API Error:", {
      URL: error.config?.url,
      Method: error.config?.method,
      Status: error.response?.status,
      Message: error.message,
    });

    if (error.response?.status === 401) {
      // Freelancer token expired or invalid
      console.log("🔒 Freelancer token expired, clearing storage...");
      localStorage.removeItem("freelancer_token");
      localStorage.removeItem("freelancer_user");
      localStorage.removeItem("freelancerId");

      // Redirect to freelancer auth page
      if (window.location.pathname !== "/freelancer-auth") {
        window.location.href = "/freelancer-auth";
      }
    }

    return Promise.reject(error);
  }
);

export default freelancerApi;

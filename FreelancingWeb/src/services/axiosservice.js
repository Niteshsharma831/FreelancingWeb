import axios from "axios";

// Choose baseURL depending on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://freelancingweb-plac.onrender.com/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add token from localStorage
api.interceptors.request.use(
  (config) => {
    // Skip adding token for public endpoints (OTP, login, register)
    const publicEndpoints = [
      "/users/send-otp",
      "/users/create",
      "/users/login",
      "/users/verify-otp",
      "/users/register",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    // Only add token for private endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

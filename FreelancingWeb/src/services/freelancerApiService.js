// services/freelancerApiService.js
import freelancerApi from "./freelancerAxiosService";

// Public endpoints (no token required)
export const freelancerAuthService = {
  // Send OTP
  sendOtp: async (email) => {
    try {
      const response = await freelancerApi.post("/send-otp", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register freelancer
  register: async (freelancerData) => {
    try {
      const response = await freelancerApi.post("/register", freelancerData);

      // Store tokens and data
      if (response.data.token && response.data.user) {
        localStorage.setItem("freelancer_token", response.data.token);
        localStorage.setItem(
          "freelancer_user",
          JSON.stringify(response.data.user)
        );
        localStorage.setItem(
          "freelancerId",
          response.data.user._id || response.data.user.id
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login freelancer
  login: async (loginData) => {
    try {
      const response = await freelancerApi.post("/login", loginData);

      // Store tokens and data
      if (response.data.token && response.data.user) {
        localStorage.setItem("freelancer_token", response.data.token);
        localStorage.setItem(
          "freelancer_user",
          JSON.stringify(response.data.user)
        );
        localStorage.setItem(
          "freelancerId",
          response.data.user._id || response.data.user.id
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout freelancer
  logout: async () => {
    try {
      const response = await freelancerApi.post("/logout");

      // Clear freelancer storage
      localStorage.removeItem("freelancer_token");
      localStorage.removeItem("freelancer_user");
      localStorage.removeItem("freelancerId");

      return response.data;
    } catch (error) {
      // Still clear storage even if API call fails
      localStorage.removeItem("freelancer_token");
      localStorage.removeItem("freelancer_user");
      localStorage.removeItem("freelancerId");
      throw error.response?.data || error.message;
    }
  },
};

// Protected endpoints (token required)
export const freelancerService = {
  // Get current freelancer profile
  getProfile: async () => {
    try {
      const response = await freelancerApi.get("/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update freelancer profile
  updateProfile: async (profileData) => {
    try {
      const response = await freelancerApi.put("/update", profileData);

      // Update stored user data if returned
      if (response.data.user) {
        localStorage.setItem(
          "freelancer_user",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get freelancer by email or ID
  getFreelancer: async (email = "") => {
    try {
      const params = email ? { email } : {};
      const response = await freelancerApi.get("/", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all freelancers
  getAllFreelancers: async () => {
    try {
      const response = await freelancerApi.get("/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Utility functions
export const freelancerUtils = {
  // Check if freelancer is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("freelancer_token");
    const user = localStorage.getItem("freelancer_user");
    return !!(token && user);
  },

  // Get current freelancer data
  getCurrentFreelancer: () => {
    try {
      const userStr = localStorage.getItem("freelancer_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing freelancer user data:", error);
      return null;
    }
  },

  // Get freelancer token
  getToken: () => {
    return localStorage.getItem("freelancer_token");
  },

  // Clear freelancer data
  clearFreelancerData: () => {
    localStorage.removeItem("freelancer_token");
    localStorage.removeItem("freelancer_user");
    localStorage.removeItem("freelancerId");
  },
};

export default {
  auth: freelancerAuthService,
  service: freelancerService,
  utils: freelancerUtils,
};

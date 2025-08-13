import axios from "axios";

// Choose baseURL depending on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://freelancingweb-plac.onrender.com/"
    : "http://localhost:5000/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ send JWT cookie automatically
});

export default api;

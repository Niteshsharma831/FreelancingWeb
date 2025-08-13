// axiosservice.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
  baseURL: "https://freelancingweb-plac.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 VERY IMPORTANT: sends the cookie (JWT)
});

export default api;

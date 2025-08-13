// axiosservice.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 👈 VERY IMPORTANT: sends the cookie (JWT)
});

export default api;

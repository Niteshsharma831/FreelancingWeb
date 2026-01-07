// // PrivateRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;

// services/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check for regular user token only
  const token = localStorage.getItem("token");

  // Don't interfere with freelancer routes
  const isFreelancerRoute = window.location.pathname.includes("Freelancer");

  if (isFreelancerRoute) {
    return children; // Let freelancer routes handle their own protection
  }

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

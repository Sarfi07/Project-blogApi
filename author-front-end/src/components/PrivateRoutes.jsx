/* eslint-disable react/prop-types */

import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  const token = localStorage.getItem("token");

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoutes;

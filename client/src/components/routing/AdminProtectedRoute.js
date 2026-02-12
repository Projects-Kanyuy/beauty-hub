import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminProtectedRoute = () => {
  const { user } = useAuth();

  if (user && user.role === "admin") {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;

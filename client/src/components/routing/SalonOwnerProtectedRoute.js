import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SalonOwnerProtectedRoute = () => {
  const { user } = useAuth();

  // If the user is logged in AND they are a salon_owner, allow access
  if (user && user.role === 'salon_owner') {
    return <Outlet />;
  } else {
    // Otherwise, redirect them to the login page
    return <Navigate to="/login" replace />;
  }
};

export default SalonOwnerProtectedRoute;
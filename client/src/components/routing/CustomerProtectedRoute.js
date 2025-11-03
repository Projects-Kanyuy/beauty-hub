import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomerProtectedRoute = () => {
  const { user } = useAuth();

  // If the user is logged in AND they are a customer, allow access
  if (user && user.role === 'customer') {
    return <Outlet />; // The <Outlet> renders the actual page component (e.g., DashboardPage)
  } else {
    // Otherwise, redirect them to the login page
    return <Navigate to="/login" replace />;
  }
};

export default CustomerProtectedRoute;
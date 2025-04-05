// src/components/AdminRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
  const { currentUser, isAdmin, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  // Redirect to home if not authenticated or not an admin
  return currentUser && isAdmin() ? <Outlet /> : <Navigate to="/" />;
};


export default AdminRoute;
//export { PrivateRoute, AdminRoute };
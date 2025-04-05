// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  // Redirect to login if not authenticated
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;


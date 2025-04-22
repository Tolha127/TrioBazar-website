import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from './LoadingIndicator';

const PrivateRoute = () => {
  const { isAuthenticated, loading, authError } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <LoadingIndicator message="Verifying your credentials..." />;
  }
  
  // Display any authentication errors
  if (authError) {
    return <Navigate to="/admin/login" state={{ authError }} />;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;

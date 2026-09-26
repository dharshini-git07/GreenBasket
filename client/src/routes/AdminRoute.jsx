import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LoadingPage } from '../components/common/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, mongoUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage message="Verifying admin credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (mongoUser?.role !== 'admin') {
    return (
      <Navigate
        to="/account"
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;

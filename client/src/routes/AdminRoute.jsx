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
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-100 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          🚫
        </div>
        <h2 className="text-xl font-bold text-[#1F2937]">Admin Access Required</h2>
        <p className="text-xs text-[#6B7280]">
          You need administrator privileges to access this page.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};

export default AdminRoute;

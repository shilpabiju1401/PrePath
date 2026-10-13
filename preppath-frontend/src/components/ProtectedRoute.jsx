import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps pages that require login.
 * If not logged in, sends you to the login page.
 * If adminOnly is true, non-admin users are redirected to dashboard.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While we're still checking if the user is logged in, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading PrepPath…</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login, saving where they came from
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin-only page accessed by non-admin → back to dashboard
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

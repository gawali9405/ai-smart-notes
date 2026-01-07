import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-lg font-semibold tracking-[0.3em] text-indigo-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the current location to redirect back after login
    const from = window.location.pathname + window.location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(from)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" data-testid="auth-loading">
        <div className="font-mono text-xs tracking-[0.2em] uppercase text-slate-500">Authenticating…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (roles && roles.length && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" data-testid="forbidden">
        <div className="max-w-md border border-slate-200 bg-white p-8">
          <div className="eyebrow mb-3">Access Denied</div>
          <h2 className="text-2xl font-display font-medium">Insufficient permissions</h2>
          <p className="text-sm text-slate-600 mt-3">Your role <span className="font-mono text-brand">{user.role}</span> does not have access to this area.</p>
        </div>
      </div>
    );
  }
  return children;
}

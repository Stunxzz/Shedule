// src/components/Private/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || (!user.is_superuser && !(user.groups?.includes("Admin")))) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

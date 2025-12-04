import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StationsPage from "./pages/admin/StationsPage";
import InstitutionsPage from "./pages/admin/InstitutionsPage";
import SensorsPage from "./pages/admin/SensorsPage";
import MeasurementsPage from "./pages/admin/MeasurementsPage";
import AlertsPage from "./pages/admin/AlertsPage";
import InstitutionRequests from "./pages/admin/InstitutionRequests";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.role?.includes("admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Dashboard />
          )
        }
      />
      <Route path="/login" element={<Login />} />

      {/* PANEL ADMIN */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stations"
        element={
          <ProtectedRoute>
            <StationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/institutions"
        element={
          <ProtectedRoute>
            <InstitutionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sensors"
        element={
          <ProtectedRoute>
            <SensorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/measurements"
        element={
          <ProtectedRoute>
            <MeasurementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/alerts"
        element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/institutions/requests"
        element={
          <ProtectedRoute>
            <InstitutionRequests />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

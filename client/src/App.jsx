/**
 * @fileoverview Main Application Component
 * 
 * This is the root React component that defines the application's routing structure.
 * Handles route protection and navigation based on user authentication status.
 * 
 * @module App
 * @requires react
 * @requires react-router-dom
 */

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

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication. Redirects to login if user is not authenticated.
 * Optionally enforces admin-only access.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if access is granted
 * @param {boolean} [props.adminOnly=false] - If true, only allows access to admin users
 * @returns {JSX.Element} Either the protected children or a redirect to login
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin-only access if required
  // User role may be a string or array, so we check if it includes "admin"
  if (adminOnly && !user.role?.includes("admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

/**
 * Main App Component
 * 
 * Defines all application routes and their protection levels.
 * Shows loading state while authentication status is being determined.
 * 
 * @component
 * @returns {JSX.Element} Application routing structure
 */
const App = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  // Prevents flash of incorrect content during auth check
  if (loading) {
    return <div>Loading...</div>; // TODO: Replace with proper loading spinner component
  }

  return (
    <Routes>
      {/* Root route - redirects based on auth status */}
      <Route
        path="/"
        element={
          user ? (
            // Authenticated users go to admin dashboard
            <Navigate to="/admin/dashboard" replace />
          ) : (
            // Unauthenticated users see public dashboard
            <Dashboard />
          )
        }
      />
      
      {/* Public login route */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN PANEL ROUTES */}
      {/* Redirect /admin to /admin/dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Admin Dashboard - requires authentication */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Stations Management - requires authentication */}
      <Route
        path="/admin/stations"
        element={
          <ProtectedRoute>
            <StationsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Institutions Management - requires authentication */}
      <Route
        path="/admin/institutions"
        element={
          <ProtectedRoute>
            <InstitutionsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Sensors Management - requires authentication */}
      <Route
        path="/admin/sensors"
        element={
          <ProtectedRoute>
            <SensorsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Measurements Viewing - requires authentication */}
      <Route
        path="/admin/measurements"
        element={
          <ProtectedRoute>
            <MeasurementsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Alerts Management - requires authentication */}
      <Route
        path="/admin/alerts"
        element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Institution Requests - requires authentication */}
      <Route
        path="/admin/institutions/requests"
        element={
          <ProtectedRoute>
            <InstitutionRequests />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route - redirects unknown paths to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

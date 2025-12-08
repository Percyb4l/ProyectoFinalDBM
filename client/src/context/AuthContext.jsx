/**
 * @fileoverview Authentication Context
 * 
 * Provides authentication state and methods to all components in the application.
 * Manages user session, login/logout operations, and token storage.
 * 
 * @module context/AuthContext
 * @requires react
 */

// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

/**
 * Authentication Context
 * 
 * React context for sharing authentication state across the application.
 * @type {React.Context<Object|null>}
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * Provides authentication context to all child components. Manages user state,
 * handles login/logout operations, and persists session in localStorage.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that need auth context
 * 
 * @component
 * @returns {JSX.Element} Context provider wrapping children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Restore user session from localStorage on mount
   * 
   * Checks localStorage for stored user and token. If both exist, restores
   * the user session. This allows users to remain logged in after page refresh.
   */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    // Restore session if both user and token are present
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Authenticates a user with email and password
   * 
   * Sends login request to API, stores token and user data in localStorage,
   * and updates user state. Returns success/error status for UI feedback.
   * 
   * @async
   * @param {string} email - User email address
   * @param {string} password - User password
   * @returns {Promise<Object>} Result object with ok (boolean) and message (string)
   * 
   * @example
   * const result = await login("user@example.com", "password123");
   * if (result.ok) {
   *   // Login successful
   * }
   */
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Persist authentication data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { ok: true };
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      return {
        ok: false,
        message:
          error.response?.data?.error || "Error al iniciar sesión. Verifica tus datos.",
      };
    }
  };

  /**
   * Logs out the current user
   * 
   * Clears authentication data from localStorage and resets user state.
   * Should be called when user explicitly logs out or session expires.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Show loading state while checking authentication
  if (loading) {
    return <div style={{ padding: 20 }}>Cargando...</div>;
  }

  // Provide authentication context to all children
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * 
 * Provides easy access to authentication state and methods in any component.
 * Must be used within an AuthProvider.
 * 
 * @returns {Object} Authentication context value
 * @returns {Object|null} user - Current user object or null if not authenticated
 * @returns {Function} login - Login function (email, password) => Promise<Object>
 * @returns {Function} logout - Logout function () => void
 * 
 * @throws {Error} If used outside AuthProvider
 * 
 * @example
 * const { user, login, logout } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);

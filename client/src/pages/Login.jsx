/**
 * @fileoverview Login Page Component
 * 
 * Public login page for user authentication.
 * Handles user login and redirects to admin dashboard on success.
 * 
 * @module pages/Login
 * @requires react
 * @requires react-router-dom
 */

// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Login Component
 * 
 * Provides a login form with email and password fields.
 * Pre-fills with default admin credentials for development convenience.
 * 
 * @component
 * @returns {JSX.Element} Login form interface
 */
const Login = () => {
  // Form state - pre-filled with default admin credentials for development
  const [email, setEmail] = useState("admin@vrisa.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles form submission
   * 
   * Attempts to authenticate user with provided credentials.
   * On success, redirects to admin dashboard. On failure, displays error message.
   * 
   * @async
   * @param {Event} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    // Redirect to admin dashboard on successful login
    navigate("/admin");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">VriSA</h1>
        <p className="login-subtitle">Panel administrativo</p>

        {/* Display error message if login fails */}
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Correo electrónico
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Contraseña
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

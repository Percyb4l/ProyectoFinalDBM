/**
 * @fileoverview Application Entry Point
 * 
 * This is the main entry point for the React application.
 * Initializes the React root, sets up routing, and wraps the app with necessary providers.
 * 
 * @module main
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Import global styles before app components
import "./index.css";
import "./App.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

/**
 * Application Root Initialization
 * 
 * Creates the React root and renders the application with all necessary providers.
 * 
 * Provider hierarchy:
 * 1. StrictMode - Enables React development mode checks
 * 2. AuthProvider - Provides authentication context to all components
 * 3. BrowserRouter - Enables client-side routing
 * 4. App - Main application component with routes
 * 
 * @see https://react.dev/reference/react/StrictMode
 * @see https://reactrouter.com/en/main/router-components/browser-router
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

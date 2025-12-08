/**
 * @fileoverview Custom Hook for Institutional Branding
 * 
 * This hook applies institutional branding colors to the application
 * by updating CSS custom properties based on the logged-in user's institution.
 * 
 * @module hooks/useBranding
 * @requires react
 * @requires context/AuthContext
 */

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Default color values to use when no institution is set
 * These match the default CSS variables in index.css
 */
const DEFAULT_COLORS = {
  primary: "#4f46e5",
  primaryDark: "#4338ca",
  primaryLight: "#6366f1",
  secondary: "#10b981",
};

/**
 * Custom hook to apply institutional branding
 * 
 * Reads the user's institution colors from AuthContext and applies them
 * to CSS custom properties, allowing the entire application to use
 * institution-specific branding.
 * 
 * @returns {void}
 * 
 * @example
 * // Use in a layout component
 * function AdminLayout() {
 *   useBranding();
 *   return <div>...</div>;
 * }
 */
export const useBranding = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Get institution colors from user object
    const institution = user?.institution;
    
    // Apply colors if institution exists and has color values
    if (institution?.color_primary || institution?.color_secondary) {
      const root = document.documentElement;

      // Apply primary color if available
      if (institution.color_primary) {
        root.style.setProperty("--primary", institution.color_primary);
        
        // Generate darker and lighter variants if not provided
        // This is a simple approach - you might want to use a color manipulation library
        // for more accurate color variations
        root.style.setProperty("--primary-dark", institution.color_primary);
        root.style.setProperty("--primary-light", institution.color_primary);
      }

      // Apply secondary color if available
      if (institution.color_secondary) {
        root.style.setProperty("--secondary", institution.color_secondary);
      }
    } else {
      // Reset to default colors if no institution or colors are set
      const root = document.documentElement;
      root.style.setProperty("--primary", DEFAULT_COLORS.primary);
      root.style.setProperty("--primary-dark", DEFAULT_COLORS.primaryDark);
      root.style.setProperty("--primary-light", DEFAULT_COLORS.primaryLight);
      root.style.setProperty("--secondary", DEFAULT_COLORS.secondary);
    }
  }, [user]); // Re-run when user changes (login/logout/institution change)
};

export default useBranding;


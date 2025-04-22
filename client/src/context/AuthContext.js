import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, AUTH_CONFIG } from '../config/environment';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check if token exists and is valid (not expired) on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);
  // Check authentication status
  const checkAuthStatus = async () => {
    setLoading(true);

    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('userRole');
    const loginTime = localStorage.getItem('loginTime');

    if (!token) {
      setIsAuthenticated(false);
      setUserRole(null);
      setLoading(false);
      return;
    }    // First do a client-side check for obviously expired tokens
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const tokenLifespan = AUTH_CONFIG.tokenExpiryHours * 60 * 60 * 1000; // Convert hours to milliseconds
      
      if (now - loginDate > tokenLifespan) {
        // Token expired
        logout();
        setLoading(false);
        return;
      }
    }    // Then verify the token with the server
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'x-auth-token': token
        }
      });

      if (response.ok) {
        // Server confirmed token is valid
        setIsAuthenticated(true);
        setUserRole(role);
        setAuthError(null);
      } else {
        // Server rejected the token
        console.log('Server rejected the token:', response.status);
        const errorData = await response.json().catch(() => ({ message: 'Authentication failed' }));
        setAuthError(errorData.message || 'Your session has expired. Please log in again.');
        logout();
      }
    } catch (error) {
      console.error('Error verifying token with server:', error);
      // If server is unreachable, fall back to client-side validation
      // but add a warning in the console
      console.warn('Unable to verify token with server. Using client-side validation as fallback.');
      setIsAuthenticated(true);
      setUserRole(role);
      setAuthError(null);
    } finally {
      setLoading(false);
    }
  };  // Login function
  const login = (token, role) => {
    localStorage.setItem(AUTH_CONFIG.storageKeys.token, token);
    localStorage.setItem(AUTH_CONFIG.storageKeys.role, role || 'admin');
    localStorage.setItem(AUTH_CONFIG.storageKeys.loginTime, new Date().toISOString());
    setIsAuthenticated(true);
    setUserRole(role || 'admin');
    setAuthError(null);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(AUTH_CONFIG.storageKeys.token);
    localStorage.removeItem(AUTH_CONFIG.storageKeys.role);
    localStorage.removeItem(AUTH_CONFIG.storageKeys.loginTime);
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Determine if user is admin
  const isAdmin = () => {
    return userRole === 'admin';
  };
  // Value to be provided to consumers
  const authContextValue = {
    isAuthenticated,
    userRole,
    loading,
    authError,
    login,
    logout,
    isAdmin,
    checkAuthStatus,
    clearAuthError: () => setAuthError(null)
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

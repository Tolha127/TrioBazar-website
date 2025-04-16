import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists and is valid (not expired) on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = () => {
    setLoading(true);

    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('userRole');
    const loginTime = localStorage.getItem('loginTime');

    if (!token) {
      setIsAuthenticated(false);
      setUserRole(null);
      setLoading(false);
      return;
    }

    // Check if token has expired (24 hours from login time)
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const tokenLifespan = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (now - loginDate > tokenLifespan) {
        // Token expired
        logout();
        setLoading(false);
        return;
      }
    }

    // If we've reached here, token is valid
    setIsAuthenticated(true);
    setUserRole(role);
    setLoading(false);
  };

  // Login function
  const login = (token, role) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('userRole', role || 'admin');
    localStorage.setItem('loginTime', new Date().toISOString());
    setIsAuthenticated(true);
    setUserRole(role || 'admin');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginTime');
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
    login,
    logout,
    isAdmin,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

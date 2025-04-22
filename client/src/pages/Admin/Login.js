import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { API_BASE_URL } from '../../config/environment';
import './Admin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, authError, clearAuthError } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Check for auth errors passed from PrivateRoute
  useEffect(() => {
    if (location.state?.authError) {
      setError(location.state.authError);
      // Clear the location state to prevent error from persisting on refresh
      window.history.replaceState({}, document.title);
    } else if (authError) {
      setError(authError);
      clearAuthError();
    }
  }, [location.state, authError, clearAuthError]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
      try {
      // Make a real API call to the backend using our centralized environment config
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Use the login function from AuthContext instead of manually setting localStorage
        login(data.token, data.user?.role || 'admin');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-logo">
          <h1>TrioBazaar Admin</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <h2>Sign In</h2>
            {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>          
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Login'}
          </button>
          
          {isLoading && (
            <div className="login-loading-container">
              <LoadingIndicator message="Authenticating..." />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
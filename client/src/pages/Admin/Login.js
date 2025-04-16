import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Make a real API call to the backend using environment variable
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      console.log('Attempting login with API URL:', apiUrl);      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      console.log('Login response status:', response.status);
      
      if (response.ok) {
        // Store the JWT token and user info from the backend
        console.log('Login successful, storing token');
        localStorage.setItem('adminToken', data.token);
        
        // If the server sends user role info, store it too
        if (data.user) {
          localStorage.setItem('userRole', data.user.role || 'admin');
        } else {
          localStorage.setItem('userRole', 'admin'); // Default to admin for backward compatibility
        }
        
        // Set last login time
        localStorage.setItem('loginTime', new Date().toISOString());
        
        navigate('/admin/dashboard');
      } else {
        // Show error message from the server
        console.log('Login failed with message:', data.message);
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
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
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
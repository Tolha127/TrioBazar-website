// src/components/layout/AdminLayout.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaEdit, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <div className="admin-layout">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>TrioBazaar</h2>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
              <Link to="/admin/dashboard">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes('/admin/products') ? 'active' : ''}>
              <Link to="/admin/products">
                <FaBox />
                <span>Products</span>
              </Link>
            </li>
            
            <li className={location.pathname.includes('/admin/content') ? 'active' : ''}>
              <Link to="/admin/content">
                <FaEdit />
                <span>Content</span>
              </Link>
            </li>
            
            <li className={location.pathname === '/admin/settings' ? 'active' : ''}>
              <Link to="/admin/settings">
                <FaCog />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
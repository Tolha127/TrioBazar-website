import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaEdit, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import AdminLayout from '../../components/Layout/AdminLayout';
import './Admin.css';

const AdminDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-outline">
            <FaSignOutAlt /> Logout
          </button>
        </div>
        
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-details">
              <h3>Total Products</h3>
              <p className="stat-number">24</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-details">
              <h3>Page Views</h3>
              <p className="stat-number">1,245</p>
            </div>
          </div>
          
          {/* Add more stat cards as needed */}
        </div>
        
        <div className="admin-quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products/add" className="action-card">
              <div className="action-icon">
                <FaBox />
              </div>
              <h3>Add New Product</h3>
              <p>Upload and manage new products</p>
            </Link>
            
            <Link to="/admin/content" className="action-card">
              <div className="action-icon">
                <FaEdit />
              </div>
              <h3>Edit Content</h3>
              <p>Update website content and information</p>
            </Link>
            
            {/* Add more action cards as needed */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
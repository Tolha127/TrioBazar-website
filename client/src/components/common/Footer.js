import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>TrioBazar</h3>
            <p>Specializing in modest clothing with a focus on quality and customer satisfaction.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@triobazar.com</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" alt="Gmail" style={{ width: '20px', height: '20px' }} />
            <p>WhatsApp: +234 9127813223</p>
            <div className="social-icons">
              {/* Add social media icons here */}
              <img src='https://web.whatsapp.com/favicon-64x64.ico' alt="Whatsapp" style={{ width:'20px', height:'20px'}} />
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy;2025 TrioBazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
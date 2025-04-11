import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">Trio<span>Bazar</span></div>
          <p className="footer-about">Premium tailoring services delivering exceptional quality and perfect fit for every client.</p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://wa.me/2349167108795" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-links-column">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link to="/">Home</Link></li>
            <li className="footer-link"><Link to="/products">Collections</Link></li>
            <li className="footer-link"><Link to="/about">About Us</Link></li>
            <li className="footer-link"><Link to="/custom">Custom Tailoring</Link></li>
            <li className="footer-link"><Link to="/contact">Book Appointment</Link></li>
          </ul>
        </div>
        
        <div className="footer-links-column">
          <h3 className="footer-heading">Customer Service</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link to="/contact">Contact Us</Link></li>
            <li className="footer-link"><Link to="/faq">FAQ</Link></li>
            <li className="footer-link"><Link to="/shipping">Shipping & Returns</Link></li>
            <li className="footer-link"><Link to="/sizing">Size Guide</Link></li>
            <li className="footer-link"><Link to="/care">Care Instructions</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3 className="footer-heading">Contact Us</h3>
          <div className="footer-contact-item">
            <span className="contact-icon"><i className="fas fa-map-marker-alt"></i></span>
            <span>123 Fashion Street, Lagos, Nigeria</span>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon"><i className="fas fa-phone-alt"></i></span>
            <span>+234 916 710 8795</span>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon"><i className="fas fa-envelope"></i></span>
            <span>info@triobazar.com</span>
          </div>
          <div className="footer-newsletter">
            <h4>Subscribe to our newsletter</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} TrioBazar Tailoring. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
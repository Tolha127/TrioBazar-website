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
            </a>            <a href="https://www.instagram.com/trio_bazaar_wears?igsh=NXpnODg0cnEzMDRm" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>            <a href="https://wa.me/2349167108795?text=Hello%20TrioBazaar!%20I'm%20interested%20in%20your%20tailoring%20services.%20I%20would%20like%20to%20know%20more%20about%20your%20offerings." target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-links-column">
          <h3 className="footer-heading">Quick Links</h3>          <ul className="footer-links">
            <li className="footer-link"><Link to="/">Home</Link></li>
            <li className="footer-link"><Link to="/products">Collections</Link></li>
            <li className="footer-link"><Link to="/about">About Us</Link></li>
            <li className="footer-link"><Link to="/contact">Book Appointment</Link></li>
          </ul>
        </div>
          <div className="footer-links-column">
          <h3 className="footer-heading">Customer Service</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h3 className="footer-heading">Contact Us</h3>          <div className="footer-contact-item">
            <span className="contact-icon"><i className="fas fa-map-marker-alt"></i></span>
            <span>No 64, Ifesowapo Road2, Off Ikire-Ile Road, Iwo, Osun State</span>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon"><i className="fas fa-phone-alt"></i></span>
            <span>+234 916 710 8795</span>
          </div>          <div className="footer-contact-item">
            <span className="contact-icon"><i className="fas fa-envelope"></i></span>
            <span>info@trioBazaar.com</span>
          </div>
        </div>
      </div>      <div className="footer-bottom">
        <p>&copy; {currentYear} TrioBazaar Tailoring. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
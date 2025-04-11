import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Collections</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/custom" className="nav-link">Custom Tailoring</Link>
        </div>
        
        <div className="logo">
          <Link to="/">
            Trio<span>Bazar</span>
          </Link>
        </div>
        
        <div className="right-nav">
          <Link to="/login" className="nav-link">
            <i className="fas fa-user"></i>
            <span className="nav-text">Account</span>
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <i className="fas fa-shopping-bag"></i>
            <span className="cart-count">0</span>
            <span className="nav-text">Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

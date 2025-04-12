import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (    <section className="hero">
      <div className="hero-content">
        <h1>Bespoke Clothing for the Modern Individual</h1>
        <p>Handcrafted garments tailored to your unique style and measurements. Experience the perfect fit and exceptional quality that only custom tailoring can provide.</p>
        <div className="hero-buttons">
          <Link to="/contact" className="cta-button">Book Consultation</Link>
          <Link to="/products" className="secondary-button">View Collections</Link>
        </div>
      </div>
      <div className="hero-image">
        <img className="product-display" src={require("../assets/images/triobazaar-logo.png")} alt="Custom tailored attire" />
        <div className="hero-badge">
          <span>20% OFF</span>
          <span>First Order</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;

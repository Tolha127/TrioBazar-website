import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Elegant Islamic Clothing</h1>
            <p>Custom-made apparel combining tradition with modern style</p>
            <div className="hero-buttons">
              <a href="/products" className="btn btn-primary">View Collections</a>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="section featured-products">
        <div className="container">
          <h2 className="section-title">Featured Collections</h2>
          <div className="products-grid">
            {/* This will be populated with actual products later */}
            <div className="product-card placeholder"></div>
            <div className="product-card placeholder"></div>
            <div className="product-card placeholder"></div>
          </div>
        </div>
      </section>
      
      {/* About Preview Section */}
      <section className="section about-preview">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About TrioBazar</h2>
              <p>Founded by three siblings with a passion for modest fashion, TrioBazar has been creating custom wears clothing for over 3 years.</p>
              <p>We value modesty, quality craftsmanship, and customer satisfaction in every piece we create.</p>
              <a href="/about" className="btn btn-secondary">Learn More</a>
            </div>
            <div className="about-image placeholder">
              {/* Image will be added later */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Preview */}
      <section className="section testimonials-preview">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {/* Will be populated with actual testimonials later */}
            <div className="testimonial-card placeholder"></div>
            <div className="testimonial-card placeholder"></div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="section contact-cta">
        <div className="container">
          <h2>Ready to order your custom clothing?</h2>
          <p>Contact us via WhatsApp to discuss your requirements and place an order.</p>
          <a href="/contact" className="btn btn-primary">Get in Touch</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
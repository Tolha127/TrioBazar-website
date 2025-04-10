import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About TrioBazar</h1>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>Welcome to TrioBazar, your trusted destination for quality products...</p>
        </section>
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>We strive to provide exceptional service and products to our customers...</p>
        </section>
      </div>
    </div>
  );
}

export default About;
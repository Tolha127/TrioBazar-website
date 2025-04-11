import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">Our Craft</h2>
        <p>At TrioBazar, we believe that well-crafted Islamic clothing should be accessible to everyone. Founded by three siblings with a passion for modest fashion, we've been creating custom wears for over 3 years with a simple mission: to create high-quality, custom-tailored garments that enhance the wearer's confidence and style.</p>
        <p>Each piece is meticulously crafted by our team of skilled artisans who combine traditional tailoring techniques with modern innovations to create garments that are both timeless and contemporary.</p>
        
        <div className="mission-statement">
          <h3>Our Mission</h3>
          <p>"We are dedicated to designing exceptional, timeless attire that transcends age and size, empowering women to embrace their unique beauty and confidence. Our commitment is to deliver clothing that fits flawlessly, celebrates individuality, and enhances every woman's sense of grace, elegance, and strength, allowing her to shine in her own way."</p>
        </div>
        
        <Link to="/about" className="cta-button">Learn More About Us</Link>
      </div>
    </section>
  );
}

export default About;

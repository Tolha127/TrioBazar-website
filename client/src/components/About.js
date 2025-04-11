import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">Our Craft</h2>
        <p>At TrioBazar, we believe that well-crafted Islamic clothing should be accessible to everyone. Founded by three siblings with a passion for modest fashion, we've been creating custom wears for over 3 years with a simple mission: to create high-quality, custom-tailored garments that enhance the wearer's confidence and style.</p>
        <p>Each piece is meticulously crafted by our team of skilled artisans who combine traditional tailoring techniques with modern innovations to create garments that are both timeless and contemporary.</p>
        <Link to="/about" className="cta-button">Learn More About Us</Link>
      </div>
    </section>
  );
}

export default About;

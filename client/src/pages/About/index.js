import React from 'react';
import { useTestimonials } from '../../context/TestimonialContext';
import './About.css';

function About() {
  const { testimonials, getAvatarByGender } = useTestimonials();

  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About TrioBazaar</h1>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>Welcome to TrioBazaar, your trusted destination for quality products...</p>
        </section>
        
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>We are dedicated to designing exceptional, timeless attire that transcends age and size, empowering women to embrace their unique beauty and confidence. Our commitment is to deliver clothing that fits flawlessly, celebrates individuality, and enhances every woman’s sense of grace, elegance, and strength, allowing her to shine in her own way.</p>
        </section>
        
        {/* Testimonials Section (Merged from Testimonials page) */}        <section className="about-section testimonials-section">
          <h2>Customer Testimonials</h2>
          <div className="testimonials-container">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div className="testimonial-card" key={testimonial.id || index}>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">                    <img 
                      src={getAvatarByGender(testimonial.gender)} 
                      alt={`${testimonial.name} avatar`} 
                      className="author-avatar" 
                    />
                    <div>
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-testimonials">
                <p>Be the first to leave a testimonial!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
import React from 'react';
import './About.css';

function About() {
  // Sample testimonials data - in a real app, this could come from a database or API
  const testimonials = [
    {
      id: 1,
      name: "Sarah Ahmed",
      location: "Lagos, Nigeria",
      text: "The abaya I purchased from TrioBazaar exceeded my expectations. The quality of fabric and attention to detail is outstanding!",
      rating: 5
    },
    {
      id: 2,
      name: "Mohammed Ibrahim",
      location: "Abuja, Nigeria",
      text: "I ordered a custom thoub for my wedding and it arrived on time and fit perfectly. The craftsmanship is excellent.",
      rating: 5
    },
    {
      id: 3,
      name: "Fatima Yusuf",
      location: "Kano, Nigeria",
      text: "Very satisfied with my purchase. The hijab material is premium quality and the embroidery is beautiful.",
      rating: 4
    }
  ];

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
          <p>We strive to provide exceptional service and products to our customers...</p>
        </section>
        
        {/* Testimonials Section (Merged from Testimonials page) */}
        <section className="about-section testimonials-section">
          <h2>Customer Testimonials</h2>
          <div className="testimonials-container">
            {testimonials.length > 0 ? (
              testimonials.map(testimonial => (
                <div className="testimonial-card" key={testimonial.id}>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? "star filled" : "star"}>★</span>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <p className="testimonial-author">- {testimonial.name}</p>
                  <p className="testimonial-location">{testimonial.location}</p>
                </div>
              ))
            ) : (
              <p>Testimonials coming soon...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
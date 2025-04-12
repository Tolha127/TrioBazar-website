import React from 'react';
import { useTestimonials } from '../context/TestimonialContext';
import './Testimonials.css';

function Testimonials() {
  const { testimonials, getAvatarByGender } = useTestimonials();

  console.log('Rendering Testimonials component with:', testimonials);

  return (
    <section className="testimonials">
      <h2 className="section-title">What Our Clients Say</h2>
      <div className="testimonials-container">
        <div className="testimonial-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <p className="testimonial-text">"{testimonial.text}"</p>              <div className="testimonial-author">
                <img 
                  src={getAvatarByGender(testimonial.gender)} 
                  alt={`${testimonial.name} avatar`} 
                  className="author-avatar" 
                />
                <div>
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
              <div className="quote-icon">"</div>
            </div>
          ))}
        </div>      </div>
    </section>
  );
}

export default Testimonials;

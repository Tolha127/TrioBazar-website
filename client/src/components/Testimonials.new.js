import React from 'react';
import './Testimonials.css';

function Testimonials() {
  const testimonials = [
    {
      text: "The attention to detail is remarkable. My suit fits perfectly and the quality of the fabric is exceptional. I've never had clothing that fits this well before.",
      name: "Michael Johnson",
      role: "Business Executive",
      avatar: "https://via.placeholder.com/50x50?text=MJ"
    },
    {
      text: "TrioBazar created my wedding suit and it was absolutely perfect. The team was attentive to my preferences and the result exceeded all my expectations.",
      name: "Sarah Williams",
      role: "Satisfied Bride",
      avatar: "https://via.placeholder.com/50x50?text=SW"
    }
  ];

  return (
    <section className="testimonials">
      <h2 className="section-title">What Our Clients Say</h2>
      <div className="testimonials-container">
        <div className="testimonial-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt="Client" className="author-avatar" />
                <div>
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
              <div className="quote-icon">"</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      text: "The attention to detail is remarkable. My abaya fits perfectly and the quality of the fabric is exceptional. I've never had clothing that fits this well before.",
      name: "Aisha Johnson",
      role: "Satisfied Customer",
      avatar: "https://via.placeholder.com/50/50?text=A"
    },
    {
      text: "TrioBazar created my wedding outfit and it was absolutely perfect. The team was attentive to my preferences and the result exceeded all my expectations.",
      name: "Sarah Williams",
      role: "Happy Bride",
      avatar: "https://via.placeholder.com/50/50?text=S"
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

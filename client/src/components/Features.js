import React from 'react';
import './Features.css';

function Features() {
  const features = [
    {
      icon: "✂️",
      title: "Expert Tailoring",
      description: "Our master tailors have decades of experience creating perfect-fitting Islamic garments for any body type."
    },
    {
      icon: "🧵",
      title: "Premium Fabrics",
      description: "We source the finest fabrics from around the world to ensure comfort, durability, and elegance in modest fashion."
    },
    {
      icon: "👔",
      title: "Perfect Fit Guarantee",
      description: "We guarantee a perfect fit or we'll alter your garment at no additional cost."
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Why Choose TrioBazar</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;

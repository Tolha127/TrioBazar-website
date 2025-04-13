import React from 'react';
import { useTestimonials } from '../../context/TestimonialContext';
import './About.css';

function About() {
  const { testimonials, getAvatarByGender } = useTestimonials();

  return (
    <div className="about-page bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <section className="about-section text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About TrioBazaar</h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            Trio Bazaar is an entrepreneural firm dedicated to making both modest and expressive designs for women across ages and regions. They look to breach timeline, culture and trend by creatively blending modesty with several cultures and fashion while they sometimes blend cultures' modesty into one another. They can be just as conservative as they can be contemporary.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Trio Bazaar is led by obeisance to Islamic guide on dressing, therefore, they push towards and encourage the adoption of modesty by what they do.
          </p>
        </section>
      </div>

      <div className="container mx-auto px-4 mt-10">
        <section className="testimonials-section">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Customer Testimonials</h2>
          <div className="testimonials-container space-y-6">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div className="testimonial-card bg-white p-6 rounded-lg shadow-md" key={testimonial.id || index}>
                  <p className="testimonial-text text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <div className="testimonial-author flex items-center">
                    <img 
                      src={getAvatarByGender(testimonial.gender)} 
                      alt={`${testimonial.name} avatar`} 
                      className="author-avatar w-12 h-12 rounded-full mr-4" 
                    />
                    <div>
                      <div className="author-name font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="author-role text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-testimonials text-gray-500 text-center">
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
import React, { useState } from 'react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { useMessages } from '../../context/MessagesContext';
import './Contact.css';

const Contact = () => {
  const { addMessage } = useMessages();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMessage(formData);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitStatus(''), 3000);
  };

  return (
    <div className="contact-page">
      <section className="page-header contact-header">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Contact us for any inquiries or to place an order.</p>
        </div>
      </section>
      
      <section className="section contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>              {submitStatus === 'success' && (
                <div className="success-message">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="5" 
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p>We prioritize personalized service. Reach out to us through any of these channels:</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <h3>Email</h3>                    <p>info@triobazaar.com</p>
                    <a href="mailto:info@triobazaar.com" className="btn btn-outline">Send Email</a>
                  </div>
                </div>
                  <div className="contact-method whatsapp-contact">
                  <FaWhatsapp className="contact-icon" />
                  <div>                    <h3>WhatsApp</h3>
                    <p>+234 916 710 8795</p>
                    <a href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}?text=Hello%20TrioBazaar!%20I'm%20interested%20in%20your%20tailoring%20services.%20I%20would%20like%20to%20know%20more%20about%20your%20offerings.`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Chat on WhatsApp</a>
                  </div>
                </div>
              </div>
              
              <div className="social-media-container">
                <h3>Follow Us</h3>              <div className="social-links">
                  <a href="https://instagram.com/triobazaar" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                    <FaInstagram />
                    <span>Instagram</span>
                  </a>
                  
                  <a href="https://facebook.com/triobazaar" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                    <FaFacebook />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* Map section with Google Maps */}
      <section className="section map-section">
        <div className="container">
          <h2>Our Location</h2>
          <div className="map-container">
            <iframe
              title="TrioBazaar Location"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                &q=${process.env.REACT_APP_STORE_LATITUDE},${process.env.REACT_APP_STORE_LONGITUDE}&zoom=15`}
            ></iframe>
            <div className="address-container">
              <h3>Visit Our Store</h3>
              <p>TrioBazaar Fashion</p>
              <p>Osogbo, Osun State, Nigeria</p>
              <p>Open Monday - Saturday: 9am - 6pm</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
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
                    <a href="https://wa.me/2349167108795?text=Hello%20TrioBazar!%20I'm%20interested%20in%20your%20tailoring%20services.%20I%20would%20like%20to%20know%20more%20about%20your%20offerings." target="_blank" rel="noopener noreferrer" className="btn btn-outline">Chat on WhatsApp</a>
                  </div>
                </div>
              </div>
              
              <div className="social-media-container">
                <h3>Follow Us</h3>
                <div className="social-links">
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
      
      {/* Map section (optional) */}
      <section className="section map-section">
        <div className="container">
          <h2>Our Location</h2>
          <div className="map-container">
            {/* Embed a map here or use an image placeholder */}
            <div className="map-placeholder">Map will be integrated here</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
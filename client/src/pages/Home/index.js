import React from 'react';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import About from '../../components/About';
import Products from '../../components/Products';
import Testimonials from '../../components/Testimonials';
import './Home.css';

const Home = () => {
    return (    <div className="home-page">
      {/* Hero Section */}
      <Hero />
        {/* Features Section */}
      <Features />
      
      {/* About Section */}
      <About />
        {/* Featured Products Section */}
      <Products />
      
      {/* About Preview Section */}
      <section className="section about-preview">
        <div className="container">
          <div className="about-content">          <div className="about-text">
              <h2>About TrioBazaar</h2>              <p>Trio Bazaar is an entrepreneurial firm dedicated to making both modest and expressive designs for women across ages and regions. They look to breach timeline, culture and trend by creatively blending modesty with several cultures and fashion while they sometimes blend cultures' modesty into one another.</p>
              <p>Trio Bazaar is led by obeisance to Islamic guide on dressing, therefore, they push towards and encourage the adoption of modesty by what they do.</p>
              <a href="/about" className="btn btn-secondary learn-more-btn">Learn More</a>
            </div><div className="about-image">
              <img 
                src={require("../../assets/images/triobazaar-logo.png")}
                alt="TrioBazaar Modest Fashion"
                className="about-img"
              />
            </div>
          </div>
        </div>
      </section>      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Contact CTA */}      <section className="section contact-cta">
        <div className="container">
          <h2>Ready to order your custom clothing?</h2>
          <p>Contact us via WhatsApp to discuss your requirements and place an order.</p>
          <a href="https://wa.me/2349167108795?text=Hello%20TrioBazaar!%20I'm%20interested%20in%20your%20tailoring%20services.%20I%20would%20like%20to%20know%20more%20about%20your%20offerings." target="_blank" rel="noopener noreferrer" className="btn btn-primary">Chat on WhatsApp</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
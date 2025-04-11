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
          <div className="about-content">
            <div className="about-text">              <h2>About TrioBazaar</h2>
              <p>Founded by three siblings with a passion for modest fashion, TrioBazaar has been creating custom wears clothing for over 3 years.</p>
              <p>We value modesty, quality craftsmanship, and customer satisfaction in every piece we create.</p>
              <a href="/about" className="btn btn-secondary">Learn More</a>
            </div>            <div className="about-image">
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
          <a href="https://wa.me/2349167108795" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Chat on WhatsApp</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
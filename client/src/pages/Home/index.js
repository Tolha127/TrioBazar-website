import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import StarRating from '../../components/common/StarRating';
import './Home.css';

const Home = () => {
  const { products } = useProducts();
  
  // Get up to 3 featured products (in a real app, you might have a 'featured' flag)
  const featuredProducts = products.slice(0, 3);
  
  return (
    <div className="home-page">      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="business-name">
              <h1 className="triobazaar-title">TrioBazaar</h1>
            </div>
            <h2 className="tagline">Elegant Islamic Clothing</h2>
            <p>Custom-made apparel combining tradition with modern style</p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">View Collections</Link>
              <Link to="/contact" className="btn btn-secondary btn-gold">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="section featured-products">
        <div className="container">
          <h2 className="section-title">Featured Collections</h2>
          <div className="products-grid">
            {featuredProducts.length > 0 ? (              featuredProducts.map(product => (                
                <div className="product-card temu-style" key={product.id}>
                  <Link to={`/products/${product.id}`} className="product-link">
                    <div className="product-image">                    
                      <img 
                        src={product.image === 'placeholder.jpg' ? 
                          'https://via.placeholder.com/300x300?text=Islamic+Clothing' : product.image} 
                        alt={product.name}
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      {product.price && <p className="product-price">{product.price}</p>}                      <p className="product-category">{product.category}</p>
                      <div className="product-meta">
                        <StarRating rating={product.averageRating} size="small" />
                        {product.numReviews > 0 ? (
                          <span className="product-sold">{product.numReviews} {product.numReviews === 1 ? 'Review' : 'Reviews'}</span>
                        ) : (
                          <span className="product-sold">Hot Item</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <>
                <div className="product-card placeholder gold-accent"></div>
                <div className="product-card placeholder lilac-accent"></div>
                <div className="product-card placeholder gold-accent"></div>
              </>
            )}
          </div>
          <div className="view-all-container">
            <Link to="/products" className="btn btn-secondary">View All Collections</Link>
          </div>
        </div>
      </section>
      
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
      </section>
      
      {/* Testimonials Preview */}
      <section className="section testimonials-preview">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {/* Will be populated with actual testimonials later */}
            <div className="testimonial-card placeholder"></div>
            <div className="testimonial-card placeholder"></div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="section contact-cta">
        <div className="container">
          <h2>Ready to order your custom clothing?</h2>
          <p>Contact us via WhatsApp to discuss your requirements and place an order.</p>
          <a href="/contact" className="btn btn-primary">Get in Touch</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
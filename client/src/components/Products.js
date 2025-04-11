import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import StarRating from './common/StarRating';

function Products() {
  const { products } = useProducts();
  // Get up to 3 featured products
  const featuredProducts = products.slice(0, 3);

  return (
    <section id="products" className="products">
      <h2 className="section-title">Featured Collections</h2>
      <div className="products-grid">
        {featuredProducts.length > 0 ? (
          featuredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`}>
                <img 
                  src={product.image === 'placeholder.jpg' ? 
                    'https://via.placeholder.com/400/300?text=Islamic+Clothing' : product.image} 
                  alt={product.name} 
                  className="product-image" 
                />
                <div className="product-details">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <StarRating rating={product.averageRating} size="small" />
                  </div>
                  <Link to={`/products/${product.id}`} className="add-to-cart">
                    Book Fitting
                  </Link>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <>
            <div className="product-card">
              <img src="https://via.placeholder.com/400/300?text=Executive+Collection" alt="Executive Collection" className="product-image" />
              <div className="product-details">
                <h3 className="product-title">Executive Collection</h3>
                <p className="product-price">$599</p>
                <p className="product-description">Elegant and professional Islamic attire for the modern executive.</p>
                <Link to="/products" className="add-to-cart">Book Fitting</Link>
              </div>
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/400/300?text=Wedding+Collection" alt="Wedding Collection" className="product-image" />
              <div className="product-details">
                <h3 className="product-title">Wedding Collection</h3>
                <p className="product-price">$899</p>
                <p className="product-description">Custom wedding attire designed to make your special day even more memorable.</p>
                <Link to="/products" className="add-to-cart">Book Fitting</Link>
              </div>
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/400/300?text=Casual+Collection" alt="Casual Collection" className="product-image" />
              <div className="product-details">
                <h3 className="product-title">Casual Collection</h3>
                <p className="product-price">$349</p>
                <p className="product-description">Versatile modest pieces perfect for both work and weekend outings.</p>
                <Link to="/products" className="add-to-cart">Book Fitting</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Products;

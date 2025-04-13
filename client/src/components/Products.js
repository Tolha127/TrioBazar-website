import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import StarRating from './common/StarRating';
import './Products.css';

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
            <div className="product-card" key={product._id}>
              <>
                <Link to={`/products/${product._id}`}>
                  <img 
                    src={product.image === 'placeholder.jpg' ? 
                      'https://via.placeholder.com/400/300?text=Islamic+Clothing' : product.image} 
                    alt={product.name} 
                    className="product-image" 
                  />
                </Link>
                <div className="product-details">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <StarRating rating={product.averageRating} size="small" />
                  </div>
                  <Link to={`/products/${product._id}`} className="add-to-cart">
                    Book Fitting
                  </Link>
                </div>
              </>
            </div>
          ))        ) : (
          <div className="no-products-message">
            <p>No products found in the database. Please add products through the admin panel.</p>
            <Link to="/admin" className="add-to-cart">Go to Admin Panel</Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;

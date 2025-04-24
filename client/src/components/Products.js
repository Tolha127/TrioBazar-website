import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import StarRating from './common/StarRating';
import './Products.css';
import '../pages/Products/product-images.css';

function Products() {
  const { products } = useProducts();
  
  // Sort products by creation date (newest first) and get up to 3
  const featuredProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  return (
    <section id="products" className="products">
      <h2 className="section-title">Featured Collections</h2>
      <div className="products-grid">
        {featuredProducts.length > 0 ? (
          featuredProducts.map(product => (            <div className="product-card" key={product._id}>
              <Link to={`/products/${product._id}`}>
                <div className="featured-product-image">
                  <img 
                    src={product.image === 'placeholder.jpg' ? 
                      'https://via.placeholder.com/400/300?text=Islamic+Clothing' : 
                      (product.image.startsWith('http') ? 
                        product.image : // Use Cloudinary URL as is
                        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image}`) // For legacy paths
                    } 
                    alt={product.name}
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.src = 'https://via.placeholder.com/400/300?text=Image+Not+Found';
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <div className="product-meta">
                    <StarRating rating={product.averageRating} size="small" />
                  </div>
                  <span className="view-details">View Details</span>
                </div>
              </Link>
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

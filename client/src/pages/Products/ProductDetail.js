import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import './Products.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const { products } = useProducts();
  const navigate = useNavigate();
    // Find the product with matching ID - convert productId to number for comparison
  const product = products.find(p => p.id === parseInt(productId) || p.id === productId);
  
  // Handle case where product is not found
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-not-found">
            <h2>Product Not Found</h2>
            <p>Sorry, the product you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-detail-page">
      <section className="page-header">
        <div className="container">
          <h1>{product.name}</h1>
        </div>
      </section>
      
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-content">
            <div className="product-detail-image">
              <img 
                src={product.image === 'placeholder.jpg' ? 
                  'https://via.placeholder.com/600x600?text=Islamic+Clothing' : product.image} 
                alt={product.name}
              />
            </div>            <div className="product-detail-info">
              <h2>{product.name}</h2>
              {product.code && <p className="product-code">Product Code: {product.code}</p>}
              <p className="product-category">Category: {product.category}</p>
              {product.price && <p className="product-price">{product.price}</p>}
              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description || "No description available for this product."}</p>
              </div>
              
              {/* Display any additional product details that might be added in the future */}
              {product.material && (
                <div className="product-material">
                  <h3>Material</h3>
                  <p>{product.material}</p>
                </div>
              )}
              
              {product.sizes && (
                <div className="product-sizes">
                  <h3>Available Sizes</h3>
                  <p>{product.sizes}</p>
                </div>
              )}
              
              {product.colors && (
                <div className="product-colors">
                  <h3>Available Colors</h3>
                  <p>{product.colors}</p>
                </div>
              )}                <div className="product-actions">                <a 
                  href={`https://wa.me/2348120254838?text=Hello%20TrioBazaar,%20I'm%20interested%20in%20your%20${product.name}%20(Product%20Code:%20${product.code}).%20Please%20provide%20more%20information.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <span className="whatsapp-icon">💬</span> Enquire via WhatsApp
                </a>
                <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

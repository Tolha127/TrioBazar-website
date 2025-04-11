import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ImagePreviewModal from '../../components/common/ImagePreviewModal';
import './Products.css';

const Products = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewImage, setPreviewImage] = useState(null);
  
  // Get unique categories for filter
  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);
    
  // Open image preview modal
  const openImagePreview = (image, alt) => {
    setPreviewImage({ src: image, alt });
  };
  
  // Close image preview modal
  const closeImagePreview = () => {
    setPreviewImage(null);
  };
  
  return (
    <div className="products-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Products</h1>
        </div>
      </section>
        <section className="section">
        <div className="container">
          {products.length === 0 ? (
            <p>No products available at the moment.</p>
          ) : (
            <React.Fragment>
              {previewImage && (
                <ImagePreviewModal 
                  image={previewImage.src} 
                  alt={previewImage.alt} 
                  onClose={closeImagePreview} 
                />
              )}
              <div className="product-filters">
                <div className="category-filter">
                  <label>Filter by Category:</label>
                  <div className="filter-buttons">
                    {categories.map(category => (
                      <button 
                        key={category}
                        className={selectedCategory === category ? 'active' : ''}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image">
                      <img 
                        src={product.image === 'placeholder.jpg' ? 
                          'https://via.placeholder.com/300x300' : product.image} 
                        alt={product.name}
                        onClick={() => openImagePreview(
                          product.image === 'placeholder.jpg' ? 
                            'https://via.placeholder.com/800x800' : product.image, 
                          product.name
                        )}
                        className="clickable-image"
                      />
                      <div className="image-overlay">
                        <span className="zoom-icon">🔍</span>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      {product.price && <p className="product-price">{product.price}</p>}
                      {product.description && <p className="product-description">{product.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
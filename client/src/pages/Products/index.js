import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import StarRating from '../../components/common/StarRating';
import ImagePreviewModal from '../../components/common/ImagePreviewModal';
import './Products.css';
import './product-images.css';

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
              <div className="products-grid">                {filteredProducts.map(product => (
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
                        {product.price && <p className="product-price">{product.price}</p>}
                        <p className="product-category">{product.category}</p>
                        <div className="product-meta">
                          <StarRating rating={product.averageRating} size="small" />
                          {product.numReviews > 0 ? (
                            <span className="product-sold">{product.numReviews} {product.numReviews === 1 ? 'Review' : 'Reviews'}</span>
                          ) : (
                            <span className="product-sold">Hot Item</span>
                          )}
                        </div>
                        {product.description && <p className="product-description">{product.description.length > 60 ? 
                          product.description.substring(0, 60) + '...' : product.description}</p>}                        <a 
                          href={`https://wa.me/2349167108795?text=Hello%20TrioBazaar,%20I'm%20interested%20in%20your%20${product.name}%20(Product%20Code:%20${product.code}).%20Please%20provide%20more%20information.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-enquiry"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Enquire via WhatsApp
                        </a>
                      </div>
                    </Link>
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
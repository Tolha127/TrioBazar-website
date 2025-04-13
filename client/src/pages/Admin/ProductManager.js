import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Admin.css';
import { useProducts } from '../../context/ProductContext';

const ProductManager = () => {
  // Use products from context instead of local state
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const location = useLocation();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Check if we're on the "add product" route and show the form automatically
  useEffect(() => {
    if (location.pathname === '/admin/products/add') {
      setShowAddForm(true);
    }
  }, [location.pathname]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
    price: '',
    image: null
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };
  
  const handleFileChange = (e) => {
    setNewProduct({
      ...newProduct,
      image: e.target.files[0]
    });
  };
  // Function to auto-generate product code based on category
  const generateProductCode = (category) => {
    // Create category prefix (first 2 letters + first letter of second word if exists)
    let prefix = '';
    const words = category.split(' ');
    if (words.length > 0) {
      prefix += words[0].substring(0, 2).toUpperCase();
      if (words.length > 1) {
        prefix += words[1].substring(0, 1).toUpperCase();
      }
    } else {
      prefix = 'PR'; // Default prefix if category is empty
    }
    
    // Use timestamp to ensure uniqueness - combine current time and a random number
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Combine prefix with timestamp to ensure uniqueness
    return `${prefix}-${timestamp.toString().slice(-6)}${randomPart}`;
  };
  const [error, setError] = useState('');
  
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    try {
      // Basic validation
      if (!newProduct.name || newProduct.name.trim().length < 3) {
        setError('Product name must be at least 3 characters');
        return;
      }
      
      if (!newProduct.category) {
        setError('Category is required');
        return;
      }
      
      // Auto-generate product code if not provided
      const productCode = newProduct.code || generateProductCode(newProduct.category);
      
      // Create product with auto-generated fields
      await addProduct({
        name: newProduct.name,
        code: productCode,
        category: newProduct.category,
        description: newProduct.description || '',
        price: newProduct.price || '0',
        image: newProduct.image || 'placeholder.jpg',
        createdAt: new Date().toISOString(),
        ratings: [],
        averageRating: 0,
        numReviews: 0,
        inStock: true,
        featured: false
      });
      
      // Reset form on success
      setNewProduct({
        name: '',
        code: '',
        category: '',
        description: '',
        price: '',
        image: null
      });
      
      setShowAddForm(false);
      alert('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to add product. Please try again.');
    }
  };
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setNewProduct({
      name: product.name,
      code: product.code,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image
    });
    setShowEditForm(true);
  };
  
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    
    updateProduct(editingProductId, {
      name: newProduct.name,
      code: newProduct.code,
      category: newProduct.category,
      description: newProduct.description,
      price: newProduct.price,
      image: typeof newProduct.image === 'object' ? URL.createObjectURL(newProduct.image) : newProduct.image
    });
    
    // Reset form
    setNewProduct({
      name: '',
      code: '',
      category: '',
      description: '',
      price: '',
      image: null
    });
    
    setShowEditForm(false);
    setEditingProductId(null);
  };
  
  return (
    <AdminLayout>
      <div className="product-manager">
        <div className="admin-header">
          <h1>Product Management</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FaPlus /> Add New Product
          </button>
        </div>
        
        {showAddForm && (
          <div className="add-product-form">            <h2>Add New Product</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleAddProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={newProduct.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="code">Product Code</label>
                  <input 
                    type="text" 
                    id="code" 
                    name="code" 
                    value={newProduct.code} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select 
                    id="category" 
                    name="category" 
                    value={newProduct.category} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Children">Children</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Price (Optional)</label>
                  <input 
                    type="text" 
                    id="price" 
                    name="price" 
                    value={newProduct.price} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={newProduct.description} 
                  onChange={handleInputChange} 
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <input 
                  type="file" 
                  id="image" 
                  name="image" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Product</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {showEditForm && (
          <div className="add-product-form">
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input 
                    type="text" 
                    id="edit-name" 
                    name="name" 
                    value={newProduct.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="code">Product Code</label>
                  <input 
                    type="text" 
                    id="edit-code" 
                    name="code" 
                    value={newProduct.code} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select 
                    id="edit-category" 
                    name="category" 
                    value={newProduct.category} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Children">Children</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Price (Optional)</label>
                  <input 
                    type="text" 
                    id="edit-price" 
                    name="price" 
                    value={newProduct.price} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="edit-description" 
                  name="description" 
                  value={newProduct.description} 
                  onChange={handleInputChange} 
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <input 
                  type="file" 
                  id="edit-image" 
                  name="image" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                />
                {typeof newProduct.image === 'string' && newProduct.image !== 'placeholder.jpg' && (
                  <div className="current-image">
                    <p>Current image:</p>
                    <img src={newProduct.image} alt="Current product" style={{maxHeight: '100px'}} />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Update Product</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingProductId(null);
                    setNewProduct({
                      name: '',
                      code: '',
                      category: '',
                      description: '',
                      price: '',
                      image: null
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Code</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="product-image">
                      <img 
                        src={product.image === 'placeholder.jpg' ? 
                          'https://via.placeholder.com/50' : product.image} 
                        alt={product.name} 
                      />
                    </div>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.code}</td>
                  <td>{product.category}</td>
                  <td>
                    <div className="action-buttons">                      <button className="edit-btn" onClick={() => handleEditProduct(product)}>
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductManager;
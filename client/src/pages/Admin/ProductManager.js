import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Admin.css';
import { useProducts } from '../../context/ProductContext';

const ProductManager = () => {
  // Use products from context including the deleteAllProducts function
  const { products, addProduct, updateProduct, deleteProduct, deleteAllProducts } = useProducts();
  const location = useLocation(); // Initialize the useLocation hook
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    code: '',
    category: '',
    description: '',
    price: '',
    image: null
  });
  
  // Check if we're on the "add product" route and show the form automatically
  useEffect(() => {
    if (location.pathname === '/admin/products/add') {
      setShowAddForm(true);
    }
  }, [location.pathname]);
  
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
    const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      // Check if we have a new image file to upload
      if (typeof newProduct.image === 'object' && newProduct.image instanceof File) {
        // Create form data for image upload
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('code', newProduct.code);
        formData.append('category', newProduct.category);
        formData.append('description', newProduct.description || '');
        formData.append('price', newProduct.price || '0');
        formData.append('image', newProduct.image);
        
        // Get admin token
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }
        
        // Use the API directly to use the with-image endpoint
        const response = await fetch(`/api/products/${editingProductId}/with-image`, {
          method: 'PUT',
          headers: {
            'x-auth-token': token
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
        
        // Update successful
        alert('Product updated successfully!');
      } else {
        // No new image, use regular update
        await updateProduct(editingProductId, {
          name: newProduct.name,
          code: newProduct.code,
          category: newProduct.category,
          description: newProduct.description,
          price: newProduct.price,
          image: newProduct.image
        });
        
        alert('Product updated successfully!');
      }
      
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
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product. Please try again.');
    }
  };
  const handleDeleteAllProducts = async () => {
    try {
      const result = await deleteAllProducts();
      setShowDeleteAllConfirm(false);
      
      // Display more detailed information about what was deleted
      if (result && result.deletedCount > 0) {
        alert(`Operation successful!\n${result.deletedCount} products deleted.\n${result.imagesDeleted || 0} product images removed.`);
      } else {
        alert('No products were found to delete.');
      }
    } catch (err) {
      console.error('Error deleting all products:', err);
      setError(err.message || 'Failed to delete all products. Please try again.');
      setShowDeleteAllConfirm(false);
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
  
  return (
    <AdminLayout>
      <div className="product-manager">
        <div className="admin-header">
          <h1>Product Management</h1>
          <div className="admin-actions">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <FaPlus /> Add New Product
            </button>
            {products.length > 0 && (
              <button 
                className="btn btn-danger"
                onClick={() => setShowDeleteAllConfirm(true)}
              >
                <FaTrash /> Delete All Products
              </button>
            )}
          </div>
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

      {/* Delete All Products Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <div className="modal-header">
              <h3><FaExclamationTriangle /> Confirm Deletion</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete ALL products? This action cannot be undone.</p>
              <p><strong>This will permanently remove {products.length} products from your database.</strong></p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={handleDeleteAllProducts}
              >
                Yes, Delete All Products
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteAllConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductManager;
import React, { useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Admin.css';
import { useProducts } from '../../context/ProductContext';

const ProductManager = () => {
  // Use products from context instead of local state
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  
  const [showAddForm, setShowAddForm] = useState(false);
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
    const handleAddProduct = (e) => {
    e.preventDefault();
    // In a real app, you'd upload the image and send data to your API
    
    addProduct({
      name: newProduct.name,
      code: newProduct.code,
      category: newProduct.category,
      description: newProduct.description,
      price: newProduct.price,
      image: newProduct.image ? URL.createObjectURL(newProduct.image) : 'placeholder.jpg'
    });
    
    setNewProduct({
      name: '',
      code: '',
      category: '',
      description: '',
      price: '',
      image: null
    });
    
    setShowAddForm(false);
  };
  
  const handleDeleteProduct = (id) => {
    deleteProduct(id);
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
          <div className="add-product-form">
            <h2>Add New Product</h2>
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
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
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
                    <div className="action-buttons">
                      <button className="edit-btn">
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteProduct(product.id)}
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
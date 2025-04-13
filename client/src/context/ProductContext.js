import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  // Add a new product
  const addProduct = async (product) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Check if product contains an actual File object for the image
      if (product.image instanceof File) {
        // Use FormData for image upload
        const formData = new FormData();
        
        // Add all product fields to the FormData
        for (const key in product) {
          if (key === 'image') {
            formData.append('image', product.image);
          } else {
            formData.append(key, product[key]);
          }
        }
        
        const config = {
          headers: {
            'x-auth-token': token,
            // Don't set Content-Type here, it will be set automatically with boundary
          }
        };
        
        // Use the with-image endpoint for FormData/image upload
        const response = await api.post('/products/with-image', formData, config);
        setProducts([...products, response.data]);
        return response.data;
      } else {
        // No actual file, use regular JSON endpoint
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        
        // Remove any URL.createObjectURL references that can't be processed by the server
        if (typeof product.image === 'string' && product.image.startsWith('blob:')) {
          product.image = 'placeholder.jpg';
        }
        
        const response = await api.post('/products', product, config);
        setProducts([...products, response.data]);
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update a product
  const updateProduct = async (id, updatedProduct) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      const response = await api.put(`/products/${id}`, updatedProduct, config);
      setProducts(products.map(product => 
        product._id === id ? response.data : product
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await api.delete(`/products/${id}`, config);
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add a rating to a product
  const addRating = async (productId, rating) => {
    try {
      const response = await api.post(`/products/${productId}/ratings`, rating);
      setProducts(products.map(product => 
        product._id === productId ? response.data : product
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addRating
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

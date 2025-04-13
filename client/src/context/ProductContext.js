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
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      const response = await api.post('/products', product, config);
      setProducts([...products, response.data]);
      return response.data;
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

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
  }, []);  const fetchProducts = async () => {
    try {
      console.log('Fetching products from server...');
      // Add cache-busting parameter to prevent browser caching
      const timestamp = new Date().getTime();
      const response = await api.get(`/products?_t=${timestamp}`);
      console.log('Products fetched:', response.data.length);
      
      // Process image paths to ensure they're correctly formatted
      const processedProducts = response.data.map(product => {
        // Make sure image paths are properly formatted
        if (product.image && typeof product.image === 'string') {
          // If the path doesn't include the full URL and starts with /uploads
          if (product.image.startsWith('/uploads')) {
            // Prepend the server URL (assuming it's at localhost:5000)
            product.image = `http://localhost:5000${product.image}`;
          }
        }
        return product;
      });
      setProducts(processedProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setLoading(false);
    }
  };// Add a new product
  const addProduct = async (product) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Check if token exists
      if (!token) {
        console.error('Authentication token not found. Please log in again.');
        throw new Error('No authentication token found. Please log in.');
      }
        // Check if product contains an actual File object for the image
      if (product.image instanceof File) {
        // Use FormData for image upload
        const formData = new FormData();
          // Make sure all required fields are present and valid
        // The server requires name, code, and category to be non-empty
        if (!product.name || product.name.length < 3) {
          throw new Error('Product name is required and must be at least 3 characters');
        }
        if (!product.category) {
          throw new Error('Product category is required');
        }
        
        // Generate a unique product code if not provided or if it's too short
        // This helps prevent duplicate key errors
        if (!product.code || product.code.length < 5) {
          // Generate a code with timestamp and random numbers for uniqueness
          const timestamp = new Date().getTime();
          const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          product.code = `${timestamp.toString().slice(-6)}${randomPart}`;
        }
        
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
        };        // Use the with-image endpoint for FormData/image upload
        const response = await api.post('/products/with-image', formData, config);
        
        // First add the new product to the local state immediately
        const newProduct = response.data;
        setProducts(prevProducts => [...prevProducts, newProduct]);
        
        // Then fetch all products to ensure everything is in sync
        await fetchProducts();
        
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
  };  // Delete a product
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('No admin token found. Please log in again.');
        throw new Error('Authentication required. Please log in.');
      }

      // Set authorization headers for the delete request - IMPORTANT: Use this format for axios.delete
      console.log(`Attempting to delete product with ID: ${id}`);
      
      // Send the delete request with proper configuration
      const response = await api.delete(`/products/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      console.log('Delete response:', response.data);
      
      // Update local state to remove deleted product
      setProducts(products.filter(product => product._id !== id));
      return true;
    } catch (err) {
      console.error('Delete product error:', err.response ? err.response.data : err.message);
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
  };  // Delete all products
  const deleteAllProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      // Using correct axios syntax for delete with headers
      const response = await api.delete('/products/delete-all', {
        headers: {
          'x-auth-token': token
        }
      });
      
      // Force clear the local storage cache if any
      localStorage.removeItem('cachedProducts');
      
      // Clear products from state after deletion
      setProducts([]);
      
      // Force a refetch from the server to ensure state is synchronized
      await fetchProducts();
      
      // Return the response data with more information
      return {
        success: true,
        deletedCount: response.data.deletedCount,
        imagesDeleted: response.data.imagesDeleted,
        message: response.data.message
      };
    } catch (err) {
      console.error('Delete all products error:', err);
      setError(err.message);
      throw err;
    }
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addRating,
    deleteAllProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

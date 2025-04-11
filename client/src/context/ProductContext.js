import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const ProductContext = createContext();

// Initial dummy products
const initialProducts = [
  { id: 1, name: 'Floral Abaya', code: 'AB-101', category: 'Women', price: '$79.99', description: 'Beautiful floral design abaya, perfect for special occasions.', image: 'placeholder.jpg' },
  { id: 2, name: 'Embroidered Hijab', code: 'HJ-202', category: 'Women', price: '$29.99', description: 'Elegant embroidered hijab with premium fabric.', image: 'placeholder.jpg' },
  { id: 3, name: 'Islamic Thoub', code: 'TH-303', category: 'Men', price: '$89.99', description: 'Classic Islamic thoub with modern comfort.', image: 'placeholder.jpg' },
];

// Provider component
export const ProductProvider = ({ children }) => {
  // Try to load products from localStorage, or use initial dummy data
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('trioBazarProducts');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trioBazarProducts', JSON.stringify(products));
  }, [products]);

  // Add a new product
  const addProduct = (product) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...product, id: newId };
    setProducts([...products, newProduct]);
  };

  // Delete a product
  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Update a product
  const updateProduct = (updatedProduct) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for using the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

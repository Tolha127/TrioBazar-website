import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/Home/index.js';
import AboutPage from './pages/About';
import ProductsPage from './pages/Products/index.js';
import ProductDetail from './pages/Products/ProductDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/Admin/Login';
import { ProductProvider } from './context/ProductContext';
import { TestimonialProvider } from './context/TestimonialContext';
import { ViewsProvider } from './context/ViewsContext';
import { MessagesProvider } from './context/MessagesContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductManager from './pages/Admin/ProductManager';
import TestimonialManager from './pages/Admin/TestimonialManager';
import MessagesManager from './pages/Admin/MessagesManager';
import './App.css';
import './assets/styles/global.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <TestimonialProvider>
          <MessagesProvider>
            <Router>
              <ScrollToTop />
              <ViewsProvider>
                <div className="app">
                  <Header />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:productId" element={<ProductDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                      
                      {/* Admin protected routes */}
                      <Route element={<PrivateRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/products" element={<ProductManager />} />
                        <Route path="/admin/products/add" element={<ProductManager />} />
                        <Route path="/admin/testimonials" element={<TestimonialManager />} />
                        <Route path="/admin/messages" element={<MessagesManager />} />
                      </Route>
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ViewsProvider>
            </Router>
          </MessagesProvider>
        </TestimonialProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
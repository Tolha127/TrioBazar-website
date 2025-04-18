import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
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
import PrivateRoute from './components/common/PrivateRoute';
import AdminDashboard from './pages/Admin/Dashboard';
import ProductManager from './pages/Admin/ProductManager';
import TestimonialManager from './pages/Admin/TestimonialManager';
import MessagesManager from './pages/Admin/MessagesManager';
import './App.css';
import './assets/styles/global.css';

function App() {
  return (
    <ProductProvider>
      <TestimonialProvider>
        <MessagesProvider>
          <Router>
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
                  {/* Added explicit route for /admin to redirect to login */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin" element={<PrivateRoute />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="products/add" element={<ProductManager />} />
                    <Route path="testimonials" element={<TestimonialManager />} />
                    <Route path="messages" element={<MessagesManager />} />
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
  );
}

export default App;
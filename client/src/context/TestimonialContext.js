import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TestimonialContext = createContext();

export const useTestimonials = () => useContext(TestimonialContext);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const TestimonialProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_URL}/testimonials`);
      setTestimonials(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const addTestimonial = async (testimonial) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      const response = await axios.post(`${API_URL}/testimonials`, testimonial, config);
      setTestimonials([...testimonials, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTestimonial = async (updatedTestimonial) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      const response = await axios.put(
        `${API_URL}/testimonials/${updatedTestimonial._id}`,
        updatedTestimonial,
        config
      );
      setTestimonials(
        testimonials.map(item => 
          item._id === updatedTestimonial._id ? response.data : item
        )
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.delete(`${API_URL}/testimonials/${id}`, config);
      setTestimonials(testimonials.filter(testimonial => testimonial._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getAvatarByGender = (gender) => {
    return gender === "female"
      ? "https://cdn.pixabay.com/photo/2014/04/02/14/10/female-306407_960_720.png" 
      : "https://cdn.pixabay.com/photo/2014/04/02/14/10/male-306408_960_720.png";
  };

  const value = {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getAvatarByGender
  };

  return (
    <TestimonialContext.Provider value={value}>
      {children}
    </TestimonialContext.Provider>
  );
};

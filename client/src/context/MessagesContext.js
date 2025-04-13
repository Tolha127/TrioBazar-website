import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const MessagesContext = createContext();

export const useMessages = () => useContext(MessagesContext);

const API_URL = 'http://localhost:5000/api';

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      fetchMessages();
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const response = await axios.get(`${API_URL}/messages`, config);
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const addMessage = async (message) => {
    try {
      const response = await axios.post(`${API_URL}/messages`, message);
      if (localStorage.getItem('adminToken')) {
        setMessages([...messages, response.data]);
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const response = await axios.put(`${API_URL}/messages/${id}/read`, {}, config);
      setMessages(
        messages.map(message => 
          message._id === id ? response.data : message
        )
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      await axios.delete(`${API_URL}/messages/${id}`, config);
      setMessages(messages.filter(message => message._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    messages,
    loading,
    error,
    addMessage,
    markAsRead,
    deleteMessage
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

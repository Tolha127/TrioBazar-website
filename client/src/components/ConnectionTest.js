import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/test');
        setStatus(response.data.message);
      } catch (error) {
        setStatus(`Connection failed: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc' }}>
      <h3>Server Connection Status:</h3>
      <p>{status}</p>
    </div>
  );
};

export default ConnectionTest;

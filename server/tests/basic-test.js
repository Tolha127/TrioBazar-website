// Simple test for TrioBazar enhancements
console.log('Starting basic TrioBazar feature test...');

// Import requirements
const axios = require('axios');

// Test base API connection
const testAPIConnection = async () => {
  try {
    console.log('\nTesting API connection...');
    const response = await axios.get('http://localhost:5000/api/test');
    console.log('✅ API Connection successful:', response.data);
    return true;
  } catch (error) {
    console.log('❌ API Connection failed:', error.message);
    return false;
  }
};

// Test search functionality
const testSearch = async () => {
  try {
    console.log('\nTesting search functionality...');
    const response = await axios.get('http://localhost:5000/api/products');
    console.log(`✅ Search successful: Found ${response.data.length} products`);
    
    // Check for headers to verify compression and accessibility features
    console.log('\nChecking response headers:');
    const headers = response.headers;
    console.log('- Content-Type:', headers['content-type'] || 'Not found');
    console.log('- Cache-Control:', headers['cache-control'] || 'Not found');
    console.log('- API Version:', headers['x-api-version'] || 'Not found');
    
    return true;
  } catch (error) {
    console.log('❌ Search test failed:', error.message);
    return false;
  }
};

// Run tests
const runTests = async () => {
  const isConnected = await testAPIConnection();
  if (isConnected) {
    await testSearch();
  }
  console.log('\nTest completed.');
};

// Execute tests
runTests();

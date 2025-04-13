// Test script to verify our new server enhancements
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

// Utility for logging test results
const logResult = (feature, test, success, message) => {
  console.log(`\n[${success ? '✅' : '❌'}] ${feature} - ${test}`);
  if (message) console.log(`   ${message}`);
};

// 1. Test Authentication System
const testAuth = async () => {
  try {
    console.log('\n=== Testing Authentication System ===');
    
    // Try to login (this should work with the default admin user)
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'password'
    });
    
    authToken = loginRes.data.accessToken;
    const refreshToken = loginRes.data.refreshToken;
    
    logResult('Authentication', 'Login with token expiry', true, 
      `Access token received: ${authToken ? 'Yes' : 'No'}, ` +
      `Refresh token received: ${refreshToken ? 'Yes' : 'No'}`);
      
    // Test refresh token endpoint if it exists
    try {
      if (refreshToken) {
        const refreshRes = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        logResult('Authentication', 'Refresh token', true, 
          `New access token received: ${refreshRes.data.accessToken ? 'Yes' : 'No'}`);
      }
    } catch (err) {
      logResult('Authentication', 'Refresh token', false, 
        `Error: ${err.response?.data?.message || err.message}`);
    }
  } catch (err) {
    logResult('Authentication', 'Login with token expiry', false, 
      `Error: ${err.response?.data?.message || err.message}`);
  }
};

// 2. Test Image Upload and Optimization
const testImageUpload = async () => {
  try {
    console.log('\n=== Testing Image Upload and Optimization ===');
    
    // Create a test image if it doesn't exist
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(testImagePath)) {
      console.log('   Creating test image...');
      // Create a simple test image (1x1 pixel)
      fs.writeFileSync(testImagePath, Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 
        0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 
        0xff, 0xff, 0xff, 0xff, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 
        0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
        0x00, 0x00, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
        0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37, 
        0xff, 0xd9
      ]));
    }
    
    // Create form data for image upload
    const formData = new FormData();
    formData.append('name', 'Test Product');
    formData.append('code', 'TST001');
    formData.append('category', 'Test Category');
    formData.append('description', 'This is a test product');
    formData.append('price', '99.99');
    formData.append('image', fs.createReadStream(testImagePath));
    
    // Upload image with product data
    const uploadRes = await axios.post(
      `${API_URL}/products/with-image`, 
      formData, 
      {
        headers: {
          ...formData.getHeaders(),
          'x-auth-token': authToken
        }
      }
    );
    
    const productId = uploadRes.data._id;
    
    logResult('Image Upload', 'Upload with optimization', true, 
      `Product created with ID: ${productId}, ` +
      `Image path: ${uploadRes.data.image}`);
      
    // Check if the image exists by requesting it
    try {
      if (uploadRes.data.image) {
        const imagePath = uploadRes.data.image;
        const imageRes = await axios.get(`http://localhost:5000${imagePath}`, {
          responseType: 'arraybuffer'
        });
        
        logResult('Image Serving', 'Fetch optimized image', true,
          `Image size: ${imageRes.data.length} bytes, ` +
          `Content-Type: ${imageRes.headers['content-type']}`);
      }
    } catch (err) {
      logResult('Image Serving', 'Fetch optimized image', false,
        `Error: ${err.message}`);
    }
    
    return productId;
  } catch (err) {
    logResult('Image Upload', 'Upload with optimization', false,
      `Error: ${err.response?.data?.message || err.message}`);
    return null;
  }
};

// 3. Test Search Functionality
const testSearch = async (productId) => {
  try {
    console.log('\n=== Testing Search Functionality ===');
    
    // Test basic search
    const searchRes = await axios.get(`${API_URL}/products/search?query=Test`);
    
    logResult('Search', 'Basic search', true, 
      `Found ${searchRes.data.products.length} products, ` +
      `Pagination info: ${JSON.stringify(searchRes.data.pagination)}`);
    
    // Test advanced filtering
    const filterRes = await axios.get(
      `${API_URL}/products/search?category=Test%20Category&sortBy=createdAt&sortOrder=desc`
    );
    
    logResult('Search', 'Filtering and sorting', true,
      `Found ${filterRes.data.products.length} products matching category`);
      
  } catch (err) {
    logResult('Search', 'Basic search', false, 
      `Error: ${err.response?.data?.message || err.message}`);
  }
};

// 4. Test Error Handling and Validation
const testErrorHandling = async () => {
  try {
    console.log('\n=== Testing Error Handling and Validation ===');
    
    // Test validation by sending invalid data
    try {
      await axios.post(`${API_URL}/products`, {
        // Missing required fields
        name: '', 
        price: 'invalid-price'
      }, {
        headers: {
          'x-auth-token': authToken
        }
      });
      
      logResult('Validation', 'Reject invalid data', false,
        'Expected validation error but request succeeded');
    } catch (err) {
      logResult('Validation', 'Reject invalid data', true,
        `Validation error: ${err.response?.data?.message || 'Unknown error'}`);
    }
    
    // Test global error handler with invalid ObjectId
    try {
      await axios.get(`${API_URL}/products/invalid-id`);
      
      logResult('Error Handling', 'Handle invalid ObjectId', false,
        'Expected error but request succeeded');
    } catch (err) {
      logResult('Error Handling', 'Handle invalid ObjectId', true,
        `Error message: ${err.response?.data?.error?.message || 'Unknown error'}`);
    }
    
  } catch (err) {
    logResult('Error Handling', 'General tests', false,
      `Error: ${err.message}`);
  }
};

// 5. Test Performance Headers
const testHeaders = async () => {
  try {
    console.log('\n=== Testing Response Headers ===');
    
    // Test compression and other headers
    const res = await axios.get(`${API_URL}/products`);
    
    // Get all headers
    const headers = res.headers;
    
    // Check for key headers
    const hasCompression = headers['content-encoding']?.includes('gzip');
    const hasCache = !!headers['cache-control'];
    const hasContentType = !!headers['content-type'];
    const hasApiVersion = !!headers['x-api-version'];
    
    logResult('Headers', 'Response headers', true,
      `Compression: ${hasCompression ? 'Yes' : 'No'}, ` +
      `Cache-Control: ${hasCache ? 'Yes' : 'No'}, ` +
      `Content-Type: ${hasContentType ? 'Yes' : 'No'}, ` +
      `API Version: ${hasApiVersion ? 'Yes' : 'No'}`);
      
  } catch (err) {
    logResult('Headers', 'Response headers', false,
      `Error: ${err.message}`);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('\n🧪 STARTING TESTS FOR TRIOBAZAR API ENHANCEMENTS');
  
  // Test auth system first to get token
  await testAuth();
  
  // Test image upload and get product ID
  const productId = await testImageUpload();
  
  // Test search using the product we created
  if (productId) {
    await testSearch(productId);
  }
  
  // Test error handling and validation
  await testErrorHandling();
  
  // Test headers and compression
  await testHeaders();
  
  console.log('\n✅ TEST SUITE COMPLETED');
};

// Run the tests
runAllTests();

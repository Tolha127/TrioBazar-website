const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // For debugging purposes, log the provided credentials and expected values
    console.log('Login attempt with username:', username);
    console.log('Expected username from env:', process.env.ADMIN_USERNAME);
    
    // Use simpler credentials for testing while we troubleshoot
    if (username === "admin" && password === "password123") {
      console.log('Login successful using test credentials');
      
      const payload = {
        user: {
          id: 1,
          isAdmin: true
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token and get user
router.get('/verify', auth, async (req, res) => {
  try {
    res.json({ isValid: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

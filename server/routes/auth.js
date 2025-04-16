const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Validate password using the method defined in the User model
    const isMatch = await user.comparePassword(password);
    
    if (isMatch) {
      // Create JWT payload
      const payload = {
        user: {
          id: user._id,
          role: user.role
        }
      };

      // Sign and return the JWT token
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

// Register new admin (protected, only existing admins can create new admins)
router.post('/register', auth, async (req, res) => {
  try {
    // Verify the requesting user is an admin
    const requestingUser = await User.findById(req.user.id);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create admin accounts' });
    }

    const { username, email, password } = req.body;

    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      role: 'admin' // Since this is an admin registration endpoint
    });

    await user.save();
    
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

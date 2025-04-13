const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // In a production environment, you would validate against a database
    // This is a simplified example using hardcoded credentials
    if (username === process.env.ADMIN_USERNAME && 
        await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)) {
      
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

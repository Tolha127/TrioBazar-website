const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Basic authentication middleware that verifies JWT tokens
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user id from decoded token
    const userId = decoded.user.id;

    // Find user in database to ensure they still exist and are active
    const user = await User.findById(userId);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Check if user is still active
    if (!user.isActive) {
      return res.status(401).json({ message: 'User account is disabled' });
    }
    
    // Add user info to request object
    req.user = {
      id: user._id,
      role: user.role
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

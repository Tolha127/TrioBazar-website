/**
 * Security Headers Middleware
 * Adds essential security headers to all responses in production environments
 */

const securityHeaders = (req, res, next) => {
  // Only apply security headers in production
  if (process.env.NODE_ENV === 'production') {
    // Prevent clickjacking attacks
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Help protect against XSS attacks
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enforce HTTPS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Control what features and APIs can be used in the browser
    res.setHeader('Feature-Policy', "camera 'none'; microphone 'none'; geolocation 'none'");
    
    // Control which resources are allowed to be loaded
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'");
  }
  
  next();
};

module.exports = securityHeaders;

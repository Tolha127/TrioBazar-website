// Middleware to add accessibility and descriptive headers
const accessibilityHeaders = (req, res, next) => {
  // Add Content-Language header
  res.setHeader('Content-Language', 'en');
  
  // Add X-Content-Type-Options to prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Add descriptive API version header
  res.setHeader('X-API-Version', '1.0');
  
  // Add Cache-Control directives for better caching behavior
  if (req.method === 'GET') {
    // Cache GET requests for 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
  } else {
    // Don't cache non-GET requests
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

module.exports = accessibilityHeaders;

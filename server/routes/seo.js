const express = require('express');
const router = express.Router();
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const Product = require('../models/Product');

// Store the sitemap in memory to avoid regenerating it on every request
let sitemap;

router.get('/sitemap.xml', async (req, res) => {
  try {
    // If we have a sitemap in cache, serve it
    if (sitemap) {
      res.header('Content-Type', 'application/xml');
      res.header('Content-Encoding', 'gzip');
      return res.send(sitemap);
    }

    // Create a new sitemap stream
    const smStream = new SitemapStream({
      hostname: 'https://triobazaar.com'
    });
    
    // Add static pages
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/about', changefreq: 'weekly', priority: 0.7 });
    smStream.write({ url: '/products', changefreq: 'daily', priority: 0.9 });
    smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.6 });
    
    // Add dynamic product pages
    const products = await Product.find({}, 'id createdAt');
    products.forEach(product => {
      smStream.write({
        url: `/products/${product._id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: product.createdAt.toISOString()
      });
    });
    
    // End stream
    smStream.end();
    
    // Generate sitemap and store it in memory as a gzipped result
    const pipeline = smStream.pipe(createGzip());
    sitemap = await streamToPromise(pipeline);
    
    // Set headers and send response
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    res.send(sitemap);
    
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ message: 'Error generating sitemap' });
  }
});

// Create robots.txt route
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(
    `User-agent: *
Allow: /
Sitemap: https://triobazaar.com/api/seo/sitemap.xml`
  );
});

module.exports = router;

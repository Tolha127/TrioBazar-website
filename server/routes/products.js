const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productSchema } = require('../validations/productValidation');
const { productSearchSchema } = require('../validations/searchValidation');
const { uploadAndOptimizeProductImages } = require('../middleware/imageUpload');
const { deleteFromCloudinary } = require('../utils/cloudStorage');
const path = require('path');
const fs = require('fs');

// Add a new product without image upload (basic JSON endpoint)
router.post('/', auth, validate(productSchema), async (req, res, next) => {
  try {
    const { name, code, category, description, price, image } = req.body;
    
    // Create a new product
    const newProduct = new Product({
      name,
      code,
      category,
      description,
      price,
      image: image || 'placeholder.jpg',
      createdAt: new Date(),
    });
    
    // Save to database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

// Add a new product with image upload and optimization
router.post('/with-image', auth, uploadAndOptimizeProductImages('image'), async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('File received:', req.file);
    
    // Basic validation since we moved validation after file upload
    if (!req.body.name || !req.body.code || !req.body.category) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        requiredFields: ['name', 'code', 'category'],
        receivedFields: Object.keys(req.body)
      });
    }
    
    // Create a new product with Cloudinary image url
    const newProduct = new Product({
      name: req.body.name,
      code: req.body.code,
      category: req.body.category,
      description: req.body.description || '',
      price: req.body.price || '0',
      // If image was uploaded, use the Cloudinary URL
      image: req.body.imageUrl || 'placeholder.jpg',
      // Store Cloudinary public ID for future operations
      imagePublicId: req.body.imagePublicId || null,
      createdAt: new Date(),
    });

    // Save to database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

// Get products with search, filtering, sorting and pagination
router.get('/search', validate(productSearchSchema), async (req, res, next) => {
  try {
    const { 
      query, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
      
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all products (simpler version without complex filtering)
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Get a single product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Update a product
router.put('/:id', auth, validate(productSchema), async (req, res, next) => {
  try {
    const { name, code, category, description, price, image } = req.body;
    
    // Find the product first
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, code, category, description, price, image },
      { new: true }
    );
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Update product with image
router.put('/:id/with-image', auth, uploadAndOptimizeProductImages('image'), async (req, res, next) => {
  try {
    // Find the product first
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create update object
    const updateData = {
      name: req.body.name,
      code: req.body.code,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price
    };
    
    // If new image was uploaded to Cloudinary
    if (req.body.imageUrl) {
      updateData.image = req.body.imageUrl;
      updateData.imagePublicId = req.body.imagePublicId;
      
      // Delete old image from Cloudinary if it exists and is not a placeholder
      if (product.imagePublicId) {
        try {
          await deleteFromCloudinary(product.imagePublicId);
          console.log(`Deleted old image with public ID: ${product.imagePublicId}`);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
          // Continue with update even if deletion fails
        }
      }
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Delete all products (admin only)
router.delete('/delete-all', auth, async (req, res, next) => {
  try {
    // Check if user is admin (you can add additional role checking here)
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Force a refresh of the database
    console.log('Attempting to delete all products from database...');
    
    // Get all products to delete their images from Cloudinary
    const products = await Product.find();
    let imagesDeleted = 0;
    
    // Delete all non-placeholder images from Cloudinary
    for (const product of products) {
      try {
        if (product.imagePublicId) {
          await deleteFromCloudinary(product.imagePublicId);
          imagesDeleted++;
        }
      } catch (imageErr) {
        console.error('Error deleting image from Cloudinary:', imageErr);
        // Continue with deletion even if image deletion fails
      }
    }
    
    // Delete all products from database with force option
    const result = await Product.deleteMany({});
    
    // Log activity for audit purposes
    console.log(`[${new Date().toISOString()}] Admin ${req.user.id} deleted all products. Count: ${result.deletedCount}, Images removed: ${imagesDeleted}`);
    
    // Return success even if count is 0 to ensure client updates
    res.json({ 
      message: 'All products deleted successfully', 
      deletedCount: result.deletedCount,
      imagesDeleted
    });} catch (error) {
    console.error('Error in delete all products:', error);
    next(error);
  }
});

// Delete a product by ID
router.delete('/:id', auth, async (req, res, next) => {
  try {
    // Find product first to get image details
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete image from Cloudinary if it exists and has a public ID
    if (product.imagePublicId) {
      try {
        const result = await deleteFromCloudinary(product.imagePublicId);
        console.log(`Deleted image from Cloudinary: ${product.imagePublicId}`, result);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete product
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

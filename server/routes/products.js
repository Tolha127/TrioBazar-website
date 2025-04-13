const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productSchema } = require('../validations/productValidation');
const { productSearchSchema } = require('../validations/searchValidation');
const { uploadAndOptimizeProductImages, processedDir } = require('../middleware/imageUpload');
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
router.post('/with-image', auth, uploadAndOptimizeProductImages('image'), validate(productSchema), async (req, res, next) => {
  try {
    // Create a new product with optimized image
    const newProduct = new Product({
      name: req.body.name,
      code: req.body.code,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      // If image was uploaded, use the optimized image path
      image: req.file ? `/uploads/processed/${path.basename(req.file.path)}` : 'placeholder.jpg',
      createdAt: new Date(),
    });

    // Save to database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
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
    
    // If new image was uploaded
    if (req.file) {
      updateData.image = `/uploads/processed/${path.basename(req.file.path)}`;
      
      // Remove old image if it exists and is not a placeholder
      if (product.image && product.image !== 'placeholder.jpg' && product.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(processedDir, path.basename(product.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
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

// Delete a product
router.delete('/:id', auth, async (req, res, next) => {
  try {
    // Find product first to get image path
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Remove image if it exists and is not a placeholder
    if (product.image && product.image !== 'placeholder.jpg' && product.image.startsWith('/uploads/')) {
      const imagePath = path.join(processedDir, path.basename(product.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete product
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
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

module.exports = router;

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Add a new product
router.post('/', auth, async (req, res) => {
  try {
    const { name, code, category, description, price, image } = req.body;

    // Validate required fields
    if (!name || !code || !category) {
      return res.status(400).json({ message: 'Name, code, and category are required.' });
    }

    // Create a new product
    const newProduct = new Product({
      name,
      code,
      category,
      description,
      price,
      image,
      createdAt: new Date(),
    });

    // Save to database
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Could not add product.' });
  }
});

module.exports = router;

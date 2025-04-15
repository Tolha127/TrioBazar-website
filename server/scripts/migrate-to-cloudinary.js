/**
 * Migration Script: Local Images to Cloudinary
 * 
 * This script finds all products with local image paths,
 * uploads those images to Cloudinary, and updates the database records
 * with the new Cloudinary URLs and public IDs.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Path to uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
const processedDir = path.join(uploadsDir, 'processed');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    migrateImages();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateImages() {
  try {
    console.log('Starting migration of local images to Cloudinary...');
    
    // Find products with local image paths (images that start with '/uploads/')
    const products = await Product.find({
      image: { $regex: '^/uploads/', $options: 'i' }
    });
    
    console.log(`Found ${products.length} products with local images`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        // Skip if already has imagePublicId (already migrated)
        if (product.imagePublicId) {
          console.log(`Product ${product._id} already has Cloudinary image. Skipping.`);
          continue;
        }
        
        // Get local file path from image URL
        const imagePath = path.join(
          process.cwd(),
          product.image.replace(/^\/uploads\/processed\//, 'uploads/processed/')
        );
        
        console.log(`Processing product: ${product._id}, Image: ${product.image}`);
        
        // Check if file exists
        if (!fs.existsSync(imagePath)) {
          console.error(`Image file not found: ${imagePath}`);
          errorCount++;
          continue;
        }
        
        // Upload to Cloudinary
        console.log(`Uploading to Cloudinary: ${imagePath}`);
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: 'products',
          use_filename: true,
          unique_filename: true
        });
        
        // Update product in database
        await Product.findByIdAndUpdate(product._id, {
          image: result.secure_url,
          imagePublicId: result.public_id
        });
        
        console.log(`✅ Successfully migrated product: ${product._id}`);
        console.log(`   Old image: ${product.image}`);
        console.log(`   New image: ${result.secure_url}`);
        successCount++;
      } catch (err) {
        console.error(`Error processing product ${product._id}:`, err);
        errorCount++;
      }
    }
    
    console.log('\nMigration Complete!');
    console.log(`Successfully migrated: ${successCount} products`);
    console.log(`Failed migrations: ${errorCount} products`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

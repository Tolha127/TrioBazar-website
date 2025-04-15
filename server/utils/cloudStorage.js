/**
 * Cloud Storage Utility
 * 
 * This module provides functions for storing uploaded files in Cloudinary,
 * which is more appropriate for a production deployment.
 * 
 * Implementation uses Cloudinary for image storage and transformations.
 * 
 * Required environment variables in .env:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file to Cloudinary
 * @param {Object} file - The file object from multer
 * @param {String} folder - Folder within Cloudinary (e.g., 'original', 'processed')
 * @returns {Promise<Object>} - The Cloudinary upload result containing URL and other metadata
 */
const uploadToCloudinary = async (file, folder = 'products') => {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });
    
    // After successful upload to Cloudinary, delete the local file
    fs.unlinkSync(file.path);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Deletes a file from Cloudinary
 * @param {String} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - The Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};

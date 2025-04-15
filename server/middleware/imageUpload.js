const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { uploadToCloudinary } = require('../utils/cloudStorage');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const processedDir = path.join(uploadsDir, 'processed');
const originalDir = path.join(uploadsDir, 'original');

// Ensure directories exist
[uploadsDir, processedDir, originalDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, originalDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Filter only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: fileFilter
});

// Image optimization middleware
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = req.file.filename;
    const outputFilename = `optimized-${filename}`;
    const outputPath = path.join(processedDir, outputFilename);

    // Process the image locally - resize and optimize
    await sharp(req.file.path)
      .resize(800) // Resize to max width of 800px
      .jpeg({ quality: 80 }) // Optimize quality
      .toFile(outputPath);

    // Update the req.file to point to processed image
    req.file.originalPath = req.file.path;
    req.file.path = outputPath;
    req.file.filename = outputFilename;
    req.file.optimized = true;
    
    // Optionally clean up the original file to save space
    // This is safe because we have the processed image
    try {
      fs.unlinkSync(req.file.originalPath);
    } catch (cleanupError) {
      console.log('Note: Could not remove original file:', cleanupError.message);
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Cloud upload middleware - uploads optimized image to Cloudinary
const uploadToCloud = async (req, res, next) => {
  if (!req.file || !req.file.optimized) return next();

  try {
    // Upload the optimized image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file, 'products');
    
    // Store Cloudinary information in the request object
    req.cloudinary = cloudinaryResult;
    
    // Add the secure URL to the request body for easy access
    req.body.imageUrl = cloudinaryResult.url;
    req.body.imagePublicId = cloudinaryResult.publicId;
    
    // Clean up the local file after successful Cloudinary upload
    try {
      fs.unlinkSync(req.file.path);
      console.log(`Removed local file ${req.file.path} after Cloudinary upload`);
    } catch (cleanupError) {
      console.log('Note: Could not remove processed file after upload:', cleanupError.message);
      // Non-critical error, continue with the request
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

// Function to handle image upload, optimization and cloud storage
const uploadAndOptimizeProductImages = (fieldName) => {
  return [
    upload.single(fieldName),
    optimizeImage,
    uploadToCloud
  ];
};

module.exports = {
  upload,
  optimizeImage,
  uploadToCloud,
  uploadAndOptimizeProductImages,
  uploadsDir,
  processedDir
};

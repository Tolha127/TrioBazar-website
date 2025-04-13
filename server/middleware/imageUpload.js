const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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

    // Process the image - resize and optimize
    await sharp(req.file.path)
      .resize(800) // Resize to max width of 800px
      .jpeg({ quality: 80 }) // Optimize quality
      .toFile(outputPath);

    // Update the req.file to point to processed image
    req.file.originalPath = req.file.path;
    req.file.path = outputPath;
    req.file.filename = outputFilename;
    req.file.optimized = true;

    next();
  } catch (error) {
    next(error);
  }
};

// Function to handle multiple image upload and optimization
const uploadAndOptimizeProductImages = (fieldName) => {
  return [
    upload.single(fieldName),
    optimizeImage
  ];
};

module.exports = {
  upload,
  optimizeImage,
  uploadAndOptimizeProductImages,
  uploadsDir,
  processedDir
};

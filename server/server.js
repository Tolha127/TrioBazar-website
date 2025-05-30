const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const errorLogger = require('./middleware/errorLogger');
const accessibilityHeaders = require('./middleware/accessibilityHeaders');
const securityHeaders = require('./middleware/securityHeaders');

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy - required for apps running behind a reverse proxy like Render or Heroku
app.set('trust proxy', 1);

// Security headers
app.use(helmet());
app.use(securityHeaders); // Custom security headers for production

// CORS configuration - more permissive for development
app.use(cors({
  origin: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : process.env.NODE_ENV === 'production' 
      ? ['https://triobazar-client.onrender.com', 'https://triobazaar.com', 'https://trio-bazar-website.vercel.app']
      : ['http://localhost:3000', 'http://127.0.0.1:3000', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Requested-With', 'Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all requests
app.use(limiter);

// More strict rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: 'Too many login attempts, please try again after an hour'
});

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Add compression middleware
app.use(compression());

// Add accessibility headers middleware
app.use(accessibilityHeaders);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Standard middleware with increased limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running and connected!' });
});

// MongoDB Atlas Connection with improved pooling and reconnection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trioBazaar';

// Add more detailed connection logging
const isAtlasConnection = MONGODB_URI.includes('mongodb.net');
console.log(`Attempting to connect to MongoDB ${isAtlasConnection ? 'Atlas' : 'local'} database`);

// Enhanced connection with optimized settings for MongoDB Atlas
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: 120000, // Doubled timeout for operations from 60s to 120s
  connectTimeoutMS: 60000, // Doubled timeout for initial connection from 30s to 60s
  keepAlive: true,
  maxPoolSize: isAtlasConnection ? 50 : 100, // Reduced for Atlas to prevent connection issues
  serverSelectionTimeoutMS: 60000, // Significantly increased from 20s to 60s
  heartbeatFrequencyMS: 10000, // Added regular heartbeat to keep connection alive
  retryWrites: true,
  bufferCommands: true, // Ensure commands are buffered when disconnected
  // ssl: true is redundant since it's already in the Atlas connection string
  // Removed bufferMaxEntries option as it's not supported in newer MongoDB drivers
  autoIndex: false, // Disable automatic indexing for better performance
  w: 'majority', // Added write concern for Atlas
  readPreference: isAtlasConnection ? 'secondaryPreferred' : 'primary' // Better read scaling for Atlas
})
.then(() => {
  console.log(`MongoDB ${isAtlasConnection ? 'Atlas' : 'local'} Connected Successfully`);
  // Log database name to ensure we're connected to the right database
  console.log(`Connected to database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.log('MongoDB Connection Error:', err);
  if (isAtlasConnection) {
    console.log('Please check your Atlas connection string and network connectivity');
  } else {
    console.log('Please ensure your local MongoDB service is running properly');
  }
});

// Add connection event handlers
mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

// Handle application termination - close the connection properly
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/seo', require('./routes/seo'));

// Error logging middleware - must be before error handler
app.use(errorLogger);

// Global error handler middleware - must be after all routes and the error logger
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

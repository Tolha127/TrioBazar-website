/**
 * Environment configuration for the TrioBazar website
 * This file centralizes environment-specific settings
 */

// API URL configuration with fallback
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Authentication settings
export const AUTH_CONFIG = {
  tokenExpiryHours: 24,
  storageKeys: {
    token: 'adminToken',
    role: 'userRole',
    loginTime: 'loginTime'
  }
};

// Image upload settings
export const UPLOAD_CONFIG = {
  maxSizeMB: 5,
  acceptedImageTypes: 'image/jpeg, image/png, image/gif, image/webp',
  defaultQuality: 0.8
};

// Feature flags
export const FEATURES = {
  enableCloudinaryStorage: process.env.REACT_APP_ENABLE_CLOUDINARY === 'true',
  enableAnalytics: process.env.NODE_ENV === 'production'
};

// Production-specific settings
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// App info
export const APP_INFO = {
  name: 'TrioBazar',
  version: '1.0.0'
};

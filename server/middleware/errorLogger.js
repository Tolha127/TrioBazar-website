const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create error log file path with current date
const getLogFilePath = () => {
  const now = new Date();
  const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return path.join(logsDir, `error-${dateString}.log`);
};

// Format error for logging
const formatError = (err, req) => {
  return {
    timestamp: new Date().toISOString(),
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user.id : 'unauthenticated',
    userAgent: req.get('User-Agent')
  };
};

// Log error to file
const logErrorToFile = (errorInfo) => {
  const logFilePath = getLogFilePath();
  const errorLog = JSON.stringify(errorInfo) + '\n';
  
  fs.appendFile(logFilePath, errorLog, (err) => {
    if (err) {
      console.error('Failed to write to error log:', err);
    }
  });
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  // Format and log the error
  const errorInfo = formatError(err, req);
  
  // Log to console
  console.error('\x1b[31m%s\x1b[0m', '--- ERROR ---');
  console.error(errorInfo);
  
  // Log to file
  logErrorToFile(errorInfo);
  
  // Pass control to the next middleware (usually the error handler)
  next(err);
};

module.exports = errorLogger;

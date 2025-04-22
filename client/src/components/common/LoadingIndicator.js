import React from 'react';
import './LoadingIndicator.css';

/**
 * A reusable loading indicator component for use across the application
 * @param {Object} props - Component props
 * @param {boolean} props.fullScreen - Whether to display the loading indicator fullscreen
 * @param {string} props.message - Optional message to display with the loading indicator
 */
const LoadingIndicator = ({ fullScreen = false, message = 'Loading...' }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingIndicator;

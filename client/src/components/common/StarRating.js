import React from 'react';
import './StarRating.css';

/**
 * StarRating component - Displays star ratings based on a number value
 * 
 * @param {Object} props
 * @param {number} props.rating - Rating value from 0 to 5
 * @param {boolean} props.editable - If true, allows clicking to set rating
 * @param {function} props.onChange - Callback when rating changes (for editable mode)
 * @returns {JSX.Element}
 */
const StarRating = ({ rating = 0, editable = false, onChange, size = 'medium' }) => {
  // Convert rating to nearest 0.5 increment for half-star display
  const roundedRating = Math.round(rating * 2) / 2;
  
  const handleStarClick = (selectedRating) => {
    if (editable && onChange) {
      onChange(selectedRating);
    }
  };
  
  // Create array of 5 stars
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let starClass = 'star-empty';
    
    if (i <= roundedRating) {
      // Full star
      starClass = 'star-full';
    } else if (i - 0.5 === roundedRating) {
      // Half star
      starClass = 'star-half';
    }
    
    stars.push(
      <span 
        key={i} 
        className={`star ${starClass} ${editable ? 'star-editable' : ''} star-${size}`}
        onClick={() => handleStarClick(i)}
        title={editable ? `Rate ${i} stars` : `${rating} out of 5 stars`}
      >
        {starClass === 'star-half' ? '★' : (starClass === 'star-full' ? '★' : '☆')}
      </span>
    );
  }
  
  return (
    <div className="star-rating">
      {stars}
      {roundedRating > 0 && (
        <span className="rating-number">
          {roundedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;

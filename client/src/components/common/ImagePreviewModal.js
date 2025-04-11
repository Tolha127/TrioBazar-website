import React from 'react';
import './ImagePreviewModal.css';

const ImagePreviewModal = ({ image, alt, onClose }) => {
  // Close modal when clicking outside the image
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('image-preview-modal')) {
      onClose();
    }
  };

  return (
    <div className="image-preview-modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <img src={image} alt={alt} />
      </div>
    </div>
  );
};

export default ImagePreviewModal;

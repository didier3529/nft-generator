import React from 'react';

const ImagePreview = ({ imageUrl }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="image-preview">
      <h3>Image Preview</h3>
      <div className="preview-container">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="preview-image"
        />
      </div>
    </div>
  );
};

export default ImagePreview; 
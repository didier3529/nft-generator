import React, { useRef, useState } from 'react';
import './UploadTraits.css';

const UploadTraits = () => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Prevent default drag behaviors
  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drag enter
  const handleDragEnter = (e) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  // Handle drop event
  const handleDrop = (e) => {
    handleDragEvents(e);
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
    // TODO: Handle file processing
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    // TODO: Handle file processing
  };

  // Handle click on upload area
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className="upload-traits-wrap">
        <h3 className="section-title">Upload Trait</h3>
        <div className="upload-area-wrap">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, video/webm"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div
            className={`upload-area ${isDragging ? 'drag-over' : ''}`}
            onClick={handleUploadClick}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEvents}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            Drag & Drop Image Here
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadTraits; 
import React, { useState } from 'react';

const TestPreview = () => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    // Reset error state
    setError('');
    
    // Validate file exists
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Only image files allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be <5MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      console.log('File loaded successfully');
      setPreview(e.target.result);
      setError('');
    };
    
    reader.onerror = () => {
      console.error('FileReader error:', reader.error);
      setError('Failed to read file');
    };
    
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError('');
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px dashed #ccc',
      maxWidth: '500px',
      margin: '20px auto',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ 
        marginTop: 0, 
        marginBottom: '20px',
        color: '#333'
      }}>
        Image Preview Tester
      </h2>
      
      <div style={{
        marginBottom: '20px'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      {error && (
        <p style={{ 
          color: '#f44336',
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </p>
      )}
      
      {preview && (
        <div style={{ 
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            marginBottom: '10px'
          }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain'
              }} 
              onError={() => setError('Failed to load image')}
            />
          </div>
          <button 
            onClick={handleRemove}
            style={{
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            Remove Preview
          </button>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <p style={{ margin: '0', color: '#1976d2' }}>
          Test Instructions:
        </p>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Try uploading different image types (PNG, JPG)</li>
          <li>Try uploading a file larger than 5MB</li>
          <li>Try uploading a non-image file</li>
          <li>Check if preview displays correctly</li>
          <li>Test the remove functionality</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPreview; 
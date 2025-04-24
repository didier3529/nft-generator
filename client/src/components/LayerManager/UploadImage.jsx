import React, { useState } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useDropzone } from 'react-dropzone';

const UploadImage = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleUpload = async (files) => {
    const file = files[0];
    if (!file) return;
    
    // Reset states
    setUploading(true);
    setSuccess(false);
    setError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPEG, GIF, etc.)');
      setUploading(false);
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      setUploading(false);
      return;
    }
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    try {
      // Call the parent component's upload handler
      await onUploadComplete(file);
      setSuccess(true);
      
      // Reset progress and success after 3 seconds
      setTimeout(() => {
        setProgress(0);
        setSuccess(false);
        setUploading(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Upload failed');
      setUploading(false);
      clearInterval(progressInterval);
      setProgress(0);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    disabled: uploading
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : error ? 'error.main' : success ? 'success.main' : 'grey.400',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          backgroundColor: isDragActive ? 'primary.50' : error ? 'error.50' : success ? 'success.50' : 'grey.50',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: !uploading && !success && !error ? 'grey.100' : undefined
          }
        }}
      >
        <input {...getInputProps()} />
        
        <CloudUploadIcon
          color={error ? 'error' : success ? 'success' : 'primary'}
          sx={{ fontSize: 48, mb: 1 }}
        />
        
        {success ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="body1" color="success.main">
              Upload successful!
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <ErrorIcon color="error" />
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color={isDragActive ? 'primary.main' : 'text.secondary'}>
            {isDragActive
              ? 'Drop image here...'
              : 'Drag & drop an image here, or click to select'}
          </Typography>
        )}
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Supports PNG, JPG, GIF up to 5MB
        </Typography>
      </Box>
      
      {uploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
            Uploading... {progress}%
          </Typography>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component="label"
          disabled={uploading}
          startIcon={<CloudUploadIcon />}
        >
          Upload New Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.length) {
                handleUpload(Array.from(e.target.files));
              }
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default UploadImage; 
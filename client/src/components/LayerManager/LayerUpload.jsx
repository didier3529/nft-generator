import React from 'react';
import { Box } from '@mui/material';
import { useLayerStore } from '../../stores';
import UploadImage from './UploadImage';

const LayerUpload = ({ category }) => {
  const uploadLayer = useLayerStore((state) => state.uploadLayer);

  const handleUploadComplete = async (file) => {
    try {
      await uploadLayer(file, category);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <UploadImage onUploadComplete={handleUploadComplete} />
    </Box>
  );
};

export default LayerUpload; 
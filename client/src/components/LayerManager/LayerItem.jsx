import React from 'react';
import { Card, CardMedia, CardActions, IconButton, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useLayerStore } from '../../stores';

// Flag to control whether to use server paths or preview data URLs
const USE_PREVIEW_DATA = true;

const LayerItem = ({ layer, category }) => {
  const deleteLayer = useLayerStore((state) => state.deleteLayer);

  const handleDelete = async () => {
    try {
      // Use the passed category or fallback to layer.category for backward compatibility
      const layerCategory = category || layer.category;
      await deleteLayer(layerCategory, layer.name);
    } catch (error) {
      console.error('Error deleting layer:', error);
    }
  };

  // Choose the best available image source
  let imageUrl;
  if (USE_PREVIEW_DATA && layer.preview) {
    // Use the base64 preview data directly
    imageUrl = layer.preview;
  } else if (layer.path) {
    // Use the server path
    imageUrl = `http://localhost:5000${layer.path}`;
  } else {
    // Fallback to a default image
    imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  }

  return (
    <Card sx={{ width: 180, m: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        bgcolor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <IconButton size="small" sx={{ cursor: 'grab' }}>
          <DragHandleIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <CardMedia
        component="img"
        height="120"
        image={imageUrl}
        alt={layer.name}
        sx={{ objectFit: 'contain', p: 1 }}
      />
      
      <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" noWrap title={layer.name}>
          {layer.name}
        </Typography>
      </Box>
      
      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <IconButton 
          size="small" 
          color="error" 
          onClick={handleDelete}
          aria-label="delete layer"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default LayerItem; 
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LayerItem from './LayerItem';
import { useLayerStore } from '../../stores';

const LayerList = ({ category }) => {
  // Track if we've already loaded layers for this category
  const [categoryLoaded, setCategoryLoaded] = useState(false);
  
  const layers = useLayerStore((state) => state.layers);
  const isLoading = useLayerStore((state) => state.isLoading);
  const error = useLayerStore((state) => state.error);
  const getLayers = useLayerStore((state) => state.getLayers);
  const reorderLayers = useLayerStore((state) => state.reorderLayers);

  // Only load layers once per category and when category changes
  useEffect(() => {
    if (!categoryLoaded) {
      getLayers(category);
      setCategoryLoaded(true);
    }
  }, [category, getLayers, categoryLoaded]);

  // Reset loaded state when category changes
  useEffect(() => {
    setCategoryLoaded(false);
  }, [category]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error: {error}
      </Typography>
    );
  }

  const categoryLayers = layers[category] || [];

  const handleDragEnd = (result) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // If position didn't change
    if (sourceIndex === destinationIndex) {
      return;
    }

    // Update store
    reorderLayers(category, sourceIndex, destinationIndex);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {category} Layers ({categoryLayers.length})
      </Typography>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`droppable-${category}`} direction="horizontal">
          {(provided) => (
            <Grid 
              container 
              spacing={2}
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ display: 'flex', flexWrap: 'wrap' }}
            >
              {categoryLayers.map((layer, index) => (
                <Draggable 
                  key={layer.name} 
                  draggableId={`${category}-${layer.name}`} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Grid 
                      item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        opacity: snapshot.isDragging ? 0.6 : 1,
                        transform: snapshot.isDragging ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <LayerItem layer={layer} category={category} />
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default LayerList; 
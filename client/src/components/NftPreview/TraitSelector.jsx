import React, { useEffect, useCallback, useState } from 'react';
import {
  Box, 
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  ButtonGroup,
  Divider
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLayerStore } from '../../stores';

const TraitSelector = () => {
  // Track initialization to prevent repeated calls
  const [initialized, setInitialized] = useState(false);
  
  // Get data and actions from store
  const layers = useLayerStore((state) => state.layers);
  const selectedTraits = useLayerStore((state) => state.selectedTraits);
  const selectTrait = useLayerStore((state) => state.selectTrait);
  const randomizeTraits = useLayerStore((state) => state.randomizeTraits);
  const resetTraitSelection = useLayerStore((state) => state.resetTraitSelection);
  const getLayers = useLayerStore((state) => state.getLayers);
  const isLoading = useLayerStore((state) => state.isLoading);

  // Define categories
  const categories = ['Background', 'Body', 'Eyes', 'Mouth', 'Accessories'];

  // Fetch layers only once on component mount
  useEffect(() => {
    if (!initialized) {
      const fetchAllLayers = async () => {
        for (const category of categories) {
          await getLayers(category);
        }
        setInitialized(true);
      };
      
      fetchAllLayers();
    }
  }, [initialized, getLayers, categories]);

  // Handle trait selection change
  const handleTraitChange = (category, traitId) => {
    selectTrait(category, traitId);
  };

  return (
    <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Trait Selection
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {categories.map((category) => {
          const categoryLayers = layers[category] || [];
          const selectedTraitId = selectedTraits[category];
          
          return (
            <Box key={category} sx={{ mb: 2 }}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id={`${category}-label`}>{category}</InputLabel>
                <Select
                  labelId={`${category}-label`}
                  id={`${category}-select`}
                  value={selectedTraitId || ''}
                  label={category}
                  onChange={(e) => handleTraitChange(category, e.target.value)}
                  disabled={isLoading || categoryLayers.length === 0}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categoryLayers.map((layer) => (
                    <MenuItem key={layer.id || layer.name} value={layer.id || layer.name}>
                      {layer.name || layer.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {categoryLayers.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  No {category.toLowerCase()} traits available
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<ShuffleIcon />}
          onClick={randomizeTraits}
          disabled={isLoading || Object.values(layers).every(l => !l || l.length === 0)}
        >
          Randomize
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={resetTraitSelection}
          disabled={isLoading || Object.keys(selectedTraits).length === 0}
        >
          Reset
        </Button>
      </Box>
    </Card>
  );
};

export default TraitSelector; 
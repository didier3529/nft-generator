import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Divider,
  Grid,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Chip,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMetadataStore, useLayerStore } from '../../stores';

const MetadataEditor = () => {
  const {
    metadata,
    traitMetadata,
    updateCollectionMetadata,
    updateTraitMetadata,
    updateTraitRarity,
    addTraitCategory,
    addTrait
  } = useMetadataStore();

  const { layers } = useLayerStore();

  // Local state for form fields
  const [collectionForm, setCollectionForm] = useState({
    name: metadata.name || '',
    description: metadata.description || '',
    symbol: metadata.symbol || '',
    baseUri: metadata.baseUri || '',
    externalUrl: metadata.externalUrl || '',
    sellerFeeBasisPoints: metadata.sellerFeeBasisPoints || 0
  });

  const [feedback, setFeedback] = useState({
    show: false,
    message: '',
    severity: 'success'
  });

  // Set default description if empty when component mounts
  useEffect(() => {
    if (!metadata.description) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const defaultDescription = `Unique 1/1 NFT generated on ${formattedDate}`;
      
      // Update both local state and store
      setCollectionForm(prev => ({
        ...prev,
        description: defaultDescription
      }));
      
      // Update the store with the default description
      updateCollectionMetadata({ description: defaultDescription });
    }
  }, []);

  // Update local form when global state changes
  useEffect(() => {
    setCollectionForm({
      name: metadata.name || '',
      description: metadata.description || '',
      symbol: metadata.symbol || '',
      baseUri: metadata.baseUri || '',
      externalUrl: metadata.externalUrl || '',
      sellerFeeBasisPoints: metadata.sellerFeeBasisPoints || 0
    });
  }, [metadata]);

  // Memoized function to sync layers with trait metadata to prevent infinite loop
  const syncLayersWithTraitMetadata = useCallback(() => {
    // Track which categories we've processed to avoid duplicates
    const processedCategories = new Set();
    
    Object.keys(layers).forEach(category => {
      // Only process each category once and only if it doesn't exist in trait metadata
      if (!processedCategories.has(category) && !traitMetadata[category]) {
        processedCategories.add(category);
        addTraitCategory(category, category);
        
        // Add any uploaded layers as traits if they don't exist
        if (layers[category] && layers[category].length > 0) {
          layers[category].forEach(layer => {
            const traitName = layer.name || layer.id;
            if (traitName) {
              addTrait(category, traitName, {
                rarity: 100,
                displayName: traitName
              });
            }
          });
        }
      }
    });
  }, [layers, traitMetadata, addTraitCategory, addTrait]);

  // Initialize trait metadata for categories that exist in layers but not in traitMetadata
  useEffect(() => {
    syncLayersWithTraitMetadata();
  }, [syncLayersWithTraitMetadata]);

  const handleCollectionChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'sellerFeeBasisPoints') {
      // Convert percentage to basis points (0-10000)
      processedValue = Math.min(10000, Math.max(0, parseInt(value) || 0));
    }
    
    setCollectionForm(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSaveCollection = () => {
    updateCollectionMetadata(collectionForm);
    setFeedback({
      show: true,
      message: 'Collection metadata saved successfully',
      severity: 'success'
    });
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleRarityChange = (category, traitName, newRarity) => {
    updateTraitRarity(category, traitName, newRarity);
  };

  const handleTraitMetadataChange = (category, field, value) => {
    updateTraitMetadata(category, { [field]: value });
  };

  const getTraitDisplayName = (category, traitName) => {
    return traitMetadata[category]?.traits?.[traitName]?.displayName || traitName;
  };

  const renderRaritySlider = (category, traitName) => {
    const traitData = traitMetadata[category]?.traits?.[traitName] || {};
    const rarity = traitData.rarity || 100;
    
    return (
      <Box key={`${category}-${traitName}`} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={5}>
            <Typography variant="body2">
              {getTraitDisplayName(category, traitName)}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Slider
              value={rarity}
              min={0}
              max={100}
              step={1}
              onChange={(_, newValue) => handleRarityChange(category, traitName, newValue)}
              valueLabelDisplay="auto"
              size="small"
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body2" align="right">
              {rarity}%
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Metadata Editor
      </Typography>
      
      {feedback.show && (
        <Alert 
          severity={feedback.severity} 
          sx={{ mb: 3 }}
          onClose={() => setFeedback(prev => ({ ...prev, show: false }))}
        >
          {feedback.message}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Collection Metadata
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Collection Name"
              name="name"
              value={collectionForm.name}
              onChange={handleCollectionChange}
              fullWidth
              margin="normal"
              placeholder="My Awesome NFT Collection"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Symbol"
              name="symbol"
              value={collectionForm.symbol}
              onChange={handleCollectionChange}
              fullWidth
              margin="normal"
              placeholder="NFTC"
              helperText="Token symbol (e.g., BAYC)"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={collectionForm.description}
              onChange={handleCollectionChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              placeholder="Unique 1/1 NFT generated on [date]"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Base URI"
              name="baseUri"
              value={collectionForm.baseUri}
              onChange={handleCollectionChange}
              fullWidth
              margin="normal"
              placeholder="ipfs://QmYourCID/"
              helperText="Base URI where metadata is stored (e.g., ipfs:// or https://)"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="External URL"
              name="externalUrl"
              value={collectionForm.externalUrl}
              onChange={handleCollectionChange}
              fullWidth
              margin="normal"
              placeholder="https://yourwebsite.com"
              helperText="Website for your collection"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Royalty Percentage"
              name="sellerFeeBasisPoints"
              type="number"
              value={collectionForm.sellerFeeBasisPoints / 100}  // Convert basis points to percentage
              onChange={(e) => {
                const percentage = parseFloat(e.target.value) || 0;
                handleCollectionChange({
                  target: {
                    name: 'sellerFeeBasisPoints',
                    value: Math.round(percentage * 100)  // Convert percentage to basis points
                  }
                });
              }}
              fullWidth
              margin="normal"
              InputProps={{
                inputProps: { min: 0, max: 100, step: 0.1 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              helperText="Secondary market royalty percentage"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                onClick={handleSaveCollection}
              >
                Save Collection Metadata
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Trait Attributes & Rarity
      </Typography>
      
      {Object.keys(layers).length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Upload layers in the Layer Manager to configure trait attributes.
        </Alert>
      ) : (
        Object.keys(layers).map((category) => {
          const categoryTraits = layers[category] || [];
          
          return (
            <Accordion key={category} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'medium' }}>
                  {category} ({categoryTraits.length} traits)
                </Typography>
              </AccordionSummary>
              
              <AccordionDetails>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Category Display Name
                  </Typography>
                  
                  <TextField
                    size="small"
                    value={traitMetadata[category]?.displayName || category}
                    onChange={(e) => handleTraitMetadataChange(category, 'displayName', e.target.value)}
                    fullWidth
                    placeholder="Display name in metadata"
                    sx={{ mb: 2 }}
                  />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Trait Rarity Settings
                  </Typography>
                  
                  {categoryTraits.length > 0 ? (
                    categoryTraits.map((trait) => {
                      const traitName = trait.name || trait.id;
                      return renderRaritySlider(category, traitName);
                    })
                  ) : (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      No traits uploaded yet for this category.
                    </Alert>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
      
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Metadata & Rarity Guide</Typography>
        </Box>
        
        <Typography variant="body2" paragraph>
          • <strong>Collection Metadata</strong>: Enter basic information about your NFT collection that will appear in marketplaces.
        </Typography>
        
        <Typography variant="body2" paragraph>
          • <strong>Trait Rarity</strong>: Set the relative frequency of each trait when generating your collection. Higher percentages mean the trait will appear more frequently.
        </Typography>
        
        <Typography variant="body2">
          • <strong>Display Names</strong>: You can customize how each trait category appears in metadata files.
        </Typography>
      </Paper>
    </Container>
  );
};

export default MetadataEditor; 
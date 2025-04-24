import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  LinearProgress
} from '@mui/material';
import { FiChevronDown, FiRefreshCw, FiSettings, FiBarChart, FiDownload, FiShuffle } from 'react-icons/fi';
import { useLayerStore, useMetadataStore, useGenerationStore } from '../../stores';
import BatchExport from '../BatchExport';

const CollectionGenerator = () => {
  const { layers } = useLayerStore();
  const { traitMetadata } = useMetadataStore();
  const {
    settings,
    updateSettings,
    generateNewSeed,
    generateCollection,
    generatedCombinations,
    isGenerating,
    generationProgress,
    rarityDistribution,
    clearCollection,
    getTotalNfts
  } = useGenerationStore();
  
  const [localSettings, setLocalSettings] = useState({
    collectionSize: settings.collectionSize,
    seed: settings.seed,
    respectRarity: settings.respectRarity,
    avoidDuplicates: settings.avoidDuplicates
  });
  
  const [showStats, setShowStats] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [error, setError] = useState(null);
  
  // When settings from store change, update local settings
  useEffect(() => {
    setLocalSettings({
      collectionSize: settings.collectionSize,
      seed: settings.seed,
      respectRarity: settings.respectRarity,
      avoidDuplicates: settings.avoidDuplicates
    });
  }, [settings]);
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                    type === 'number' ? parseInt(value) || 0 : value;
    
    setLocalSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleSeedRefresh = () => {
    const newSeed = Date.now();
    setLocalSettings(prev => ({
      ...prev,
      seed: newSeed
    }));
  };
  
  const handleApplySettings = () => {
    updateSettings(localSettings);
  };
  
  const handleGenerate = async () => {
    try {
      setError(null);
      
      // Calculate total possible combinations
      let totalPossibleCombinations = 1;
      Object.keys(layers).forEach(category => {
        if (layers[category] && layers[category].length > 0) {
          totalPossibleCombinations *= layers[category].length;
        }
      });
      
      // Check if we have enough traits
      if (totalPossibleCombinations === 0) {
        setError('No traits found. Please upload traits in the Layer Manager.');
        return;
      }
      
      // Check if requested size exceeds possible combinations when avoiding duplicates
      if (localSettings.avoidDuplicates && localSettings.collectionSize > totalPossibleCombinations) {
        setError(`Cannot generate ${localSettings.collectionSize} unique NFTs. Maximum possible is ${totalPossibleCombinations}.`);
        return;
      }
      
      // Apply settings first
      updateSettings(localSettings);
      
      // Generate the collection
      await generateCollection(layers, traitMetadata);
      
      // Show stats after generation
      setShowStats(true);
      
      // Reset to page 1
      setPage(1);
    } catch (error) {
      setError(error.message || 'Failed to generate collection');
    }
  };
  
  const pageCount = Math.ceil(getTotalNfts() / itemsPerPage);
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const renderRarityTable = () => {
    if (!rarityDistribution) return null;
    
    return (
      <Accordion expanded={showStats} onChange={() => setShowStats(!showStats)}>
        <AccordionSummary expandIcon={<FiChevronDown />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <FiBarChart style={{ marginRight: '8px' }} />
            Rarity Distribution
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(rarityDistribution.categoryPercents).map(([category, traits]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {category}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Trait</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(traits).map(([traitName, percentage]) => (
                      <TableRow key={traitName}>
                        <TableCell>{traitName}</TableCell>
                        <TableCell align="right">
                          {rarityDistribution.traitCounts[category][traitName]}
                        </TableCell>
                        <TableCell align="right">
                          {percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };
  
  // Render a simplified representation of an NFT in the preview grid
  const renderNftPreview = (nft, index) => {
    if (!nft) return null;
    
    return (
      <Card key={index} sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            NFT #{index + 1}
          </Typography>
          <Box sx={{ mb: 1 }}>
            {Object.entries(nft).map(([category, trait]) => (
              <Chip
                key={category}
                label={`${category}: ${trait.traitName}`}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Collection Generator
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FiSettings style={{ marginRight: '8px' }} />
          Generation Settings
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Collection Size"
              name="collectionSize"
              type="number"
              value={localSettings.collectionSize}
              onChange={handleSettingChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1, max: 10000 }}
              helperText="Number of NFTs to generate"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <TextField
                label="Random Seed"
                name="seed"
                type="number"
                value={localSettings.seed}
                onChange={handleSettingChange}
                fullWidth
                margin="normal"
                helperText="Seed for reproducible results"
              />
              <IconButton 
                onClick={handleSeedRefresh} 
                sx={{ ml: 1, mb: 2 }}
                color="primary"
              >
                <FiRefreshCw />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="respectRarity"
                  checked={localSettings.respectRarity}
                  onChange={handleSettingChange}
                  color="primary"
                />
              }
              label="Use Rarity Weights"
            />
            <Typography variant="caption" display="block" color="text.secondary">
              Apply trait rarity settings when generating
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="avoidDuplicates"
                  checked={localSettings.avoidDuplicates}
                  onChange={handleSettingChange}
                  color="primary"
                />
              }
              label="Avoid Duplicates"
            />
            <Typography variant="caption" display="block" color="text.secondary">
              Ensure each NFT has a unique trait combination
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleApplySettings}
              >
                Apply Settings
              </Button>
              
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleGenerate}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <FiShuffle />}
              >
                {isGenerating ? 'Generating...' : 'Generate Collection'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {isGenerating && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" gutterBottom>
            Generating collection... {generationProgress}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={generationProgress} 
          />
        </Box>
      )}
      
      {generatedCombinations.length > 0 && (
        <>
          {renderRarityTable()}
          
          <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Generated NFTs ({getTotalNfts()})
            </Typography>
            
            <BatchExport />
          </Box>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {generatedCombinations
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((nft, index) => (
                <Grid item xs={12} sm={6} md={3} key={(page - 1) * itemsPerPage + index}>
                  {renderNftPreview(nft, (page - 1) * itemsPerPage + index)}
                </Grid>
              ))}
          </Grid>
          
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <Pagination 
                count={pageCount} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CollectionGenerator; 
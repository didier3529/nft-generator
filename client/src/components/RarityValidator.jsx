import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Slider,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

/**
 * RarityValidator - Analyzes and displays trait rarity metrics
 */
const RarityValidator = ({ combinations, layers }) => {
  const [loading, setLoading] = useState(true);
  const [rarityThreshold, setRarityThreshold] = useState(10); // Default 10%
  const [rarityWarnings, setRarityWarnings] = useState([]);

  // Analyze layer rarity
  const traitData = useMemo(() => {
    if (!combinations || !combinations.length || !layers) {
      return {};
    }

    // Total number of NFTs in collection
    const totalNfts = combinations.length;
    
    // Initialize data structure for counting trait occurrences
    const traitCounts = {};
    
    // Iterate through each layer category
    Object.keys(layers).forEach(category => {
      traitCounts[category] = {
        total: 0,
        traits: {}
      };
      
      // Initialize counts for each trait in this category
      layers[category].forEach(trait => {
        traitCounts[category].traits[trait.id] = {
          id: trait.id,
          name: trait.name || trait.id,
          count: 0,
          percentage: 0
        };
      });
    });

    // Count occurrences of each trait
    combinations.forEach(combo => {
      Object.entries(combo.traits).forEach(([category, trait]) => {
        if (!traitCounts[category]) {
          traitCounts[category] = {
            total: 0,
            traits: {}
          };
        }
        
        if (!traitCounts[category].traits[trait.id]) {
          traitCounts[category].traits[trait.id] = {
            id: trait.id,
            name: trait.name || trait.id,
            count: 0,
            percentage: 0
          };
        }
        
        traitCounts[category].total++;
        traitCounts[category].traits[trait.id].count++;
      });
    });

    // Calculate percentages
    Object.keys(traitCounts).forEach(category => {
      Object.keys(traitCounts[category].traits).forEach(traitId => {
        const trait = traitCounts[category].traits[traitId];
        trait.percentage = (trait.count / totalNfts) * 100;
      });
    });

    return traitCounts;
  }, [combinations, layers]);

  // Check for extreme rarity values
  useEffect(() => {
    if (!traitData || Object.keys(traitData).length === 0) {
      setLoading(true);
      return;
    }

    const warnings = [];

    // Check for traits that are extremely rare or extremely common
    Object.entries(traitData).forEach(([category, data]) => {
      Object.values(data.traits).forEach(trait => {
        if (trait.count > 0) {
          // Check for extremely rare traits
          if (trait.percentage < rarityThreshold) {
            warnings.push({
              category,
              trait: trait.name,
              percentage: trait.percentage,
              type: 'rare',
              message: `"${trait.name}" in "${category}" appears in only ${trait.percentage.toFixed(1)}% of the collection.`
            });
          }
          
          // Check for extremely common traits
          if (trait.percentage > 100 - rarityThreshold) {
            warnings.push({
              category,
              trait: trait.name,
              percentage: trait.percentage,
              type: 'common',
              message: `"${trait.name}" in "${category}" appears in ${trait.percentage.toFixed(1)}% of the collection.`
            });
          }
        }
      });
    });

    setRarityWarnings(warnings);
    setLoading(false);
  }, [traitData, rarityThreshold]);

  // Get rarity rating (1-5 stars)
  const getRarityRating = (percentage) => {
    if (percentage < 5) return 5;
    if (percentage < 10) return 4;
    if (percentage < 20) return 3;
    if (percentage < 40) return 2;
    return 1;
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIcon key={i} color="primary" fontSize="small" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalfIcon key={i} color="primary" fontSize="small" />);
      } else {
        stars.push(<StarBorderIcon key={i} color="text.secondary" fontSize="small" />);
      }
    }
    return <Box sx={{ display: 'flex' }}>{stars}</Box>;
  };

  // Show loading state
  if (loading || !combinations || !combinations.length) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          Rarity Analysis
        </Typography>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Analyzing trait distribution...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Rarity Analysis
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Rarity Threshold
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Flag traits appearing in less than:
            </Typography>
            
            <Box sx={{ px: 1, mt: 2 }}>
              <Slider
                value={rarityThreshold}
                onChange={(e, newValue) => setRarityThreshold(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                step={1}
                min={1}
                max={25}
                marks={[
                  { value: 5, label: '5%' },
                  { value: 10, label: '10%' },
                  { value: 15, label: '15%' },
                  { value: 20, label: '20%' }
                ]}
              />
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Rarity Warnings
              </Typography>
              
              {rarityWarnings.length === 0 ? (
                <Alert severity="success" sx={{ mt: 1 }}>
                  No extreme rarity values detected
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Found {rarityWarnings.length} traits with extreme rarity values
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Collection Statistics
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              <Chip 
                label={`${combinations.length} Total NFTs`}
                color="primary" 
                variant="outlined" 
              />
              
              <Chip 
                label={`${Object.keys(traitData).length} Categories`}
                color="secondary" 
                variant="outlined" 
              />
              
              {rarityWarnings.length > 0 && (
                <Chip 
                  label={`${rarityWarnings.length} Rarity Issues`}
                  color="warning" 
                  variant="outlined" 
                />
              )}
            </Box>
            
            <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
              Distribution by Category:
            </Typography>
            
            <Box sx={{ mt: 1 }}>
              {Object.entries(traitData).map(([category, data], index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{category}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Object.keys(data.traits).length} traits
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">Category</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Trait</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2">Count</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2">Percentage</Typography></TableCell>
                  <TableCell align="center"><Typography variant="subtitle2">Rarity Rating</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(traitData).map(([category, data]) => 
                  Object.values(data.traits)
                    .filter(trait => trait.count > 0)
                    .sort((a, b) => a.percentage - b.percentage) // Sort by rarity (ascending %)
                    .map((trait, index) => (
                      <TableRow key={`${category}-${trait.id}`} hover>
                        {index === 0 && (
                          <TableCell rowSpan={Object.values(data.traits).filter(t => t.count > 0).length}>
                            {category}
                          </TableCell>
                        )}
                        <TableCell>{trait.name}</TableCell>
                        <TableCell align="right">{trait.count}</TableCell>
                        <TableCell align="right">{trait.percentage.toFixed(1)}%</TableCell>
                        <TableCell align="center">
                          {renderStars(getRarityRating(trait.percentage))}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RarityValidator; 
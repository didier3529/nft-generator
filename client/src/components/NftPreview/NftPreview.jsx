import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import NftCanvas from './NftCanvas';
import TraitSelector from './TraitSelector';

const NftPreview = () => {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        NFT Preview & Configuration
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <NftCanvas />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TraitSelector />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NftPreview;

 
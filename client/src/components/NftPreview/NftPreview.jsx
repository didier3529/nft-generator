import React, { useRef } from 'react';
import { Box, Grid, Paper, Typography, Divider } from '@mui/material';
import NftCanvas from './NftCanvas';
import TraitSelector from './TraitSelector';
import { WalletButton, DeployToSolana, SolanaInfo } from '../Solana';

const NftPreview = ({ walletAddress }) => {
  // Create a reference to the canvas for deployment
  const canvasRef = useRef(null);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          NFT Preview & Configuration
        </Typography>
        
        {/* If we have a wallet address, we don't need to show this button */}
        {!walletAddress && <WalletButton />}
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <NftCanvas ref={canvasRef} />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            {/* Original export button would be here */}
            <DeployToSolana 
              canvasRef={canvasRef}
              walletAddress={walletAddress} 
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TraitSelector />
          <SolanaInfo walletAddress={walletAddress} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NftPreview;

 
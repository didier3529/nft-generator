import React, { useState, useMemo, useCallback, memo } from 'react';
import './App.css';
import SimpleWalletConnect from './components/SimpleWalletConnect';
import { Container, Grid, Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import LayerManager from './components/LayerManager/LayerManager';
import NftPreview from './components/NftPreview/NftPreview';
import MetadataEditor from './components/MetadataEditor';
import CollectionGenerator from './components/CollectionGenerator';
import ErrorBoundary from './components/ErrorBoundary';

// NFT Generator App Component (from pages/index.jsx)
const NFTGeneratorApp = memo(({ walletAddress }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  // Format wallet address once and memoize it
  const formattedWalletAddress = useMemo(() => {
    return walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
  }, [walletAddress]);

  // Only render the active tab component to reduce unnecessary renders
  const activeTabComponent = useMemo(() => {
    switch (tabValue) {
      case 0:
        return <LayerManager />;
      case 1:
        return <NftPreview walletAddress={walletAddress} />;
      case 2:
        return <MetadataEditor />;
      case 3:
        return <CollectionGenerator />;
      default:
        return null;
    }
  }, [tabValue, walletAddress]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        NFT Generator
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          Connected Wallet: <span className="wallet-address">{formattedWalletAddress}</span>
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Layer Manager" />
          <Tab label="Preview & Configure" />
          <Tab label="Metadata Editor" />
          <Tab label="Collection Generator" />
        </Tabs>
      </Box>
      
      {/* Only render the active tab content */}
      <ErrorBoundary>
        {activeTabComponent}
      </ErrorBoundary>
    </Container>
  );
});

// Main App Component
function App() {
  const [walletAddress, setWalletAddress] = useState('');

  // Memoize the wallet connection callback
  const handleWalletConnected = useCallback((address) => {
    setWalletAddress(address);
  }, []);

  // Memoize the wallet connection section
  const walletConnectionSection = useMemo(() => {
    if (!walletAddress) {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2>Connect Your Wallet</h2>
            <p>Connect your Phantom wallet to access the full NFT Generator toolkit</p>
            <SimpleWalletConnect onWalletConnected={handleWalletConnected} />
          </div>
          
          <div style={{ marginTop: '40px', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <h2>Connect Wallet to Access NFT Generator</h2>
            <p>The complete NFT Generator toolkit with layer management, NFT preview, trait selection, and more will appear after connecting your wallet.</p>
          </div>
        </div>
      );
    }
    return null;
  }, [walletAddress, handleWalletConnected]);

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>NFT Generator</h1>
          <p>A simple NFT creation tool with Solana integration</p>
        </header>
        
        <main>
          {walletConnectionSection}
          
          {walletAddress && (
            <NFTGeneratorApp walletAddress={walletAddress} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App; 
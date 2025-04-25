import React, { useState, useMemo, useCallback, memo } from 'react';
import './App.css';
import SimpleWalletConnect from './components/SimpleWalletConnect';
import { Container, Grid, Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import LayerManager from './components/LayerManager/LayerManager';
import NftPreview from './components/NftPreview/NftPreview';
import MetadataEditor from './components/MetadataEditor';
import CollectionGenerator from './components/CollectionGenerator';

// Error boundary to catch and display errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ffeeee', borderRadius: '5px', margin: '20px' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Show error details</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '10px', padding: '5px 10px' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
      {activeTabComponent}
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
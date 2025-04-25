import React, { useState, useEffect, useCallback, memo } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { formatWalletAddress } from '../services/solanaService';

/**
 * SimpleWalletConnect - Component for connecting to Phantom wallet
 * Acts as a gateway to the NFT Generator features
 */
const SimpleWalletConnect = memo(({ onWalletConnected }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [hasPhantom, setHasPhantom] = useState(false);

  // Memoize checkWalletConnection to prevent recreation on each render
  const checkWalletConnection = useCallback(async () => {
    try {
      const { solana } = window;
      
      // Check if Phantom wallet is available
      if (solana && solana.isPhantom) {
        setHasPhantom(true);
        
        try {
          // Try to connect to a previously authorized wallet
          const response = await solana.connect({ onlyIfTrusted: true });
          const address = response.publicKey.toString();
          setWalletAddress(address);
          if (onWalletConnected) onWalletConnected(address);
        } catch (connectionError) {
          // Silent catch - user hasn't connected yet, which is expected
          console.log('Wallet not pre-authorized');
        }
      } else {
        setHasPhantom(false);
        console.log('Phantom wallet not installed');
      }
    } catch (error) {
      console.error("Wallet detection error:", error);
    }
  }, [onWalletConnected]);

  // Check if Phantom wallet is installed and previously connected
  useEffect(() => {
    checkWalletConnection();
    // No need to add checkWalletConnection to the dependency array since it's memoized
  }, [checkWalletConnection]);

  // Handle wallet connection with useCallback to prevent recreation
  const connectWallet = useCallback(async () => {
    setConnecting(true);
    setError(null);
    
    try {
      const { solana } = window;
      
      if (solana && solana.isPhantom) {
        try {
          const response = await solana.connect();
          const address = response.publicKey.toString();
          console.log('Connected to wallet:', address);
          setWalletAddress(address);
          
          // Call the callback if provided
          if (onWalletConnected) onWalletConnected(address);
        } catch (connectError) {
          console.error('User rejected wallet connection:', connectError);
          setError('Connection rejected by user. Please try again.');
        }
      } else {
        setError('Phantom wallet not detected. Please install it from https://phantom.app/');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(`Connection error: ${error.message}`);
    } finally {
      setConnecting(false);
    }
  }, [onWalletConnected]);

  // UI based on connection state
  if (walletAddress) {
    return (
      <Box sx={{ 
        padding: '20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}>
        <Alert severity="success" sx={{ mb: 1, width: '100%', maxWidth: '400px' }}>
          Wallet connected successfully!
        </Alert>
        <Typography variant="body1">
          Connected: <span className="wallet-address">{formatWalletAddress(walletAddress)}</span>
        </Typography>
      </Box>
    );
  }

  // Not connected - show connection button
  return (
    <Box sx={{ 
      padding: '20px', 
      textAlign: 'center', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }}>
      {error && (
        <Alert severity="error" sx={{ maxWidth: '400px', mb: 1 }}>
          {error}
        </Alert>
      )}
      
      {!hasPhantom && (
        <Alert severity="info" sx={{ maxWidth: '400px', mb: 1 }}>
          Phantom wallet is required to use this feature. Please install it from{' '}
          <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">
            phantom.app
          </a>
        </Alert>
      )}
      
      <Button 
        onClick={connectWallet} 
        disabled={connecting || !hasPhantom}
        variant="contained"
        size="large"
        sx={{ 
          background: '#39FF14', 
          color: 'black',
          padding: '10px 32px',
          borderRadius: '8px',
          fontWeight: 'bold',
          '&:hover': {
            background: '#32E012'
          }
        }}
      >
        {connecting ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <span>Connecting...</span>
          </Box>
        ) : (
          'Connect Phantom Wallet'
        )}
      </Button>
      
      {!hasPhantom && (
        <Button 
          variant="outlined"
          size="small"
          href="https://phantom.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Install Phantom
        </Button>
      )}
    </Box>
  );
});

export default SimpleWalletConnect; 
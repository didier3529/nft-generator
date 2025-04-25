import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Link, Divider, Button, Alert, CircularProgress } from '@mui/material';
import { getWalletBalance, formatWalletAddress } from '../../services/solanaService';

/**
 * SolanaInfo - Displays information and wallet status for Solana integration
 */
const SolanaInfo = ({ walletAddress }) => {
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wallet balance when wallet is connected
  useEffect(() => {
    let mounted = true;

    const fetchBalance = async () => {
      if (!walletAddress) return;
      
      try {
        setLoading(true);
        setError(null);
        const balance = await getWalletBalance(walletAddress, 'devnet');
        
        if (mounted) {
          setBalanceInfo({
            lamports: balance,
            sol: balance / 1000000000 // Convert lamports to SOL
          });
        }
      } catch (err) {
        console.error('Failed to fetch wallet balance:', err);
        if (mounted) {
          setError('Could not fetch wallet balance');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (walletAddress) {
      fetchBalance();
    }

    return () => {
      mounted = false;
    };
  }, [walletAddress]);

  // Refresh wallet balance
  const handleRefreshBalance = () => {
    if (walletAddress) {
      setBalanceInfo(null);
      setLoading(true);
      setError(null);
      
      getWalletBalance(walletAddress, 'devnet')
        .then(balance => {
          setBalanceInfo({
            lamports: balance,
            sol: balance / 1000000000
          });
        })
        .catch(err => {
          console.error('Error refreshing balance:', err);
          setError('Failed to refresh balance');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Helper to open block explorer
  const openBlockExplorer = () => {
    if (walletAddress) {
      window.open(`https://solscan.io/account/${walletAddress}?cluster=devnet`, '_blank');
    }
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
      <Typography variant="h6" gutterBottom>
        Solana Blockchain Integration
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      {walletAddress ? (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ p: 1.5, bgcolor: 'success.light', borderRadius: 1, mb: 1.5 }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              Connected: {formatWalletAddress(walletAddress)}
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="caption">Fetching balance...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          ) : balanceInfo ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">
                Balance: <strong>{balanceInfo.sol.toFixed(6)} SOL</strong>
                {balanceInfo.sol < 0.01 && (
                  <Typography component="span" color="error" variant="caption" sx={{ ml: 1 }}>
                    (Low balance - 0.01 SOL recommended for minting)
                  </Typography>
                )}
              </Typography>
              <Button size="small" onClick={handleRefreshBalance} variant="text">
                Refresh
              </Button>
            </Box>
          ) : null}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={openBlockExplorer}
            >
              View on Solscan
            </Button>
          </Box>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 2 }}>
          Connect your wallet to see balance and deploy NFTs
        </Alert>
      )}
      
      <Typography variant="body2" paragraph>
        This application includes Solana blockchain integration for NFT deployment.
        You can connect your Phantom wallet and deploy your generated NFTs directly to the Solana blockchain.
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          How It Works:
        </Typography>
        
        <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
          <li>{walletAddress ? '✅ Wallet connected' : 'Connect your Phantom wallet using the wallet button'}</li>
          <li>Generate and customize your NFT using the app</li>
          <li>Click "Deploy to Solana" to upload to IPFS and mint on Solana</li>
          <li>Approve the transaction in your wallet</li>
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Requirements:
        </Typography>
        
        <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
          <li>A Phantom wallet browser extension</li>
          <li>At least 0.01 SOL in your wallet for transaction fees</li>
          <li>An NFT.Storage API key (free at nft.storage)</li>
        </Typography>
      </Box>
      
      <Typography variant="subtitle2" color="error.main" gutterBottom>
        DISCLAIMERS:
      </Typography>
      
      <Typography variant="caption" color="error.main" component="div" sx={{ mb: 2 }}>
        <ul style={{ margin: 0, paddingInlineStart: '20px' }}>
          <li>This is a demonstration implementation only</li>
          <li>NFTs involve significant financial and speculative risks</li>
          <li>No user data is collected or stored by this application</li>
          <li>Users are responsible for all gas fees and transaction costs</li>
          <li>No guarantees or warranties are provided for deployed NFTs</li>
          <li>This application does not provide financial or investment advice</li>
        </ul>
      </Typography>
      
      <Typography variant="caption" color="textSecondary">
        By using this feature, you acknowledge the risks and that this is a basic implementation 
        for demonstration purposes only. For production use, consider implementing additional security 
        measures. Learn more about Solana at{' '}
        <Link href="https://solana.com" target="_blank" rel="noopener noreferrer">
          solana.com
        </Link>
      </Typography>
    </Paper>
  );
};

export default SolanaInfo; 
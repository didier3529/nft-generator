import React, { useState, useEffect, useMemo } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Slider, 
  TextField, 
  InputAdornment, 
  CircularProgress, 
  Alert, 
  Tooltip, 
  IconButton
} from '@mui/material';
import { FiHelpCircle, FiRefreshCw } from 'react-icons/fi';

/**
 * NetworkFeeCalculator - Component for estimating Solana network fees
 * Features real-time SOL to USD conversion and minting cost estimates
 */
const NetworkFeeCalculator = ({ mintCount = 1 }) => {
  // Transaction fee constants in SOL
  const TRANSACTION_FEE = 0.000005; // Base transaction fee in SOL
  const NFT_MINT_COST = 0.00045; // Approximate cost per NFT mint in SOL

  // State for price data
  const [solPrice, setSolPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [customMintCount, setCustomMintCount] = useState(mintCount);

  // Fetch SOL price
  const fetchSolPrice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use CoinGecko API to get SOL price in USD
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch price data: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.solana && data.solana.usd) {
        setSolPrice(data.solana.usd);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid price data received');
      }
    } catch (err) {
      console.error('Error fetching SOL price:', err);
      setError('Failed to fetch current SOL price. Using fallback price of $150.');
      setSolPrice(150); // Fallback price if API fails
    } finally {
      setLoading(false);
    }
  };

  // Fetch price on component mount
  useEffect(() => {
    fetchSolPrice();
    
    // Refresh price every 5 minutes
    const intervalId = setInterval(() => {
      fetchSolPrice();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Update local state when prop changes
  useEffect(() => {
    setCustomMintCount(mintCount);
  }, [mintCount]);

  // Handle slider change
  const handleSliderChange = (event, newValue) => {
    setCustomMintCount(newValue);
  };

  // Handle input change
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setCustomMintCount(value);
    }
  };

  // Calculate costs
  const calculatedCosts = useMemo(() => {
    const count = Math.max(1, customMintCount); // Ensure at least 1
    const baseFee = TRANSACTION_FEE; // Base transaction fee
    const mintFee = NFT_MINT_COST * count; // Fee per NFT
    const totalSol = baseFee + mintFee;
    
    return {
      count,
      baseFee,
      mintFee,
      totalSol,
      totalUsd: solPrice ? totalSol * solPrice : null
    };
  }, [customMintCount, solPrice, TRANSACTION_FEE, NFT_MINT_COST]);

  // Format timestamp
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    return lastUpdated.toLocaleTimeString();
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchSolPrice();
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Network Fee Calculator
          <Tooltip title="Estimates transaction fees and minting costs based on current SOL price">
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <FiHelpCircle size={16} />
            </IconButton>
          </Tooltip>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <CircularProgress size={16} sx={{ mr: 1 }} />
          ) : (
            <IconButton size="small" onClick={handleRefresh} disabled={loading}>
              <FiRefreshCw size={16} />
            </IconButton>
          )}
          <Typography variant="caption" color="textSecondary">
            Last updated: {formatLastUpdated()}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={500} gutterBottom>
          Current SOL Price
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h5" component="span" sx={{ mr: 1 }}>
            ${solPrice ? solPrice.toFixed(2) : '-.--'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            USD per SOL
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Number of NFTs to mint</span>
          <span>{customMintCount}</span>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Slider
            value={customMintCount}
            onChange={handleSliderChange}
            aria-labelledby="nft-count-slider"
            min={1}
            max={100}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            value={customMintCount}
            onChange={handleInputChange}
            InputProps={{
              inputProps: { min: 1, max: 1000 },
              endAdornment: <InputAdornment position="end">NFTs</InputAdornment>
            }}
            variant="outlined"
            size="small"
            type="number"
            sx={{ width: '100px' }}
          />
        </Box>
      </Box>
      
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" fontWeight={500} gutterBottom>
          Estimated Costs
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr auto auto', 
          gap: '8px 16px',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="caption" color="textSecondary">Base transaction fee:</Typography>
          <Box sx={{ borderBottom: '1px dotted rgba(0,0,0,0.1)', height: '1px', alignSelf: 'end', mb: 1 }} />
          <Typography variant="body2" align="right">{calculatedCosts.baseFee.toFixed(6)} SOL</Typography>
          <Typography variant="caption" color="textSecondary" align="right">
            ${solPrice ? (calculatedCosts.baseFee * solPrice).toFixed(4) : '-.--'}
          </Typography>
          
          <Typography variant="caption" color="textSecondary">Minting fee ({calculatedCosts.count} NFTs):</Typography>
          <Box sx={{ borderBottom: '1px dotted rgba(0,0,0,0.1)', height: '1px', alignSelf: 'end', mb: 1 }} />
          <Typography variant="body2" align="right">{calculatedCosts.mintFee.toFixed(6)} SOL</Typography>
          <Typography variant="caption" color="textSecondary" align="right">
            ${solPrice ? (calculatedCosts.mintFee * solPrice).toFixed(4) : '-.--'}
          </Typography>
          
          <Typography variant="caption" color="textSecondary" fontWeight={500}>Total estimated cost:</Typography>
          <Box sx={{ borderBottom: '1px dotted rgba(0,0,0,0.1)', height: '1px', alignSelf: 'end', mb: 1 }} />
          <Typography variant="body2" fontWeight={500} align="right">{calculatedCosts.totalSol.toFixed(6)} SOL</Typography>
          <Typography variant="caption" fontWeight={500} align="right">
            ${solPrice ? (calculatedCosts.totalSol * solPrice).toFixed(4) : '-.--'}
          </Typography>
        </Box>
      </Box>
      
      <Alert severity="info" sx={{ mt: 2 }} variant="outlined">
        <Typography variant="caption">
          Actual costs may vary based on network conditions. The calculator provides estimates based on typical transaction fees.
        </Typography>
      </Alert>
    </Paper>
  );
};

export default NetworkFeeCalculator; 
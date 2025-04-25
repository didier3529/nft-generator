import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

// CoinGecko API URL
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true';

// Refresh interval in milliseconds (5 minutes)
const REFRESH_INTERVAL = 5 * 60 * 1000;

/**
 * Real-time SOL/USD price feed component
 */
const PriceFeed = ({ variant = 'default' }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch price data from CoinGecko
  const fetchPriceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(COINGECKO_API_URL);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data?.solana?.usd) {
        setPriceData({
          price: data.solana.usd,
          change24h: data.solana.usd_24h_change || 0
        });
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid price data format');
      }
    } catch (err) {
      console.error('Error fetching SOL price:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and set up interval
  useEffect(() => {
    fetchPriceData();
    
    const intervalId = setInterval(fetchPriceData, REFRESH_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [fetchPriceData]);

  // Format change percentage with sign and color
  const formatChange = (change) => {
    if (!change && change !== 0) return null;
    
    const changeValue = parseFloat(change).toFixed(2);
    const isPositive = changeValue > 0;
    const isNeutral = changeValue === 0;
    
    const color = isPositive 
      ? 'success.main' 
      : isNeutral 
        ? 'text.secondary' 
        : 'error.main';
    
    const icon = isPositive 
      ? <TrendingUpIcon fontSize="small" /> 
      : isNeutral 
        ? <TrendingFlatIcon fontSize="small" /> 
        : <TrendingDownIcon fontSize="small" />;
    
    return { value: changeValue, color, icon, sign: isPositive ? '+' : '' };
  };

  // Format last updated time
  const getLastUpdatedText = () => {
    if (!lastUpdated) return 'Not yet updated';
    
    // Get time difference in minutes
    const diffMs = Date.now() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    // If more than an hour, show the time
    return `at ${lastUpdated.toLocaleTimeString()}`;
  };

  // Simple version for compact display
  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {loading ? (
          <CircularProgress size={16} thickness={5} sx={{ mr: 1 }} />
        ) : error ? (
          <Tooltip title="Error loading price">
            <Typography variant="body2" color="error">
              Price unavailable
            </Typography>
          </Tooltip>
        ) : (
          <Chip 
            label={`SOL: $${priceData?.price?.toFixed(2) || '0.00'}`}
            size="small"
            color={priceData?.change24h > 0 ? 'success' : priceData?.change24h < 0 ? 'error' : 'default'}
            variant="outlined"
          />
        )}
      </Box>
    );
  }

  // Full version with change data
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle2" color="text.secondary">
          SOL/USD
        </Typography>
        
        <Tooltip title="Refresh price">
          <IconButton size="small" onClick={fetchPriceData} disabled={loading}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <CircularProgress size={24} thickness={5} />
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error" sx={{ py: 1 }}>
          Error: {error}
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
              ${priceData?.price?.toFixed(2)}
            </Typography>
            
            {priceData?.change24h !== undefined && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  ml: 1,
                  color: formatChange(priceData.change24h).color
                }}
              >
                {formatChange(priceData.change24h).icon}
                <Typography variant="body2" component="span" sx={{ ml: 0.25 }}>
                  {formatChange(priceData.change24h).sign}{formatChange(priceData.change24h).value}%
                </Typography>
              </Box>
            )}
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Updated {getLastUpdatedText()}
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default PriceFeed; 
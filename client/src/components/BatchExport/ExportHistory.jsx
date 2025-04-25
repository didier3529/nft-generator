import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import NoResultsIcon from '@mui/icons-material/SearchOff';

// Local storage key for export history
const EXPORT_HISTORY_KEY = 'nft-generator-export-history';

// Maximum history entries to keep
const MAX_HISTORY_ENTRIES = 5;

/**
 * Export History component for tracking NFT exports
 */
const ExportHistory = () => {
  const [exportHistory, setExportHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load export history from local storage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(EXPORT_HISTORY_KEY);
      if (savedHistory) {
        setExportHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading export history:', error);
      setExportHistory([]);
    }
  }, []);

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Clear export history
  const handleClearHistory = () => {
    setExportHistory([]);
    localStorage.removeItem(EXPORT_HISTORY_KEY);
  };

  // View details for an export entry
  const handleViewDetails = (entry) => {
    setSelected(entry);
    setShowDetails(true);
  };

  // Close details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  // Show empty state if no history
  if (exportHistory.length === 0) {
    return (
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 1
        }}
      >
        <NoResultsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Export History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your recent NFT exports will appear here
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1 }} /> Recent Exports
        </Typography>
        
        <Button 
          variant="outlined" 
          color="error" 
          size="small" 
          startIcon={<DeleteIcon />}
          onClick={handleClearHistory}
        >
          Clear History
        </Button>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Date & Time</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Collection</Typography></TableCell>
              <TableCell align="right"><Typography variant="subtitle2">Count</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Type</Typography></TableCell>
              <TableCell align="center"><Typography variant="subtitle2">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exportHistory.map((entry, index) => (
              <TableRow key={index} hover>
                <TableCell>{formatTimestamp(entry.timestamp)}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                    {entry.collectionName || 'Unnamed Collection'}
                  </Typography>
                </TableCell>
                <TableCell align="right">{entry.count}</TableCell>
                <TableCell>
                  <Chip 
                    label={entry.type || 'Export'} 
                    size="small"
                    color={entry.type === 'Full Collection' ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleViewDetails(entry)}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Export Details Dialog */}
      <Dialog open={showDetails} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Export Details</DialogTitle>
        <DialogContent>
          {selected && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {selected.collectionName || 'Unnamed Collection'}
              </Typography>
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Export Date
                  </Typography>
                  <Typography variant="body2">
                    {formatTimestamp(selected.timestamp)}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Export Type
                  </Typography>
                  <Typography variant="body2">
                    {selected.type || 'Standard Export'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    NFT Count
                  </Typography>
                  <Typography variant="body2">
                    {selected.count} {selected.count === 1 ? 'NFT' : 'NFTs'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Format
                  </Typography>
                  <Typography variant="body2">
                    {selected.format || 'PNG + JSON'}
                  </Typography>
                </Box>
              </Box>
              
              {selected.transaction && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {selected.transaction}
                  </Typography>
                  
                  {selected.network && (
                    <Box sx={{ mt: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        href={`https://solscan.io/tx/${selected.transaction}?cluster=${selected.network}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Solscan
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/**
 * Save export to history
 * @param {Object} entry - Export history entry to save
 */
export const saveExportToHistory = (entry) => {
  try {
    // Get existing history
    const existingHistory = localStorage.getItem(EXPORT_HISTORY_KEY);
    let history = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Add new entry to the beginning
    history = [entry, ...history].slice(0, MAX_HISTORY_ENTRIES);
    
    // Save to localStorage
    localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history));
    
    return true;
  } catch (error) {
    console.error('Error saving export to history:', error);
    return false;
  }
};

export default ExportHistory; 
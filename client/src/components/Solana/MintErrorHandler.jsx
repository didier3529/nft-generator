import React, { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Link
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

/**
 * MintErrorHandler - Displays error recovery options when minting fails
 */
const MintErrorHandler = ({
  open,
  onClose,
  error,
  onRetry,
  onExportMetadata,
  canRetry = true
}) => {
  // Parse error message for better display
  const getErrorDetails = useCallback(() => {
    if (!error) return { title: 'Unknown Error', message: 'An unknown error occurred during minting.' };
    
    // Extract stage and specific error message
    const { stage, error: errorMessage } = error;
    
    // Format based on error stage
    switch (stage) {
      case 'validation':
        return {
          title: 'Metadata Validation Failed',
          message: Array.isArray(error.errors) 
            ? `Please fix the following issues:\n• ${error.errors.join('\n• ')}` 
            : errorMessage || 'Invalid metadata format'
        };
        
      case 'wallet_check':
        return {
          title: 'Wallet Issue',
          message: errorMessage || 'Issue with wallet connection or balance'
        };
        
      case 'ipfs_upload':
        return {
          title: 'IPFS Upload Failed',
          message: errorMessage || 'Failed to upload metadata to IPFS'
        };
        
      case 'blockchain_transaction':
        return {
          title: 'Transaction Failed',
          message: errorMessage || 'The Solana transaction failed to complete'
        };
        
      default:
        return {
          title: 'Mint Failed',
          message: errorMessage || 'The minting process encountered an error'
        };
    }
  }, [error]);
  
  const errorDetails = getErrorDetails();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="mint-error-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="mint-error-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningIcon color="error" sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h6" component="span" sx={{ color: 'error.main', fontWeight: 600 }}>
          ⚠️ {errorDetails.title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText component="div" sx={{ whiteSpace: 'pre-line' }}>
          {errorDetails.message}
        </DialogContentText>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Options:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
          {canRetry && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              fullWidth
              size="large"
            >
              Retry (Up to 3x)
            </Button>
          )}
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={onExportMetadata}
            fullWidth
            size="large"
          >
            Export Metadata & Image
          </Button>
          
          <Button
            variant="text"
            color="inherit"
            startIcon={<LiveHelpIcon />}
            component={Link}
            href="https://docs.solana.com/troubleshooting" 
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            size="large"
          >
            Get Help
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MintErrorHandler; 
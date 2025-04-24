import React, { useState, useRef } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useLayerStore, useMetadataStore } from '../../stores';
import { exportSingleNft } from '../../services/export/exportService';

const ExportButton = ({ canvasRef }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState(1);
  const [format, setFormat] = useState('image/png');
  const [notification, setNotification] = useState({ open: false, type: 'info', message: '' });
  
  // Get data from stores
  const selectedTraits = useLayerStore((state) => state.getSelectedLayers());
  const metadata = useMetadataStore((state) => state.metadata);
  
  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleExport = async () => {
    if (!canvasRef.current) {
      setNotification({
        open: true,
        type: 'error',
        message: 'Canvas reference not available.'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await exportSingleNft({
        canvas: canvasRef.current,
        selectedTraits,
        metadata,
        tokenId,
        imageFormat: format,
        imageQuality: format === 'image/jpeg' ? 0.92 : undefined
      });
      
      if (result.success) {
        setNotification({
          open: true,
          type: 'success',
          message: 'NFT exported successfully!'
        });
        handleClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setNotification({
        open: true,
        type: 'error',
        message: `Export failed: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };
  
  const hasTraits = Object.keys(selectedTraits).length > 0;
  
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={handleOpen}
        disabled={!hasTraits}
      >
        Export NFT
      </Button>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Export NFT</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Configure export settings for your NFT image and metadata.
          </DialogContentText>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <TextField
              label="Token ID"
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(Math.max(1, parseInt(e.target.value) || 1))}
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel id="format-label">Image Format</InputLabel>
              <Select
                labelId="format-label"
                value={format}
                label="Image Format"
                onChange={(e) => setFormat(e.target.value)}
              >
                <MenuItem value="image/png">PNG</MenuItem>
                <MenuItem value="image/jpeg">JPEG</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <DialogContentText variant="body2" color="text.secondary">
            This will download an image file and a JSON metadata file for your NFT.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleExport}
            color="primary"
            disabled={loading || !hasTraits}
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          >
            {loading ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportButton; 
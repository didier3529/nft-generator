import React, { useState, useRef } from 'react';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Typography,
  Box,
  Alert,
  LinearProgress,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Snackbar,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import { FiDownload, FiSettings, FiInfo, FiX } from 'react-icons/fi';
import { useLayerStore, useMetadataStore, useGenerationStore } from '../../stores';
import { exportBatchNfts } from '../../services/export/batchExportService';

const BatchExport = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Export settings
  const [settings, setSettings] = useState({
    imageFormat: 'image/png',
    imageQuality: 0.92,
    metadataFormat: 'json',
    includeCollection: true,
    baseTokenId: 1
  });
  
  const canvasRef = useRef(null);
  
  // Get data from stores
  const { layers } = useLayerStore();
  const metadata = useMetadataStore((state) => state.metadata);
  const { generatedCombinations, getTotalNfts } = useGenerationStore();
  
  const totalNfts = getTotalNfts();
  
  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setProgress(0);
  };
  
  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                    name === 'imageQuality' ? parseFloat(value) : value;
    
    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleExport = async () => {
    if (generatedCombinations.length === 0) {
      setError('No NFTs have been generated. Please generate a collection first.');
      return;
    }
    
    setLoading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Start the batch export process
      await exportBatchNfts({
        combinations: generatedCombinations,
        metadata,
        settings,
        onProgress: (percent) => {
          setProgress(percent);
        },
        layers
      });
      
      setNotification({
        open: true,
        message: 'Collection exported successfully!',
        severity: 'success'
      });
      
      handleClose();
    } catch (error) {
      console.error('Export error:', error);
      setError(error.message || 'An error occurred during export');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FiDownload />}
        onClick={handleOpen}
        disabled={generatedCombinations.length === 0}
      >
        Batch Export
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Export NFT Collection
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <DialogContentText sx={{ mb: 3 }}>
            Export your entire collection of {totalNfts} NFTs with images and metadata files as a ZIP archive.
          </DialogContentText>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FiSettings style={{ marginRight: '8px' }} />
              Export Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Image Format"
                  name="imageFormat"
                  value={settings.imageFormat}
                  onChange={handleSettingChange}
                  fullWidth
                  margin="normal"
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                </TextField>
              </Grid>
              
              {settings.imageFormat === 'image/jpeg' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="JPEG Quality"
                    name="imageQuality"
                    type="number"
                    value={settings.imageQuality}
                    onChange={handleSettingChange}
                    inputProps={{ min: 0.1, max: 1, step: 0.1 }}
                    fullWidth
                    margin="normal"
                    helperText="0.1 (low) to 1.0 (high)"
                  />
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Starting Token ID"
                  name="baseTokenId"
                  type="number"
                  value={settings.baseTokenId}
                  onChange={handleSettingChange}
                  inputProps={{ min: 0 }}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="includeCollection"
                      checked={settings.includeCollection}
                      onChange={handleSettingChange}
                    />
                  }
                  label="Include collection metadata file"
                />
              </Grid>
            </Grid>
          </Box>
          
          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Processing NFT {Math.ceil((progress / 100) * totalNfts)} of {totalNfts}
              </Typography>
            </Box>
          )}
          
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FiInfo style={{ marginRight: '8px' }} />
              <Typography variant="subtitle2">Export Information</Typography>
            </Box>
            <Typography variant="body2" paragraph>
              • Each NFT will be exported as an image file and a JSON metadata file
            </Typography>
            <Typography variant="body2" paragraph>
              • File naming follows the pattern: [id].png and [id].json
            </Typography>
            <Typography variant="body2">
              • Please wait for the export to complete before closing this dialog
            </Typography>
          </Paper>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            color="primary"
            variant="contained"
            disabled={loading || generatedCombinations.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <FiDownload />}
          >
            {loading ? 'Exporting...' : 'Export Collection'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={notification.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleNotificationClose}
          >
            <FiX />
          </IconButton>
        }
      />
    </>
  );
};

export default BatchExport; 
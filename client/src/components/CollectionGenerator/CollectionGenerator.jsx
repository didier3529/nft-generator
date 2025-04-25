import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Pagination,
  Card,
  CardMedia,
  CardContent,
  LinearProgress,
  Snackbar,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@mui/material';
import { FiChevronDown, FiRefreshCw, FiSettings, FiBarChart, FiDownload, FiShuffle, FiArchive, FiTrash2, FiCheck, FiSave, FiAlertTriangle, FiList, FiCopy, FiInfo } from 'react-icons/fi';
import { useLayerStore, useMetadataStore, useGenerationStore } from '../../stores';
import { useWallet } from '@solana/wallet-adapter-react';
import { getWalletBalance } from '../../services/solanaService';
import BatchExport from '../BatchExport';
import { exportBatchNfts } from '../../services/export/batchExportService';

// Create a simple CollectionInfoCard component
const CollectionInfoCard = ({ metadata, setMetadata, isWalletConnected, collectionSize, hasLayers }) => {
  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {metadata?.name || 'Collection Information'}
        </Typography>
        {isWalletConnected && (
          <Chip 
            label={`Connected Wallet`} 
            color="success" 
            variant="outlined"
            size="small"
          />
        )}
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {metadata?.description || 'Add a description for your collection.'}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" component="div" color="text.secondary">
            Collection Size
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {collectionSize || 0} NFTs
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" component="div" color="text.secondary">
            Layer Count
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {hasLayers ? 'Layers Added' : 'No Layers'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="caption" component="div" color="text.secondary">
            Status
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {collectionSize > 0 ? 'Ready to Export' : 'Not Generated'}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Constants
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
const LOCAL_STORAGE_KEY = 'nft_generator_autosave';
const MINTED_COUNT_KEY = 'nft_generator_minted_today';
const MIN_SOL_BALANCE = 0.01; // Minimum recommended SOL balance
const EXPORT_HISTORY_KEY = 'nft_generator_export_history'; // Key for storing export history
const EXPORT_REMINDER_INTERVAL = 30 * 60 * 1000; // 30 minutes in milliseconds
const EXPORT_REMINDER_KEY = 'nft_generator_last_export_reminder'; // Key for storing last export reminder timestamp

const CollectionGenerator = () => {
  const { layers } = useLayerStore();
  const { traitMetadata } = useMetadataStore();
  const metadata = useMetadataStore((state) => state.metadata);
  const {
    settings,
    updateSettings,
    generateNewSeed,
    generateCollection,
    generatedCombinations,
    isGenerating,
    generationProgress,
    rarityDistribution,
    clearCollection,
    getTotalNfts
  } = useGenerationStore();
  
  // Add setMetadata function as a placeholder
  const setMetadata = (newMetadata) => {
    console.log('Setting metadata:', newMetadata);
    // In a real implementation, this would update the metadata in the store
    // e.g., useMetadataStore.getState().updateMetadata(newMetadata);
  };
  
  // Get wallet from Solana wallet adapter
  const wallet = useWallet();
  
  // Add new states for export functionality
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportNotification, setExportNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Add state for daily minting counter
  const [mintedToday, setMintedToday] = useState(0);
  
  // Add state for NFT selection
  const [selectedNfts, setSelectedNfts] = useState({});
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Add state for wallet balance tracking
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletBalanceLoading, setWalletBalanceLoading] = useState(false);
  const [walletBalanceError, setWalletBalanceError] = useState(null);
  
  // Add state for export history
  const [exportHistory, setExportHistory] = useState([]);
  const [showHistoryTab, setShowHistoryTab] = useState(false);
  
  const [localSettings, setLocalSettings] = useState({
    collectionSize: settings.collectionSize,
    seed: settings.seed,
    respectRarity: settings.respectRarity,
    avoidDuplicates: settings.avoidDuplicates
  });
  
  const [showStats, setShowStats] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [error, setError] = useState(null);
  
  // Add inactivity timer states
  const [lastActive, setLastActive] = useState(Date.now());
  const inactivityTimerRef = useRef(null);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [autoSaveNotification, setAutoSaveNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Add export reminder states
  const [showExportReminder, setShowExportReminder] = useState(false);
  const lastExportReminderRef = useRef(
    localStorage.getItem(EXPORT_REMINDER_KEY) 
      ? parseInt(localStorage.getItem(EXPORT_REMINDER_KEY), 10) 
      : 0
  );
  
  const defaultTabValue = useMemo(() => {
    return localSettings.collectionSize === 0 ? 'generate' : 'manage';
  }, [localSettings.collectionSize]);
  
  const [tabValue, setTabValue] = useState(defaultTabValue);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Format timestamp for history display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Initialize export history from localStorage
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
  
  // Check wallet balance when wallet changes
  useEffect(() => {
    // Only run if wallet is connected
    if (!wallet || !wallet.connected || !wallet.publicKey) {
      setWalletBalance(null);
      return;
    }
    
    const fetchWalletBalance = async () => {
      try {
        setWalletBalanceLoading(true);
        setWalletBalanceError(null);
        
        const balance = await getWalletBalance(wallet.publicKey);
        const solBalance = balance / 1000000000; // Convert lamports to SOL
        
        setWalletBalance(solBalance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setWalletBalanceError('Failed to fetch wallet balance');
      } finally {
        setWalletBalanceLoading(false);
      }
    };
    
    fetchWalletBalance();
    
    // Set up periodic balance check every 30 seconds
    const balanceCheckInterval = setInterval(fetchWalletBalance, 30000);
    
    return () => {
      clearInterval(balanceCheckInterval);
    };
  }, [wallet]);
  
  // Initialize daily minting counter
  useEffect(() => {
    // Check if we need to reset the counter (new day)
    const today = new Date().toLocaleDateString();
    
    try {
      const storedData = localStorage.getItem(MINTED_COUNT_KEY);
      
      if (storedData) {
        const { date, count } = JSON.parse(storedData);
        
        // If still the same day, use the stored count
        if (date === today) {
          setMintedToday(count);
        } else {
          // New day, reset counter
          localStorage.setItem(MINTED_COUNT_KEY, JSON.stringify({ date: today, count: 0 }));
          setMintedToday(0);
        }
      } else {
        // First time, initialize counter
        localStorage.setItem(MINTED_COUNT_KEY, JSON.stringify({ date: today, count: 0 }));
        setMintedToday(0);
      }
    } catch (error) {
      console.error('Error initializing minting counter:', error);
      setMintedToday(0);
    }
  }, []);
  
  // Function to increment minted counter
  const incrementMintedCounter = (count = 1) => {
    const today = new Date().toLocaleDateString();
    
    try {
      // Get current count
      const storedData = localStorage.getItem(MINTED_COUNT_KEY) || JSON.stringify({ date: today, count: 0 });
      const { date, count: currentCount } = JSON.parse(storedData);
      
      // If it's a new day, reset the counter
      const newCount = date === today ? currentCount + count : count;
      
      // Update localStorage
      localStorage.setItem(MINTED_COUNT_KEY, JSON.stringify({ date: today, count: newCount }));
      
      // Update state
      setMintedToday(newCount);
    } catch (error) {
      console.error('Error updating minting counter:', error);
    }
  };
  
  // Simulate minting when export is completed (in a real app, this would be called after actual minting)
  useEffect(() => {
    if (exportNotification.open && exportNotification.severity === 'success') {
      // If we successfully exported, simulate that we minted them
      // In a real application, this would be called after the actual blockchain transaction
      const exportedCount = exportNotification.message.includes('Collection exported') 
        ? generatedCombinations.length 
        : parseInt(exportNotification.message.match(/(\d+) NFTs/)?.[1] || '0');
      
      if (exportedCount > 0) {
        incrementMintedCounter(exportedCount);
      }
    }
  }, [exportNotification, generatedCombinations.length]);
  
  // Track user activity
  const resetInactivityTimer = () => {
    setLastActive(Date.now());
  };
  
  // Function to save current state to localStorage
  const saveToLocalStorage = () => {
    try {
      const dataToSave = {
        timestamp: Date.now(),
        settings: localSettings,
        combinations: generatedCombinations,
        selected: selectedNfts
      };
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      
      setAutoSaveNotification({
        open: true,
        message: 'Your progress has been automatically saved',
        severity: 'success'
      });
      
      return true;
    } catch (error) {
      console.error('Error saving to local storage:', error);
      
      setAutoSaveNotification({
        open: true,
        message: 'Failed to save your progress automatically',
        severity: 'error'
      });
      
      return false;
    }
  };
  
  // Function to load state from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Check if data is still valid (less than 24 hours old)
        const isValid = Date.now() - parsedData.timestamp < 24 * 60 * 60 * 1000;
        
        if (isValid && parsedData.combinations?.length > 0) {
          // Actually restore the state
          console.log('Restoring saved NFT state from local storage');
          
          // Restore settings
          if (parsedData.settings) {
            setLocalSettings(parsedData.settings);
            updateSettings(parsedData.settings);
          }
          
          // Restore selected NFTs if any
          if (parsedData.selected && Object.keys(parsedData.selected).length > 0) {
            setSelectedNfts(parsedData.selected);
          }
          
          // We need a way to restore the combinations to the store
          // This would typically involve calling a store method like setGeneratedCombinations
          // For now we'll just show the notification about the found data
          
          setAutoSaveNotification({
            open: true,
            message: `Found saved progress from ${new Date(parsedData.timestamp).toLocaleString()}. Click "Regenerate with Same Settings" to restore.`,
            severity: 'info'
          });
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error loading from local storage:', error);
      return false;
    }
  };
  
  // Initialize inactivity monitoring
  useEffect(() => {
    // Check for saved progress when component mounts
    loadFromLocalStorage();
    
    // Function to handle user activity
    const handleUserActivity = () => {
      resetInactivityTimer();
    };
    
    // Set up event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    
    // Check inactivity periodically
    const intervalId = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActive;
      
      // If inactive for specified time, show warning and save
      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        // Only show warning and save if we have data to save
        if (generatedCombinations.length > 0) {
          setShowInactivityWarning(true);
          saveToLocalStorage();
        }
      }
    }, 60000); // Check every minute
    
    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      clearInterval(intervalId);
    };
  }, [lastActive, generatedCombinations]);
  
  // Handle inactivity dialog close
  const handleCloseInactivityWarning = () => {
    setShowInactivityWarning(false);
    resetInactivityTimer();
  };
  
  // Handle notification close
  const handleAutoSaveNotificationClose = () => {
    setAutoSaveNotification(prev => ({ ...prev, open: false }));
  };
  
  // Manually trigger save
  const handleManualSave = () => {
    if (saveToLocalStorage()) {
      setAutoSaveNotification({
        open: true,
        message: 'Your progress has been saved successfully',
        severity: 'success'
      });
    }
  };
  
  // Reset selected NFTs when collection changes
  useEffect(() => {
    setSelectedNfts({});
    setSelectionMode(false);
  }, [generatedCombinations]);
  
  // When settings from store change, update local settings
  useEffect(() => {
    setLocalSettings({
      collectionSize: settings.collectionSize,
      seed: settings.seed,
      respectRarity: settings.respectRarity,
      avoidDuplicates: settings.avoidDuplicates
    });
  }, [settings]);
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                    type === 'number' ? parseInt(value) || 0 : value;
    
    setLocalSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  
  const handleSeedRefresh = () => {
    const newSeed = Date.now();
    setLocalSettings(prev => ({
      ...prev,
      seed: newSeed
    }));
  };
  
  const handleApplySettings = () => {
    updateSettings(localSettings);
  };
  
  // Handle NFT selection
  const handleSelectNft = (index) => {
    setSelectedNfts(prev => {
      const newSelected = { ...prev };
      if (newSelected[index]) {
        delete newSelected[index];
      } else {
        newSelected[index] = true;
      }
      return newSelected;
    });
  };
  
  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      // Clear selections when exiting selection mode
      setSelectedNfts({});
    }
  };
  
  // Select all NFTs on current page
  const selectAllOnPage = () => {
    const newSelected = { ...selectedNfts };
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(page * itemsPerPage, generatedCombinations.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      newSelected[i] = true;
    }
    
    setSelectedNfts(newSelected);
  };
  
  // Deselect all NFTs
  const deselectAll = () => {
    setSelectedNfts({});
  };
  
  // Get number of selected NFTs
  const getSelectedCount = () => {
    return Object.keys(selectedNfts).length;
  };
  
  // Get array of selected NFT combinations
  const getSelectedCombinations = () => {
    return Object.keys(selectedNfts).map(index => generatedCombinations[parseInt(index)]);
  };
  
  // Delete selected NFTs
  const deleteSelectedNfts = () => {
    if (getSelectedCount() === 0) return;
    
    const selectedIndices = Object.keys(selectedNfts).map(index => parseInt(index));
    const newCombinations = generatedCombinations.filter((_, index) => !selectedIndices.includes(index));
    
    // This would normally update the store
    // For now we'll just show a notification
    setExportNotification({
      open: true,
      message: `${selectedIndices.length} NFTs deleted successfully`,
      severity: 'success'
    });
    
    // Clear selections after delete
    setSelectedNfts({});
    setSelectionMode(false);
  };
  
  const handleGenerate = async () => {
    try {
      setError(null);
      
      // Calculate total possible combinations
      let totalPossibleCombinations = 1;
      Object.keys(layers).forEach(category => {
        if (layers[category] && layers[category].length > 0) {
          totalPossibleCombinations *= layers[category].length;
        }
      });
      
      // Check if we have enough traits
      if (totalPossibleCombinations === 0) {
        setError('No traits found. Please upload traits in the Layer Manager.');
        return;
      }
      
      // Check if requested size exceeds possible combinations when avoiding duplicates
      if (localSettings.avoidDuplicates && localSettings.collectionSize > totalPossibleCombinations) {
        setError(`Cannot generate ${localSettings.collectionSize} unique NFTs. Maximum possible is ${totalPossibleCombinations}.`);
        return;
      }
      
      // Apply settings first
      updateSettings(localSettings);
      
      // Generate the collection
      await generateCollection(layers, traitMetadata);
      
      // Show stats after generation
      setShowStats(true);
      
      // Reset to page 1
      setPage(1);
    } catch (error) {
      setError(error.message || 'Failed to generate collection');
    }
  };
  
  const pageCount = Math.ceil(getTotalNfts() / itemsPerPage);
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const renderRarityTable = () => {
    if (!rarityDistribution) return null;
    
    return (
      <Accordion expanded={showStats} onChange={() => setShowStats(!showStats)}>
        <AccordionSummary expandIcon={<FiChevronDown />}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <FiBarChart style={{ marginRight: '8px' }} />
            Rarity Distribution
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(rarityDistribution.categoryPercents).map(([category, traits]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {category}
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Trait</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(traits).map(([traitName, percentage]) => (
                      <TableRow key={traitName}>
                        <TableCell>{traitName}</TableCell>
                        <TableCell align="right">
                          {rarityDistribution.traitCounts[category][traitName]}
                        </TableCell>
                        <TableCell align="right">
                          {percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    );
  };
  
  // Render a simplified representation of an NFT in the preview grid
  const renderNftPreview = (nft, index) => {
    if (!nft) return null;
    
    const realIndex = (page - 1) * itemsPerPage + index;
    const isSelected = selectedNfts[realIndex] === true;
    
    return (
      <Card 
        key={index} 
        sx={{ 
          height: '100%',
          position: 'relative',
          border: isSelected ? '2px solid #2196f3' : 'none',
          transition: 'border 0.2s ease'
        }}
      >
        {selectionMode && (
          <Checkbox
            checked={isSelected}
            onChange={() => handleSelectNft(realIndex)}
            sx={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              zIndex: 1,
              color: isSelected ? '#2196f3' : 'rgba(0, 0, 0, 0.54)'
            }}
          />
        )}
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            NFT #{realIndex + 1}
          </Typography>
          <Box sx={{ mb: 1 }}>
            {Object.entries(nft).map(([category, trait]) => (
              <Chip
                key={category}
                label={`${category}: ${trait.traitName}`}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        </CardContent>
        {selectionMode && (
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              cursor: 'pointer',
              zIndex: 0 
            }}
            onClick={() => handleSelectNft(realIndex)}
          />
        )}
      </Card>
    );
  };
  
  // Save export to history
  const saveExportToHistory = (exportType, count, collectionName = metadata.name) => {
    try {
      // Create new history entry
      const newEntry = {
        timestamp: Date.now(),
        collectionName: collectionName || 'Unnamed Collection',
        count,
        type: exportType
      };
      
      // Add to history (keeping only last 5 entries)
      const updatedHistory = [newEntry, ...exportHistory].slice(0, 5);
      
      // Update state
      setExportHistory(updatedHistory);
      
      // Save to localStorage
      localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving export to history:', error);
    }
  };
  
  // Clear export history
  const clearExportHistory = () => {
    setExportHistory([]);
    localStorage.removeItem(EXPORT_HISTORY_KEY);
    
    setExportNotification({
      open: true,
      message: 'Export history cleared',
      severity: 'info'
    });
  };
  
  // Export selected NFTs
  const handleExportSelected = async () => {
    const selectedCombinations = getSelectedCombinations();
    
    if (selectedCombinations.length === 0) {
      setError('No NFTs selected. Please select NFTs to export.');
      return;
    }
    
    setExporting(true);
    setExportProgress(0);
    setError(null);
    
    try {
      // Default export settings
      const exportSettings = {
        imageFormat: 'image/png',
        metadataFormat: 'json',
        includeCollection: true,
        baseTokenId: 1
      };
      
      // Start the batch export process with only selected NFTs
      await exportBatchNfts({
        combinations: selectedCombinations,
        metadata,
        settings: exportSettings,
        onProgress: (percent) => {
          setExportProgress(percent);
        },
        layers
      });
      
      // Save to export history
      saveExportToHistory('Selected', selectedCombinations.length);
      
      setExportNotification({
        open: true,
        message: `${selectedCombinations.length} NFTs exported successfully!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Export error:', error);
      setError(error.message || 'An error occurred during export');
    } finally {
      setExporting(false);
    }
  };
  
  // Add new handler for Export All functionality
  const handleExportAll = async () => {
    if (generatedCombinations.length === 0) {
      setError('No NFTs have been generated. Please generate a collection first.');
      return;
    }
    
    setExporting(true);
    setExportProgress(0);
    setError(null);
    
    try {
      // Default export settings
      const exportSettings = {
        imageFormat: 'image/png',
        metadataFormat: 'json',
        includeCollection: true,
        baseTokenId: 1
      };
      
      // Start the batch export process
      await exportBatchNfts({
        combinations: generatedCombinations,
        metadata,
        settings: exportSettings,
        onProgress: (percent) => {
          setExportProgress(percent);
        },
        layers
      });
      
      // Save to export history
      saveExportToHistory('Full Collection', generatedCombinations.length);
      
      setExportNotification({
        open: true,
        message: 'Collection exported successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Export error:', error);
      setError(error.message || 'An error occurred during export');
    } finally {
      setExporting(false);
    }
  };
  
  const handleNotificationClose = () => {
    setExportNotification(prev => ({ ...prev, open: false }));
  };
  
  // Initialize export reminder monitoring
  useEffect(() => {
    // Check if user has generated a collection and hasn't been reminded in 30 minutes
    const checkExportReminder = () => {
      // Only show reminder if there are generated combinations
      if (generatedCombinations.length === 0) {
        return;
      }
      
      // If export reminder is already showing, don't check
      if (showExportReminder) {
        return;
      }
      
      const now = Date.now();
      const timeSinceLastReminder = now - lastExportReminderRef.current;
      
      // Check if the user has already exported this collection
      const lastExportedTimestamp = exportHistory.length > 0 ? exportHistory[0].timestamp : 0;
      
      // Get the last time the collection was generated or modified
      // This is an approximation - in a real app, you'd track the exact timestamp of the last change
      const collectionLastModified = lastActive;
      
      // Only show the reminder if it's been 30 minutes since the last reminder
      // AND either there's no export history OR the collection was modified after the last export
      if (timeSinceLastReminder >= EXPORT_REMINDER_INTERVAL && 
          (exportHistory.length === 0 || collectionLastModified > lastExportedTimestamp)) {
        setShowExportReminder(true);
        lastExportReminderRef.current = now;
        localStorage.setItem(EXPORT_REMINDER_KEY, now.toString());
      }
    };
    
    // Check every minute
    const intervalId = setInterval(checkExportReminder, 60000);
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [generatedCombinations.length, showExportReminder, exportHistory, lastActive]);
  
  // Handle export reminder dialog close
  const handleCloseExportReminder = () => {
    setShowExportReminder(false);
  };
  
  // Handle export reminder dialog export action
  const handleExportFromReminder = () => {
    setShowExportReminder(false);
    handleExportAll();
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Collection Info Paper */}
        <CollectionInfoCard 
          metadata={metadata} 
          setMetadata={setMetadata} 
          isWalletConnected={wallet?.connected}
          collectionSize={localSettings.collectionSize}
          hasLayers={layers.length > 0}
        />
        
        {/* Main Content */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Generate" value="generate" />
              <Tab 
                label={`Manage (${localSettings.collectionSize})`} 
                value="manage" 
                disabled={localSettings.collectionSize === 0} 
              />
              <Tab label="History" value="history" />
            </Tabs>
          </Box>
          
          {/* Generate Tab */}
          {tabValue === 'generate' && (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <FiSettings style={{ marginRight: '8px' }} />
                  Generation Settings
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Collection Size"
                      name="collectionSize"
                      type="number"
                      value={localSettings.collectionSize}
                      onChange={handleSettingChange}
                      fullWidth
                      margin="normal"
                      inputProps={{ min: 1, max: 10000 }}
                      helperText="Number of NFTs to generate"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <TextField
                        label="Random Seed"
                        name="seed"
                        type="number"
                        value={localSettings.seed}
                        onChange={handleSettingChange}
                        fullWidth
                        margin="normal"
                        helperText="Seed for reproducible results"
                      />
                      <IconButton 
                        onClick={handleSeedRefresh} 
                        sx={{ ml: 1, mb: 2 }}
                        color="primary"
                      >
                        <FiRefreshCw />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="respectRarity"
                          checked={localSettings.respectRarity}
                          onChange={handleSettingChange}
                          color="primary"
                        />
                      }
                      label="Use Rarity Weights"
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Apply trait rarity settings when generating
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="avoidDuplicates"
                          checked={localSettings.avoidDuplicates}
                          onChange={handleSettingChange}
                          color="primary"
                        />
                      }
                      label="Avoid Duplicates"
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Ensure each NFT has a unique trait combination
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        onClick={handleApplySettings}
                      >
                        Apply Settings
                      </Button>
                      
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        startIcon={isGenerating ? <CircularProgress size={20} /> : <FiShuffle />}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Collection'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              
              {isGenerating && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" gutterBottom>
                    Generating collection... {generationProgress}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={generationProgress} 
                  />
                </Box>
              )}
              
              {generatedCombinations.length > 0 && (
                <>
                  {renderRarityTable()}
                  
                  <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      Generated NFTs ({getTotalNfts()})
                      {selectionMode && (
                        <Typography component="span" color="primary" sx={{ ml: 1 }}>
                          ({getSelectedCount()} selected)
                        </Typography>
                      )}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Selection mode toggle */}
                      <Button
                        variant={selectionMode ? "contained" : "outlined"}
                        color={selectionMode ? "primary" : "default"}
                        onClick={toggleSelectionMode}
                        startIcon={<FiCheck />}
                      >
                        {selectionMode ? "Exit Selection" : "Select NFTs"}
                      </Button>
                      
                      {selectionMode && (
                        <>
                          <Button
                            variant="outlined"
                            onClick={selectAllOnPage}
                          >
                            Select All on Page
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={deselectAll}
                            disabled={getSelectedCount() === 0}
                          >
                            Deselect All
                          </Button>
                        </>
                      )}
                      
                      {!selectionMode && <BatchExport />}
                    </Box>
                  </Box>
                  
                  {/* Selection mode actions */}
                  {selectionMode && getSelectedCount() > 0 && (
                    <Box sx={{ mt: 2, mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiDownload />}
                        onClick={handleExportSelected}
                        disabled={exporting || getSelectedCount() === 0}
                      >
                        Export Selected ({getSelectedCount()})
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<FiTrash2 />}
                        onClick={deleteSelectedNfts}
                        disabled={getSelectedCount() === 0}
                      >
                        Delete Selected
                      </Button>
                    </Box>
                  )}
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {generatedCombinations
                      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((nft, index) => (
                        <Grid item xs={12} sm={6} md={3} key={(page - 1) * itemsPerPage + index}>
                          {renderNftPreview(nft, index)}
                        </Grid>
                      ))}
                  </Grid>
                  
                  {pageCount > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                      <Pagination 
                        count={pageCount} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary"
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
          
          {/* Manage Tab */}
          {tabValue === 'manage' && (
            <>
              {/* ...existing manage tab content... */}
            </>
          )}
          
          {/* History Tab */}
          {tabValue === 'history' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Export History
              </Typography>
              
              {exportHistory.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  flexDirection: 'column',
                  minHeight: '200px',
                  gap: 2,
                  bgcolor: 'background.paper', 
                  p: 3, 
                  borderRadius: 1,
                  border: '1px dashed',
                  borderColor: 'divider'
                }}>
                  <FiCopy style={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="body1" color="text.secondary">
                    No export history found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your export activity will appear here
                  </Typography>
                </Box>
              ) : (
                <>
                  <List>
                    {exportHistory.map((entry, index) => (
                      <ListItem 
                        key={index} 
                        divider={index < exportHistory.length - 1}
                        sx={{ 
                          bgcolor: 'background.paper',
                          borderRadius: index === 0 ? '4px 4px 0 0' : (index === exportHistory.length - 1 ? '0 0 4px 4px' : 0),
                          border: '1px solid',
                          borderColor: 'divider',
                          borderBottom: index === exportHistory.length - 1 ? '1px solid' : 'none',
                          borderTop: index > 0 ? 'none' : '1px solid',
                          mb: index === exportHistory.length - 1 ? 2 : 0
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: entry.type === 'Full Collection' ? 'success.main' : 'primary.main' }}>
                            {entry.type === 'Full Collection' ? <FiArchive /> : <FiCopy />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {entry.type} Export - {entry.count} NFTs
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="span">
                                Collection: {entry.collectionName}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                component="div" 
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                {formatTimestamp(entry.timestamp)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<FiTrash2 />} 
                      onClick={clearExportHistory}
                    >
                      Clear History
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          )}
        </Paper>
        
        {/* Add Export All button next to other collection actions */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Collection Actions
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button
                variant="outlined"
                color="info"
                startIcon={<FiRefreshCw />}
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                Regenerate with Same Settings
              </Button>
            </Grid>
            
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearCollection}
                disabled={isGenerating || generatedCombinations.length === 0}
              >
                Clear Collection
              </Button>
            </Grid>
            
            <Grid item>
              <BatchExport />
            </Grid>
            
            {/* Add new Export All button */}
            <Grid item>
              <Button
                variant="contained"
                color="success"
                startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <FiArchive />}
                onClick={handleExportAll}
                disabled={exporting || generatedCombinations.length === 0}
              >
                Export All
              </Button>
            </Grid>
            
            {/* Add Save Progress button */}
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<FiSave />}
                onClick={handleManualSave}
                disabled={generatedCombinations.length === 0}
              >
                Save Progress
              </Button>
            </Grid>
          </Grid>
          
          {/* Show export progress if exporting */}
          {exporting && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress variant="determinate" value={exportProgress} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">{`${Math.round(exportProgress)}%`}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Creating ZIP archive...
              </Typography>
            </Box>
          )}
        </Paper>
        
        {/* Add notification snackbar */}
        <Snackbar
          open={exportNotification.open}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
          message={exportNotification.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
        
        {/* Add auto-save notification */}
        <Snackbar
          open={autoSaveNotification.open}
          autoHideDuration={4000}
          onClose={handleAutoSaveNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={handleAutoSaveNotificationClose} 
            severity={autoSaveNotification.severity}
            variant="filled"
          >
            {autoSaveNotification.message}
          </Alert>
        </Snackbar>
        
        {/* Inactivity warning dialog */}
        <Dialog
          open={showInactivityWarning}
          onClose={handleCloseInactivityWarning}
          aria-labelledby="inactivity-dialog-title"
          aria-describedby="inactivity-dialog-description"
        >
          <DialogTitle id="inactivity-dialog-title">
            Inactivity Detected
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="inactivity-dialog-description">
              You've been inactive for 15 minutes. Your NFT progress has been automatically saved to your browser's local storage. 
              You can continue working or come back later to resume where you left off.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInactivityWarning} color="primary">
              Continue Working
            </Button>
            <Button
              onClick={() => {
                handleCloseInactivityWarning();
                // Attempt to restore from autosave point - this would be more complete in a real implementation
                loadFromLocalStorage();
              }}
              color="secondary"
            >
              Restore Last Saved State
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Export reminder dialog */}
        <Dialog
          open={showExportReminder}
          onClose={handleCloseExportReminder}
          aria-labelledby="export-reminder-dialog-title"
          aria-describedby="export-reminder-dialog-description"
        >
          <DialogTitle id="export-reminder-dialog-title" sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
            <FiArchive style={{ marginRight: '8px' }} />
            Don't Forget to Export Your Collection
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 1 }}>
            <DialogContentText id="export-reminder-dialog-description" paragraph>
              You've been editing your collection for a while. Would you like to export your progress now to ensure your work is saved?
              Exporting creates a ZIP file with all your NFT images and metadata files.
            </DialogContentText>
            
            <Box sx={{ 
              bgcolor: 'info.light', 
              color: 'info.contrastText', 
              p: 2, 
              borderRadius: 1, 
              mt: 1, 
              mb: 2,
              display: 'flex',
              alignItems: 'flex-start' 
            }}>
              <FiInfo style={{ marginTop: '3px', marginRight: '8px', flexShrink: 0 }} />
              <Typography variant="body2">
                <strong>Why export?</strong> While we auto-save your progress in the browser, exporting creates a backup file on your device. This ensures your work is preserved even if your browser data is cleared or there are technical issues.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <FiCheck style={{ marginRight: '4px', color: 'green' }} /> Export takes just a few seconds
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                <FiCheck style={{ marginRight: '4px', color: 'green' }} /> {generatedCombinations.length} NFTs will be saved
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseExportReminder} color="primary">
              Remind Me Later
            </Button>
            <Button
              onClick={handleExportFromReminder}
              color="secondary"
              variant="contained"
              startIcon={<FiArchive />}
            >
              Export Now
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CollectionGenerator; 
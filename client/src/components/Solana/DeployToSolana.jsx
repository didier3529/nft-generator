import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Tooltip
} from '@mui/material';
import { 
  uploadNftToIpfs, 
  deployNftToSolana, 
  initializeNftStorage, 
  getWalletBalance,
  formatWalletAddress
} from '../../services/solanaService';
import { useLayerStore } from '../../stores';

/**
 * DeployToSolana - Component for deploying NFTs to Solana blockchain
 * Provides a UI for configuring and deploying NFTs with error handling
 */
const DeployToSolana = memo(({ canvasRef, onSuccess, walletAddress }) => {
  const { connected, publicKey, signTransaction } = useWallet();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nftName, setNftName] = useState('My NFT');
  const [nftDescription, setNftDescription] = useState('A unique NFT created with NFT Generator');
  const [nftStorageKey, setNftStorageKey] = useState('');
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState(null);
  const [checkingBalance, setCheckingBalance] = useState(false);
  
  // Get selected layers from the store - memoized selector
  const selectedLayers = useLayerStore(
    useCallback(state => state.getSelectedLayers(), []),
    (prev, next) => {
      // Shallow equality check to prevent unnecessary re-renders
      if (Object.keys(prev).length !== Object.keys(next).length) return false;
      for (const key of Object.keys(prev)) {
        if (!next[key] || prev[key].id !== next[key].id) return false;
      }
      return true;
    }
  );
  
  // Determine if we're connected - either via direct prop or via hook
  const isConnected = useMemo(() => walletAddress ? true : connected, [walletAddress, connected]);
  
  // Use the provided wallet address or the one from the hook
  const activePublicKey = useMemo(() => 
    walletAddress ? { toBase58: () => walletAddress } : publicKey,
    [walletAddress, publicKey]
  );
  
  // Check wallet balance when dialog opens - use useCallback for stability
  const checkBalance = useCallback(async () => {
    if (!isConnected || !activePublicKey) return;
    
    try {
      setCheckingBalance(true);
      const balance = await getWalletBalance(
        typeof activePublicKey === 'string' ? activePublicKey : activePublicKey.toBase58(),
        'devnet'
      );
      
      setBalanceInfo({
        balance,
        solBalance: balance / 1000000000, // Convert lamports to SOL
        hasEnough: balance >= 10000000 // 0.01 SOL
      });
    } catch (err) {
      console.error('Error checking balance:', err);
      setBalanceInfo({
        error: err.message,
        hasEnough: false
      });
    } finally {
      setCheckingBalance(false);
    }
  }, [isConnected, activePublicKey]);
  
  // Check balance when dialog opens
  useEffect(() => {
    if (open && isConnected) {
      checkBalance();
    }
  }, [open, isConnected, checkBalance]);
  
  // Memoize dialog handlers
  const handleOpen = useCallback(() => {
    setOpen(true);
    setError(null);
    setDeploymentResult(null);
    setBalanceInfo(null);
  }, []);
  
  const handleClose = useCallback(() => {
    if (!loading) {
      setOpen(false);
    }
  }, [loading]);

  // Memoize form change handlers
  const handleNameChange = useCallback((e) => setNftName(e.target.value), []);
  const handleDescriptionChange = useCallback((e) => setNftDescription(e.target.value), []);
  const handleApiKeyChange = useCallback((e) => setNftStorageKey(e.target.value), []);

  // Memoize deploy handler
  const handleDeploy = useCallback(async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!canvasRef || !canvasRef.current) {
      setError('Canvas reference is not available');
      return;
    }
    
    if (!nftStorageKey) {
      setError('Please enter an NFT.Storage API key');
      return;
    }
    
    if (balanceInfo && !balanceInfo.hasEnough) {
      setError('Insufficient balance. Please add SOL to your wallet (at least 0.01 SOL needed).');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Deploying NFT...');
      
      // Initialize NFT.Storage with the API key
      await initializeNftStorage(nftStorageKey);
      
      // Convert canvas to a blob for upload
      const blob = await new Promise(resolve => {
        canvasRef.current.toBlob(resolve, 'image/png');
      });
      
      // Create a File object from the blob
      const nftImage = new File([blob], `${nftName.replace(/\s+/g, '-')}.png`, { type: 'image/png' });
      
      // Generate attributes from selected layers
      const attributes = Object.entries(selectedLayers).map(([category, layer]) => ({
        trait_type: category,
        value: layer.name || 'Unknown'
      }));
      
      console.log('Uploading to IPFS...');
      
      try {
        // Upload to IPFS
        const metadataUri = await uploadNftToIpfs({
          name: nftName,
          description: nftDescription,
          image: nftImage,
          attributes
        });
        
        console.log('Metadata URI:', metadataUri);
        
        // The wallet object to use
        const wallet = {
          publicKey: activePublicKey,
          signTransaction
        };
          
        console.log('Deploying to Solana...');
        
        // Deploy to Solana
        const nftAddress = await deployNftToSolana({
          metadataUri,
          wallet,
          name: nftName,
          symbol: 'NFTG'
        });
        
        console.log('Deployment successful, NFT address:', nftAddress);
        
        setDeploymentResult({
          address: nftAddress,
          metadata: metadataUri,
          network: 'devnet'
        });
        
        if (onSuccess) {
          onSuccess({
            address: nftAddress,
            metadata: metadataUri
          });
        }
      } catch (uploadError) {
        console.error('Error during NFT upload/deployment:', uploadError);
        throw new Error(`NFT deployment failed: ${uploadError.message}`);
      }
    } catch (err) {
      console.error('Error during deployment:', err);
      setError(err.message || 'An error occurred during deployment');
    } finally {
      setLoading(false);
    }
  }, [
    isConnected, 
    canvasRef, 
    nftStorageKey, 
    balanceInfo, 
    nftName, 
    nftDescription,
    selectedLayers,
    activePublicKey,
    signTransaction,
    onSuccess
  ]);
  
  // Format display values for deployment result - memoize
  const formatMetadataUri = useCallback((uri) => {
    if (!uri) return '';
    // Replace ipfs:// with a gateway URL for easier viewing
    return uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }, []);
  
  const viewOnSolscan = useCallback((address) => {
    window.open(`https://solscan.io/token/${address}?cluster=devnet`, '_blank');
  }, []);
  
  // Memoize dialog content for success state
  const successContent = useMemo(() => {
    if (!deploymentResult) return null;
    
    return (
      <Box sx={{ my: 2 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          NFT deployed successfully!
        </Alert>
        
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2" component="div" gutterBottom>
            NFT Address:
          </Typography>
          <Typography 
            variant="body2" 
            component="div" 
            sx={{
              wordBreak: 'break-all',
              p: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              mb: 2
            }}
          >
            {deploymentResult.address}
          </Typography>
          
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => viewOnSolscan(deploymentResult.address)}
            sx={{ mb: 2 }}
          >
            View on Solscan
          </Button>
          
          <Typography variant="subtitle2" component="div" gutterBottom>
            Metadata URI:
          </Typography>
          <Typography 
            variant="body2" 
            component="div" 
            sx={{
              wordBreak: 'break-all',
              p: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
              fontFamily: 'monospace',
              mb: 2
            }}
          >
            {formatMetadataUri(deploymentResult.metadata)}
          </Typography>
          
          <Button 
            variant="outlined" 
            size="small" 
            component="a" 
            href={formatMetadataUri(deploymentResult.metadata)} 
            target="_blank"
            rel="noopener noreferrer"
          >
            View Metadata
          </Button>
        </Paper>
      </Box>
    );
  }, [deploymentResult, viewOnSolscan, formatMetadataUri]);
  
  // Memoize dialog content for form state
  const formContent = useMemo(() => {
    if (deploymentResult) return null;
    
    return (
      <>
        <Typography variant="body2" paragraph>
          Deploy your NFT to the Solana blockchain. Connect your wallet and provide the
          required information below.
        </Typography>
        
        {balanceInfo && (
          <Box sx={{ mb: 2 }}>
            {balanceInfo.hasEnough ? (
              <Alert severity="info">
                Wallet Balance: {balanceInfo.solBalance.toFixed(6)} SOL (sufficient for deployment)
              </Alert>
            ) : (
              <Alert severity="warning">
                Wallet Balance: {balanceInfo.solBalance?.toFixed(6) || '0.000000'} SOL (insufficient - 0.01 SOL required)
              </Alert>
            )}
          </Box>
        )}
        
        {checkingBalance && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={16} />
            <Typography variant="body2">Checking wallet balance...</Typography>
          </Box>
        )}
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom required>
            NFT Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter NFT name"
            value={nftName}
            onChange={handleNameChange}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            NFT Description
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter NFT description"
            value={nftDescription}
            onChange={handleDescriptionChange}
            variant="outlined"
            size="small"
            multiline
            rows={3}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom required>
            NFT Storage API Key
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your NFT.Storage API key"
            value={nftStorageKey}
            onChange={handleApiKeyChange}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="caption" color="text.secondary">
            Get a free API key at <a href="https://nft.storage" target="_blank" rel="noopener noreferrer">nft.storage</a>
          </Typography>
        </Box>
      </>
    );
  }, [
    balanceInfo, 
    checkingBalance, 
    nftName, 
    nftDescription, 
    nftStorageKey, 
    deploymentResult,
    handleNameChange,
    handleDescriptionChange,
    handleApiKeyChange
  ]);
  
  // Memoize dialog actions
  const dialogActions = useMemo(() => {
    if (deploymentResult) {
      return (
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      );
    }
    
    return (
      <>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleDeploy} 
          color="primary" 
          disabled={loading || !nftStorageKey || (balanceInfo && !balanceInfo.hasEnough)}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Deploying...' : 'Deploy NFT'}
        </Button>
      </>
    );
  }, [
    deploymentResult, 
    loading, 
    nftStorageKey, 
    balanceInfo, 
    handleClose, 
    handleDeploy
  ]);
  
  return (
    <>
      <Tooltip title={!isConnected ? "Connect wallet first" : "Deploy NFT to Solana"}>
        <span>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            disabled={!isConnected}
            sx={{ mt: 2 }}
          >
            Deploy to Solana
          </Button>
        </span>
      </Tooltip>
      
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        keepMounted={false}
      >
        <DialogTitle>Deploy to Solana Blockchain</DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {successContent}
          {formContent}
        </DialogContent>
        
        <DialogActions>
          {dialogActions}
        </DialogActions>
      </Dialog>
    </>
  );
});

DeployToSolana.displayName = 'DeployToSolana';

export default DeployToSolana; 
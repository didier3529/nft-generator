import { useState, useEffect, useCallback } from 'react';
import walletService from '../services/walletService';
import { withErrorHandling } from '../utils/errorHandling';

/**
 * React hook for easy integration with Solana wallets
 * @param {Object} options - Hook configuration options
 * @param {boolean} [options.autoConnect=false] - Whether to connect automatically on mount
 * @param {string} [options.network] - Expected network (e.g., 'mainnet-beta', 'devnet')
 * @returns {Object} Wallet state and functions
 */
export default function useWallet(options = {}) {
  const { autoConnect = false, network = null } = options;
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [walletName, setWalletName] = useState(null);
  const [error, setError] = useState(null);
  
  // Handle account changes
  const handleAccountChange = useCallback((newPublicKey) => {
    if (newPublicKey) {
      setPublicKey(newPublicKey);
      setIsConnected(true);
    } else {
      setPublicKey(null);
      setIsConnected(false);
    }
  }, []);
  
  // Handle network changes
  const handleNetworkChange = useCallback((newNetwork) => {
    // If a specific network is required, we could verify it here
    console.log('Network changed:', newNetwork);
    
    if (network) {
      verifyNetwork();
    }
  }, [network]);
  
  // Initialize wallet service
  useEffect(() => {
    const initializeWallet = async () => {
      setIsInitializing(true);
      
      try {
        const result = await walletService.initialize({
          autoConnect,
          onAccountChange: handleAccountChange,
          onNetworkChange: handleNetworkChange
        });
        
        setIsAvailable(result.available);
        setIsConnected(result.connected);
        setPublicKey(result.publicKey);
        
        const state = walletService.getState();
        setWalletName(state.wallet);
        
        // Verify network if specified
        if (network && result.connected) {
          verifyNetwork();
        }
      } catch (error) {
        setError(error);
        console.error('Failed to initialize wallet:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeWallet();
    
    // Cleanup
    return () => {
      // No cleanup needed for now
    };
  }, [autoConnect, handleAccountChange, handleNetworkChange, network]);
  
  // Connect to wallet
  const connect = useCallback(async () => {
    return withErrorHandling(async () => {
      setIsConnecting(true);
      setError(null);
      
      try {
        const result = await walletService.connect();
        
        setIsConnected(result.connected);
        setPublicKey(result.publicKey);
        setWalletName(result.wallet);
        
        // Verify network if specified
        if (network) {
          await verifyNetwork();
        }
        
        return result;
      } finally {
        setIsConnecting(false);
      }
    }, { context: 'useWallet.connect', setError });
  }, [network]);
  
  // Disconnect from wallet
  const disconnect = useCallback(async () => {
    return withErrorHandling(async () => {
      setError(null);
      
      const result = await walletService.disconnect();
      
      setIsConnected(false);
      setPublicKey(null);
      
      return result;
    }, { context: 'useWallet.disconnect', setError });
  }, []);
  
  // Sign message
  const signMessage = useCallback(async (message) => {
    return withErrorHandling(async () => {
      setError(null);
      
      if (!isConnected) {
        await connect();
      }
      
      return await walletService.signMessage(message);
    }, { context: 'useWallet.signMessage', setError });
  }, [isConnected, connect]);
  
  // Sign and send transaction
  const signAndSendTransaction = useCallback(async (transaction, options) => {
    return withErrorHandling(async () => {
      setError(null);
      
      if (!isConnected) {
        await connect();
      }
      
      return await walletService.signAndSendTransaction(transaction, options);
    }, { context: 'useWallet.signAndSendTransaction', setError });
  }, [isConnected, connect]);
  
  // Verify network
  const verifyNetwork = useCallback(async () => {
    if (!network) return true;
    
    return withErrorHandling(async () => {
      setError(null);
      
      return await walletService.verifyNetwork(network);
    }, { context: 'useWallet.verifyNetwork', setError });
  }, [network]);
  
  // Reset error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    // State
    isInitializing,
    isAvailable,
    isConnected,
    isConnecting,
    publicKey,
    walletName,
    error,
    
    // Functions
    connect,
    disconnect,
    signMessage,
    signAndSendTransaction,
    verifyNetwork,
    clearError,
  };
} 
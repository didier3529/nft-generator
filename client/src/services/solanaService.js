/**
 * Solana Blockchain Service
 * Handles NFT deployment with fallback mechanisms for compatibility issues
 */

import { Connection, clusterApiUrl, PublicKey, Keypair, Transaction } from '@solana/web3.js';

// Try to import TOKEN_PROGRAM_ID with proper error handling
let TOKEN_PROGRAM_ID;
try {
  const splToken = require('@solana/spl-token');
  TOKEN_PROGRAM_ID = splToken.TOKEN_PROGRAM_ID;
} catch (error) {
  console.warn('Using fallback TOKEN_PROGRAM_ID due to import error:', error);
  TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
}

// Debug mode toggle
const DEBUG_MODE = true;

// NFT.Storage setup with dynamic import for browser compatibility
let NFTStorage;
try {
  import('nft.storage').then(module => {
    NFTStorage = module.NFTStorage;
  });
} catch (error) {
  console.error('NFT.Storage import failed:', error);
}

// NFT.Storage client instance
let nftStorageClient = null;

/**
 * Helper for debug logging
 */
const logDebug = (message, data) => {
  if (DEBUG_MODE) {
    console.log(`[SolanaService] ${message}`, data || '');
  }
};

/**
 * Initialize NFT.Storage with API key
 * @param {string} apiKey - NFT.Storage API key
 * @returns {Promise<boolean>} Success status
 */
export const initializeNftStorage = async (apiKey) => {
  try {
    if (!NFTStorage) {
      // Attempt dynamic import if not already loaded
      try {
        const module = await import('nft.storage');
        NFTStorage = module.NFTStorage;
      } catch (importError) {
        throw new Error(`NFT.Storage module import failed: ${importError.message}`);
      }
    }
    
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    nftStorageClient = new NFTStorage({ token: apiKey });
    logDebug('NFT.Storage client initialized');
    return true;
  } catch (error) {
    console.error('NFT.Storage initialization failed:', error);
    throw error;
  }
};

/**
 * Upload NFT data to IPFS
 * @param {Object} nftData - NFT metadata and image
 * @returns {Promise<string>} IPFS URI
 */
export const uploadNftToIpfs = async (nftData) => {
  if (!nftData || !nftData.image) {
    throw new Error('Invalid NFT data: image is required');
  }

  try {
    // Structure metadata
    const metadata = {
      name: nftData.name || 'Untitled NFT',
      description: nftData.description || '',
      image: nftData.image,
      attributes: nftData.attributes || []
    };

    // Try NFT.Storage if available
    if (nftStorageClient) {
      try {
        const result = await nftStorageClient.store(metadata);
        logDebug('NFT uploaded to IPFS:', result);
        return result.url;
      } catch (ipfsError) {
        console.error('IPFS upload failed:', ipfsError);
        throw ipfsError;
      }
    } else {
      throw new Error('NFT.Storage client not initialized');
    }
  } catch (error) {
    console.error('NFT IPFS upload error:', error);
    
    // Only use mock fallback in development environment
    if (process.env.NODE_ENV === 'development') {
      const mockCid = 'bafybei' + Math.random().toString(36).substring(2, 15);
      const mockUrl = `ipfs://${mockCid}`;
      logDebug('Using mock IPFS URL:', mockUrl);
      return mockUrl;
    }
    
    throw error;
  }
};

/**
 * Deploy NFT to Solana blockchain
 * @param {Object} params - Deployment parameters
 * @returns {Promise<string>} Transaction ID or NFT mint address
 */
export const deployNftToSolana = async ({ 
  metadataUri, 
  wallet, 
  name, 
  symbol = 'NFT', 
  network = 'devnet' 
}) => {
  if (!wallet) {
    throw new Error('Wallet not connected');
  }

  if (!metadataUri) {
    throw new Error('Metadata URI is required');
  }

  logDebug('Deploying NFT to Solana', { name, uri: metadataUri, network });

  try {
    // Create connection to Solana network
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    
    // Get wallet public key
    const publicKey = typeof wallet.publicKey === 'string' 
      ? new PublicKey(wallet.publicKey) 
      : wallet.publicKey;
    
    if (!publicKey) {
      throw new Error('Invalid wallet public key');
    }

    // Check wallet balance
    const balance = await connection.getBalance(publicKey);
    if (balance < 10000000) { // 0.01 SOL minimum
      throw new Error('Insufficient balance to create NFT. At least 0.01 SOL needed.');
    }

    // Create NFT - this would use actual Solana APIs in a complete implementation
    // For now, we're returning a simulated result while the implementation is in progress
    
    // In a full implementation, this would:
    // 1. Create a token mint
    // 2. Create metadata account
    // 3. Sign and send transaction
    
    const isSimulated = true; // Change to false when full implementation is ready
    
    if (isSimulated) {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock mint address
      const mockMintAddress = new Array(44).fill(0).map(() => 
        "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)]
      ).join('');
      
      logDebug('NFT deployed with mock mint address:', mockMintAddress);
      return mockMintAddress;
    } else {
      // Real implementation would go here
      // This is placeholder code that will be filled in with actual implementation
      
      // Create mint account
      const mintAccount = Keypair.generate();
      
      // Would implement actual token minting here using SPL Token program
      // const transaction = new Transaction(...);
      
      // For now, return the mint key as a placeholder
      return mintAccount.publicKey.toBase58();
    }
  } catch (error) {
    console.error('NFT deployment error:', error);
    throw error;
  }
};

/**
 * Format wallet address for display
 * @param {string} address - Full wallet address
 * @returns {string} Formatted address
 */
export const formatWalletAddress = (address) => {
  if (!address) return '';
  if (typeof address !== 'string') {
    try {
      address = address.toString();
    } catch (e) {
      return 'Invalid Address';
    }
  }
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

/**
 * Get Solana connection object
 * @param {string} network - Network name
 * @returns {Connection} Solana connection
 */
export const getSolanaConnection = (network = 'devnet') => {
  return new Connection(clusterApiUrl(network), 'confirmed');
};

/**
 * Check wallet balance
 * @param {string|PublicKey} walletAddress - Wallet address
 * @param {string} network - Network name
 * @returns {Promise<number>} Balance in lamports
 */
export const getWalletBalance = async (walletAddress, network = 'devnet') => {
  try {
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const publicKey = typeof walletAddress === 'string' 
      ? new PublicKey(walletAddress) 
      : walletAddress;
    
    const balance = await connection.getBalance(publicKey);
    return balance;
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    throw error;
  }
};

export default {
  initializeNftStorage,
  uploadNftToIpfs,
  deployNftToSolana,
  formatWalletAddress,
  getSolanaConnection,
  getWalletBalance
}; 
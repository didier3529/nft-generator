/**
 * Secure Minting Service
 * Handles NFT minting with validation, retry logic, and security features
 */

import { uploadNftToIpfs, deployNftToSolana, getWalletBalance } from './solanaService';
import { hasSufficientBalance } from '../utils/securityUtils';

// Constants
const MIN_SOL_BALANCE = 0.01;
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 2000;

/**
 * Validates NFT metadata against schema requirements
 * @param {Object} metadata - NFT metadata to validate
 * @returns {Object} Validation result with success/error info
 */
export const validateMetadata = (metadata) => {
  const errors = [];
  
  // Required fields check
  if (!metadata) {
    return { valid: false, errors: ['Metadata is required'] };
  }
  
  // Check for name
  if (!metadata.name || typeof metadata.name !== 'string' || metadata.name.trim() === '') {
    errors.push('Name is required');
  } else if (metadata.name.length > 32) {
    errors.push('Name must be 32 characters or less');
  }
  
  // Check for description
  if (metadata.description && typeof metadata.description !== 'string') {
    errors.push('Description must be a string');
  } else if (metadata.description && metadata.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  // Check for image
  if (!metadata.image) {
    errors.push('Image is required');
  }
  
  // Check attributes
  if (metadata.attributes) {
    if (!Array.isArray(metadata.attributes)) {
      errors.push('Attributes must be an array');
    } else {
      metadata.attributes.forEach((attr, index) => {
        if (!attr.trait_type || typeof attr.trait_type !== 'string') {
          errors.push(`Attribute ${index + 1}: trait_type is required and must be a string`);
        }
        if (attr.value === undefined || attr.value === null) {
          errors.push(`Attribute ${index + 1}: value is required`);
        }
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Safe minting function with validation and retry logic
 * @param {Object} params - Minting parameters
 * @param {Object} params.metadata - NFT metadata
 * @param {Object} params.wallet - Wallet instance
 * @param {string} params.network - Solana network (default: 'devnet')
 * @param {Function} params.onProgress - Progress callback
 * @returns {Promise<Object>} Minting result
 */
export const safeMint = async ({ 
  metadata,
  wallet,
  network = 'devnet',
  onProgress = () => {}
}) => {
  try {
    // Step 1: Validate metadata
    onProgress({ stage: 'validation', progress: 10 });
    const validation = validateMetadata(metadata);
    
    if (!validation.valid) {
      return {
        success: false,
        stage: 'validation',
        errors: validation.errors
      };
    }
    
    // Step 2: Check wallet balance
    onProgress({ stage: 'wallet_check', progress: 20 });
    
    if (!wallet || !wallet.publicKey) {
      return {
        success: false,
        stage: 'wallet_check',
        error: 'Wallet not connected'
      };
    }
    
    const balance = await getWalletBalance(wallet.publicKey, network);
    const solBalance = balance / 1000000000; // Convert lamports to SOL
    
    if (!hasSufficientBalance(solBalance, 1, MIN_SOL_BALANCE)) {
      return {
        success: false,
        stage: 'wallet_check',
        error: `Insufficient balance. Minimum ${MIN_SOL_BALANCE} SOL required.`,
        balance: solBalance
      };
    }
    
    // Step 3: Generate IPFS upload with retries
    onProgress({ stage: 'ipfs_upload', progress: 40 });
    
    let ipfsUri;
    let ipfsAttempts = 0;
    
    while (ipfsAttempts < MAX_RETRY_COUNT) {
      try {
        ipfsUri = await uploadNftToIpfs(metadata);
        break; // Success, exit loop
      } catch (ipfsError) {
        ipfsAttempts++;
        console.error(`IPFS upload attempt ${ipfsAttempts} failed:`, ipfsError);
        
        if (ipfsAttempts >= MAX_RETRY_COUNT) {
          return {
            success: false,
            stage: 'ipfs_upload',
            error: `IPFS upload failed after ${MAX_RETRY_COUNT} attempts: ${ipfsError.message}`
          };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
    
    // Step 4: Execute transaction with retries
    onProgress({ stage: 'blockchain_transaction', progress: 70 });
    
    let nftAddress;
    let txAttempts = 0;
    
    while (txAttempts < MAX_RETRY_COUNT) {
      try {
        nftAddress = await deployNftToSolana({
          metadataUri: ipfsUri,
          wallet,
          name: metadata.name,
          symbol: metadata.symbol || 'NFT',
          network
        });
        
        break; // Success, exit loop
      } catch (txError) {
        txAttempts++;
        console.error(`Transaction attempt ${txAttempts} failed:`, txError);
        
        if (txAttempts >= MAX_RETRY_COUNT) {
          return {
            success: false,
            stage: 'blockchain_transaction',
            error: `Transaction failed after ${MAX_RETRY_COUNT} attempts: ${txError.message}`
          };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
    
    // Success
    onProgress({ stage: 'complete', progress: 100 });
    
    return {
      success: true,
      stage: 'complete',
      address: nftAddress,
      metadata: ipfsUri,
      network
    };
    
  } catch (error) {
    // Log to console only (no external tracking for privacy)
    console.error('Mint error:', error);
    
    return {
      success: false,
      stage: 'unknown',
      error: error.message
    };
  }
};

/**
 * Get SOL balance with fallback mechanism
 * @param {Object} wallet - Wallet instance
 * @param {string} network - Solana network
 * @returns {Promise<number>} Balance in SOL
 */
export const getSolBalance = async (wallet, network = 'devnet') => {
  if (!wallet || !wallet.publicKey) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const balance = await getWalletBalance(wallet.publicKey, network);
    return balance / 1000000000; // Convert lamports to SOL
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
};

/**
 * Checks if wallet is eligible for minting
 * @param {Object} wallet - Wallet instance
 * @param {string} network - Solana network
 * @returns {Promise<Object>} Eligibility result
 */
export const checkMintEligibility = async (wallet, network = 'devnet') => {
  try {
    if (!wallet || !wallet.publicKey) {
      return {
        eligible: false,
        reason: 'Wallet not connected'
      };
    }
    
    const balance = await getSolBalance(wallet, network);
    
    if (balance < MIN_SOL_BALANCE) {
      return {
        eligible: false,
        reason: `Insufficient balance. Minimum ${MIN_SOL_BALANCE} SOL required.`,
        balance
      };
    }
    
    return {
      eligible: true,
      balance
    };
  } catch (error) {
    return {
      eligible: false,
      reason: `Could not verify eligibility: ${error.message}`
    };
  }
}; 
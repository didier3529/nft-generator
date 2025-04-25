/**
 * Security Utilities for NFT Generator
 * Contains functions for anonymity protection, data security, and privacy features
 */

/**
 * Removes EXIF data from images
 * @param {File|Blob} imageFile - The original image file/blob
 * @returns {Promise<Blob>} The image without EXIF data
 */
export const removeExifData = async (imageFile) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        
        img.onload = () => {
          // Create canvas to draw the image without EXIF
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas (strips EXIF)
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // Convert to blob with original type or fallback to png
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image'));
              return;
            }
            
            resolve(blob);
          }, imageFile.type || 'image/png');
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image for EXIF removal'));
        };
        
        // Load the image from the file reader result
        img.src = event.target.result;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      
      // Start reading the file
      reader.readAsDataURL(imageFile);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Session expiry parameters
 */
const SESSION_KEYS = [
  'nft-generator-layers',
  'nft-generator-settings',
  'nft-generator-metadata',
  'nft-generator-history',
  'nft-generator-combinations',
  'nft-generator-selected',
  'nft-generator-export-timestamp',
  'nft-generator-mint-count'
];

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds
let idleTimer = null;

/**
 * Initializes auto-wipe functionality for localStorage after idle period
 * @returns {Object} Methods for controlling the idle timer
 */
export const initializeAutoWipe = () => {
  let lastActivity = Date.now();
  
  // Function to handle user activity
  const handleUserActivity = () => {
    lastActivity = Date.now();
    
    // Clear existing timer
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    
    // Set new timer
    idleTimer = setTimeout(() => {
      const timeIdle = Date.now() - lastActivity;
      
      if (timeIdle >= IDLE_TIMEOUT) {
        wipeLocalStorage();
      }
    }, IDLE_TIMEOUT);
  };
  
  // Set up event listeners
  window.addEventListener('mousemove', handleUserActivity);
  window.addEventListener('keydown', handleUserActivity);
  window.addEventListener('click', handleUserActivity);
  window.addEventListener('scroll', handleUserActivity);
  window.addEventListener('touchstart', handleUserActivity);
  
  // Initial activity trigger
  handleUserActivity();
  
  return {
    reset: handleUserActivity,
    clear: () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
      
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    },
    forceWipe: wipeLocalStorage
  };
};

/**
 * Wipes sensitive data from localStorage
 */
export const wipeLocalStorage = () => {
  try {
    // Wipe all NFT Generator keys
    SESSION_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Local storage wiped for security after inactivity');
    
    // Dispatch event that can be caught by components
    window.dispatchEvent(new CustomEvent('localStorageWiped'));
    
    return true;
  } catch (error) {
    console.error('Error wiping local storage:', error);
    return false;
  }
};

/**
 * Generates secure burner wallet guide content
 * @returns {Object} HTML content and steps for creating a burner wallet
 */
export const generateBurnerWalletGuide = () => {
  return {
    title: 'Secure Burner Wallet Guide',
    content: `
      <div class="burner-wallet-guide">
        <p class="warning">For maximum anonymity, we recommend using a burner wallet that's not connected to your main funds or identity.</p>
        
        <h3>Phantom Wallet Instructions:</h3>
        <ol>
          <li>Install <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer">Phantom</a> browser extension</li>
          <li>Open Phantom and click "Create New Wallet"</li>
          <li>Follow the steps to create a new wallet (write down your recovery phrase in a secure location)</li>
          <li>Add SOL to your wallet (minimum 0.01 SOL needed for minting)</li>
          <li>Use this wallet exclusively for this NFT collection</li>
          <li>After minting, transfer NFTs to your main wallet if desired</li>
        </ol>
        
        <h3>Solflare Wallet Instructions:</h3>
        <ol>
          <li>Install <a href="https://solflare.com/download" target="_blank" rel="noopener noreferrer">Solflare</a> browser extension</li>
          <li>Click "Create New Wallet"</li>
          <li>Choose a strong password</li>
          <li>Save your recovery phrase securely</li>
          <li>Fund the wallet with SOL (at least 0.01 SOL)</li>
          <li>Use only for this NFT collection</li>
        </ol>
        
        <p class="tip">Remember: Never share your recovery phrase with anyone, and consider using a VPN for additional privacy.</p>
      </div>
    `,
    steps: [
      'Install wallet extension (Phantom or Solflare)',
      'Create new wallet (save recovery phrase securely)',
      'Fund with minimum SOL needed (0.01 SOL)',
      'Connect to NFT Generator',
      'After minting, consider transferring to main wallet'
    ]
  };
};

/**
 * Check if user's wallet has sufficient SOL for minting
 * @param {number} balance - Current wallet balance in SOL
 * @param {number} [count=1] - Number of NFTs to mint
 * @param {number} [threshold=0.01] - Minimum SOL required per NFT
 * @returns {boolean} True if balance is sufficient
 */
export const hasSufficientBalance = (balance, count = 1, threshold = 0.01) => {
  if (typeof balance !== 'number' || isNaN(balance)) {
    return false;
  }
  
  return balance >= (threshold * count);
};

/**
 * Randomize wallet display format for privacy
 * @param {string} address - Wallet address to display
 * @returns {string} Formatted wallet display
 */
export const formatWalletAddressForDisplay = (address) => {
  if (!address || typeof address !== 'string') {
    return '';
  }
  
  const length = address.length;
  const startLength = Math.floor(Math.random() * 2) + 3; // 3-4 chars
  const endLength = Math.floor(Math.random() * 2) + 3; // 3-4 chars
  
  return `${address.slice(0, startLength)}...${address.slice(length - endLength)}`;
}; 
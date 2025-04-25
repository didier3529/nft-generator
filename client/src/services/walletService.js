/**
 * Wallet Service
 * Handles interactions with Solana wallets (Phantom, Solflare, etc.)
 */

import EventEmitter from 'events';
import { WalletError, WalletErrorCodes, withErrorHandling, processError, isRetriableError, formatErrorForUser } from '../utils/errorHandling';

class WalletService extends EventEmitter {
  constructor() {
    super();
    this.provider = null;
    this.wallet = null;
    this.connected = false;
    this.publicKey = null;
    this.autoConnect = false;
    this.onAccountChange = null;
    this.onNetworkChange = null;
    this._isConnected = false;
    this._publicKey = null;
    this._walletName = null;
    this._isAvailable = false;
    this._network = null;
    this._defaultNetwork = 'mainnet-beta';

    // Check for wallet availability after a short delay to simulate detection
    setTimeout(() => {
      this._checkWalletAvailability();
    }, 500);
  }

  /**
   * Initializes the wallet service
   * @param {Object} options - Initialization options
   * @param {boolean} [options.autoConnect=false] - Whether to auto-connect on init
   * @param {Function} [options.onAccountChange] - Callback for account changes
   * @param {Function} [options.onNetworkChange] - Callback for network changes
   * @param {string} [options.network] - Preferred network (defaults to mainnet-beta)
   */
  async initialize(options = {}) {
    this.autoConnect = options.autoConnect || false;
    this.onAccountChange = options.onAccountChange;
    this.onNetworkChange = options.onNetworkChange;
    this._network = options.network || this._defaultNetwork;

    return withErrorHandling(async () => {
      await this.detectProvider();
      
      if (this.provider) {
        this.setupEventListeners();
        
        if (this.autoConnect) {
          await this.connect();
        }
      }
      
      return {
        available: !!this.provider,
        connected: this.connected,
        publicKey: this.publicKey
      };
    }, { context: 'WalletService.initialize' });
  }

  /**
   * Detects available wallet provider
   */
  async detectProvider() {
    return withErrorHandling(async () => {
      // Check for Phantom wallet
      if (window.phantom?.solana) {
        this.provider = window.phantom.solana;
        this.wallet = 'phantom';
        return true;
      }
      
      // Check for Solflare wallet
      if (window.solflare) {
        this.provider = window.solflare;
        this.wallet = 'solflare';
        return true;
      }
      
      // Check for Solana wallet adapter
      if (window.solana) {
        this.provider = window.solana;
        this.wallet = 'unknown'; // Generic Solana wallet
        return true;
      }
      
      throw new WalletError({
        code: WalletErrorCodes.WALLET_NOT_FOUND,
        message: 'No Solana wallet detected. Please install Phantom or Solflare',
        context: { detectedWallets: [] }
      });
    }, { context: 'WalletService.detectProvider', showToast: false });
  }

  /**
   * Sets up event listeners for wallet events
   */
  setupEventListeners() {
    if (!this.provider) return;
    
    // Handle account changes
    this.provider.on('accountChanged', (publicKey) => {
      if (publicKey) {
        this.publicKey = publicKey.toString();
        this.connected = true;
      } else {
        this.publicKey = null;
        this.connected = false;
      }
      
      if (this.onAccountChange && typeof this.onAccountChange === 'function') {
        this.onAccountChange(this.publicKey);
      }
    });
    
    // Handle connection state changes
    this.provider.on('connect', (publicKey) => {
      if (publicKey) {
        this.publicKey = publicKey.toString();
        this.connected = true;
      }
    });
    
    // Handle disconnects
    this.provider.on('disconnect', () => {
      this.publicKey = null;
      this.connected = false;
    });
    
    // Handle network changes (if supported by the wallet)
    if (this.provider.on && typeof this.provider.on === 'function') {
      try {
        this.provider.on('networkChanged', (network) => {
          if (this.onNetworkChange && typeof this.onNetworkChange === 'function') {
            this.onNetworkChange(network);
          }
        });
      } catch (error) {
        console.warn('Network change event not supported by this wallet');
      }
    }
  }

  /**
   * Simulates checking if wallets are available in the browser
   * @private
   */
  _checkWalletAvailability() {
    // In a real implementation, this would check window.solana, window.phantom, etc.
    const mockAvailable = Math.random() > 0.2; // 80% chance wallet is available
    this._isAvailable = mockAvailable;
    
    if (mockAvailable) {
      this._walletName = 'Phantom'; // For simplicity, we'll just use Phantom as the mock wallet
    }
    
    this.emit('availabilityChange', this._isAvailable);
  }

  /**
   * Connects to the wallet
   * @returns {Object} Connection result
   */
  async connect() {
    return withErrorHandling(async () => {
      if (!this.provider) {
        await this.detectProvider();
        
        if (!this.provider) {
          throw new WalletError({
            code: WalletErrorCodes.WALLET_NOT_FOUND,
            message: 'No Solana wallet detected. Please install Phantom or Solflare',
            context: { detectedWallets: [] }
          });
        }
      }
      
      try {
        const response = await this.provider.connect();
        const publicKey = response.publicKey.toString();
        
        this.connected = true;
        this.publicKey = publicKey;
        
        return {
          connected: true,
          publicKey,
          wallet: this.wallet
        };
      } catch (error) {
        // Check for user rejection
        if (error.message && error.message.includes('User rejected')) {
          throw new WalletError({
            code: WalletErrorCodes.WALLET_CONNECTION_REJECTED,
            message: 'Wallet connection was rejected by user',
            context: { originalError: error }
          });
        }
        
        // Re-throw other errors
        throw error;
      }
    }, { context: 'WalletService.connect' });
  }

  /**
   * Disconnects from the wallet
   */
  async disconnect() {
    return withErrorHandling(async () => {
      if (!this.provider) {
        return { connected: false };
      }
      
      if (this.provider.disconnect && typeof this.provider.disconnect === 'function') {
        await this.provider.disconnect();
      }
      
      this.connected = false;
      this.publicKey = null;
      
      return { connected: false };
    }, { context: 'WalletService.disconnect' });
  }

  /**
   * Signs a message using the wallet
   * @param {Uint8Array} message - Message to sign
   * @returns {Object} Signed message
   */
  async signMessage(message) {
    return withErrorHandling(async () => {
      if (!this.connected || !this.provider) {
        throw new WalletError({
          code: WalletErrorCodes.WALLET_NOT_CONNECTED,
          message: 'Please connect your wallet to sign messages',
          context: {}
        });
      }
      
      if (!this.provider.signMessage) {
        throw new WalletError({
          code: WalletErrorCodes.WALLET_NOT_SUPPORTED,
          message: 'This wallet does not support message signing',
          context: { wallet: this.wallet }
        });
      }
      
      // Ensure message is Uint8Array
      const messageBytes = message instanceof Uint8Array 
        ? message 
        : new TextEncoder().encode(message);
      
      try {
        const { signature } = await this.provider.signMessage(messageBytes);
        
        return {
          signature,
          publicKey: this.publicKey
        };
      } catch (error) {
        // Check for user rejection
        if (error.message && (error.message.includes('User rejected') || error.message.includes('cancelled'))) {
          throw new WalletError({
            code: WalletErrorCodes.SIGNATURE_REJECTED,
            message: 'Message signing was rejected by user',
            context: { originalError: error }
          });
        }
        
        throw processError(error, { context: 'signMessage' });
      }
    }, { context: 'WalletService.signMessage' });
  }

  /**
   * Signs and sends a transaction
   * @param {Transaction} transaction - Transaction to sign and send
   * @param {Object} options - Transaction options
   * @returns {Object} Transaction result
   */
  async signAndSendTransaction(transaction, options = {}) {
    return withErrorHandling(async () => {
      if (!this.connected || !this.provider) {
        throw new WalletError({
          code: WalletErrorCodes.WALLET_NOT_CONNECTED,
          message: 'Please connect your wallet to sign transactions',
          context: {}
        });
      }
      
      if (!this.provider.signAndSendTransaction) {
        throw new WalletError({
          code: WalletErrorCodes.WALLET_NOT_SUPPORTED,
          message: 'This wallet does not support transaction signing',
          context: { wallet: this.wallet }
        });
      }
      
      try {
        const { signature } = await this.provider.signAndSendTransaction(transaction, options);
        
        return {
          signature,
          publicKey: this.publicKey
        };
      } catch (error) {
        // Check for user rejection
        if (error.message && (error.message.includes('User rejected') || error.message.includes('cancelled'))) {
          throw new WalletError({
            code: WalletErrorCodes.TRANSACTION_REJECTED,
            message: 'Transaction was rejected by user',
            context: { originalError: error }
          });
        }
        
        // Check for insufficient funds
        if (error.message && error.message.includes('insufficient funds')) {
          throw new WalletError({
            code: WalletErrorCodes.INSUFFICIENT_FUNDS,
            message: 'Insufficient funds for this transaction',
            context: { originalError: error }
          });
        }
        
        throw processError(error, { context: 'signAndSendTransaction' });
      }
    }, { context: 'WalletService.signAndSendTransaction' });
  }

  /**
   * Gets the current wallet state
   * @returns {Object} Wallet state information
   */
  getState() {
    return {
      available: !!this.provider,
      connected: this.connected,
      publicKey: this.publicKey,
      wallet: this.wallet
    };
  }

  /**
   * Checks if the connected network is the expected one
   * @param {string} expectedNetwork - Network to check against (e.g., 'mainnet-beta', 'devnet')
   * @returns {boolean} Whether the network matches
   */
  async verifyNetwork(expectedNetwork) {
    return withErrorHandling(async () => {
      if (!this.connected || !this.provider) {
        throw new WalletError({
          code: WalletErrorCodes.WALLET_NOT_CONNECTED,
          message: 'Please connect your wallet to verify network',
          context: {}
        });
      }
      
      // Not all wallets expose this, so we have to handle it carefully
      if (this.provider.connection && this.provider.connection.rpcEndpoint) {
        const endpoint = this.provider.connection.rpcEndpoint.toLowerCase();
        
        // Check network from endpoint
        const network = endpoint.includes('devnet') 
          ? 'devnet'
          : endpoint.includes('testnet') 
            ? 'testnet' 
            : 'mainnet-beta';
        
        const isCorrectNetwork = network === expectedNetwork;
        
        if (!isCorrectNetwork) {
          throw new WalletError({
            code: WalletErrorCodes.NETWORK_MISMATCH,
            message: `Please switch to ${expectedNetwork} in your wallet`,
            context: { currentNetwork: network, expectedNetwork }
          });
        }
        
        return true;
      }
      
      // If we can't determine the network, we'll assume it's correct
      return true;
    }, { context: 'WalletService.verifyNetwork' });
  }

  /**
   * Check if the wallet is available in the browser
   * @returns {boolean}
   */
  isAvailable() {
    return this._isAvailable;
  }

  /**
   * Get the currently connected wallet's name
   * @returns {string|null}
   */
  getWalletName() {
    return this._walletName;
  }

  /**
   * Get the current network
   * @returns {string}
   */
  getNetwork() {
    return this._network;
  }

  /**
   * Check if a wallet is connected
   * @returns {boolean}
   */
  isConnected() {
    return this._isConnected;
  }
}

// Create singleton instance
const walletService = new WalletService();

export default walletService; 
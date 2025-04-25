/**
 * Error Handling Utilities
 * Provides standardized error handling for NFT Generator
 */

/**
 * Error types for categorization
 */
export const ErrorType = {
  WALLET: 'wallet',
  NETWORK: 'network',
  BLOCKCHAIN: 'blockchain',
  INPUT: 'input',
  SERVICE: 'service',
  UNKNOWN: 'unknown'
};

/**
 * Error codes for specific error scenarios
 */
export const ErrorCode = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'wallet_not_connected',
  WALLET_CONNECTION_REJECTED: 'wallet_connection_rejected',
  WRONG_NETWORK: 'wrong_network',
  
  // Network errors
  NETWORK_ERROR: 'network_error',
  API_ERROR: 'api_error',
  
  // Blockchain errors
  TRANSACTION_FAILED: 'transaction_failed',
  SIGNATURE_FAILED: 'signature_failed',
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  
  // Input errors
  INVALID_INPUT: 'invalid_input',
  MISSING_REQUIRED_FIELD: 'missing_required_field',
  
  // Service errors
  SERVICE_UNAVAILABLE: 'service_unavailable',
  
  // Unknown errors
  UNKNOWN_ERROR: 'unknown_error'
};

/**
 * Wallet-specific error codes
 */
export const WalletErrorCodes = {
  WALLET_NOT_FOUND: 'wallet_not_found',
  WALLET_NOT_CONNECTED: 'wallet_not_connected',
  WALLET_CONNECTION_REJECTED: 'wallet_connection_rejected',
  WALLET_NOT_SUPPORTED: 'wallet_not_supported',
  SIGNATURE_REJECTED: 'signature_rejected',
  TRANSACTION_REJECTED: 'transaction_rejected',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  NETWORK_MISMATCH: 'network_mismatch'
};

/**
 * Create a standardized error object
 * @param {string} type - Error type from ErrorType enum
 * @param {string} code - Error code from ErrorCode enum
 * @param {string} message - Human-readable error message
 * @param {Object} data - Additional error data
 * @returns {Error} Standardized error object
 */
export const createError = (type, code, message, data = {}) => {
  const error = new Error(message);
  error.type = type;
  error.code = code;
  error.data = data;
  error.timestamp = new Date().toISOString();
  
  return error;
};

/**
 * Map blockchain errors to standardized format
 * @param {Error} error - Original error
 * @returns {Error} Mapped error
 */
export const mapBlockchainError = (error) => {
  // Return if already a mapped error
  if (error.type && error.code) {
    return error;
  }
  
  const errorMessage = error.message?.toLowerCase() || '';
  
  // Wallet connection errors
  if (errorMessage.includes('wallet not connected') || 
      errorMessage.includes('not connected') ||
      errorMessage.includes('wallet disconnected')) {
    return createError(
      ErrorType.WALLET,
      ErrorCode.WALLET_NOT_CONNECTED,
      'Wallet is not connected. Please connect your wallet.',
      { originalError: error }
    );
  }
  
  // User rejected errors
  if (errorMessage.includes('user rejected') || 
      errorMessage.includes('user declined') ||
      errorMessage.includes('user cancelled')) {
    return createError(
      ErrorType.WALLET,
      ErrorCode.WALLET_CONNECTION_REJECTED,
      'Transaction was rejected by user',
      { originalError: error }
    );
  }
  
  // Balance errors
  if (errorMessage.includes('insufficient') && 
      (errorMessage.includes('balance') || errorMessage.includes('funds'))) {
    return createError(
      ErrorType.BLOCKCHAIN,
      ErrorCode.INSUFFICIENT_BALANCE,
      'Insufficient balance for this transaction',
      { originalError: error }
    );
  }
  
  // Network errors
  if (errorMessage.includes('network') || 
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout')) {
    return createError(
      ErrorType.NETWORK,
      ErrorCode.NETWORK_ERROR,
      'Network error. Please check your connection.',
      { originalError: error }
    );
  }
  
  // Transaction errors
  if (errorMessage.includes('transaction') || 
      errorMessage.includes('signature')) {
    return createError(
      ErrorType.BLOCKCHAIN,
      ErrorCode.TRANSACTION_FAILED,
      'Transaction failed. Please try again.',
      { originalError: error }
    );
  }
  
  // Default unknown error
  return createError(
    ErrorType.UNKNOWN,
    ErrorCode.UNKNOWN_ERROR,
    error.message || 'An unknown error occurred',
    { originalError: error }
  );
};

/**
 * Log error to console with context
 * @param {Error} error - Error to log
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = '') => {
  const contextPrefix = context ? `[${context}] ` : '';
  
  console.error(`${contextPrefix}Error:`, error);
  
  if (error.code) {
    console.error(`${contextPrefix}Code:`, error.code);
  }
  
  if (error.data) {
    console.error(`${contextPrefix}Data:`, error.data);
  }
};

/**
 * Handle error with standard patterns
 * @param {Error} error - Error to handle
 * @param {boolean} showToast - Whether to show toast notification
 * @returns {Error} Processed error
 */
export const handleError = (error, showToast = true) => {
  // Map to standardized error if needed
  const mappedError = error.type && error.code ? error : mapBlockchainError(error);
  
  // Log error
  logError(mappedError);
  
  // Show toast notification if requested
  if (showToast && typeof window !== 'undefined') {
    // If we have a toast service, we could show it here
    // For now, just log to console
    console.warn('Toast notification would show:', mappedError.message);
  }
  
  return mappedError;
};

/**
 * Higher-order function for standardized error handling
 * @param {Function} asyncFn - Async function to wrap with error handling
 * @param {Object} options - Options for error handling
 * @returns {Promise<any>} Result of asyncFn or throws handled error
 */
export const withErrorHandling = async (asyncFn, options = {}) => {
  const { 
    context = '', 
    showToast = true,
    setError = null 
  } = options;
  
  try {
    return await asyncFn();
  } catch (error) {
    const handledError = handleError(error, showToast);
    
    // Set error state if provided
    if (setError && typeof setError === 'function') {
      setError(handledError);
    }
    
    throw handledError;
  }
};

/**
 * Validate input data against rules
 * @param {Object} data - Data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validateInput = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  // Process each rule
  Object.entries(rules).forEach(([field, rule]) => {
    // Check if required
    if (rule.required && (data[field] === undefined || data[field] === null || data[field] === '')) {
      errors[field] = rule.requiredMessage || `${field} is required`;
      isValid = false;
      return;
    }
    
    // Skip further validation if field is not required and empty
    if ((data[field] === undefined || data[field] === null || data[field] === '') && !rule.required) {
      return;
    }
    
    // Check type
    if (rule.type && typeof data[field] !== rule.type) {
      errors[field] = rule.typeMessage || `${field} must be a ${rule.type}`;
      isValid = false;
      return;
    }
    
    // Check min length
    if (rule.minLength !== undefined && data[field].length < rule.minLength) {
      errors[field] = rule.minLengthMessage || `${field} must be at least ${rule.minLength} characters`;
      isValid = false;
      return;
    }
    
    // Check max length
    if (rule.maxLength !== undefined && data[field].length > rule.maxLength) {
      errors[field] = rule.maxLengthMessage || `${field} must be no more than ${rule.maxLength} characters`;
      isValid = false;
      return;
    }
    
    // Check pattern
    if (rule.pattern && !rule.pattern.test(data[field])) {
      errors[field] = rule.patternMessage || `${field} has an invalid format`;
      isValid = false;
      return;
    }
    
    // Check custom validator
    if (rule.validator && typeof rule.validator === 'function') {
      const isValidField = rule.validator(data[field], data);
      if (!isValidField) {
        errors[field] = rule.validatorMessage || `${field} is invalid`;
        isValid = false;
      }
    }
  });
  
  return {
    isValid,
    errors
  };
};

/**
 * Throw validation error with standardized format
 * @param {Object} validationResult - Result from validateInput
 */
export const throwValidationError = (validationResult) => {
  if (validationResult.isValid) {
    return;
  }
  
  throw createError(
    ErrorType.INPUT,
    ErrorCode.INVALID_INPUT,
    'Validation failed',
    { errors: validationResult.errors }
  );
};

/**
 * Custom error class for wallet-related errors
 */
export class WalletError extends Error {
  /**
   * Create a wallet error
   * @param {Object} params - Error parameters
   * @param {string} params.code - Error code from WalletErrorCodes
   * @param {string} params.message - Human-readable error message
   * @param {boolean} params.retriable - Whether the operation can be retried
   * @param {Object} params.context - Additional context data
   */
  constructor({ code, message, retriable = false, context = {} }) {
    super(message);
    this.name = 'WalletError';
    this.code = code;
    this.retriable = retriable;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Process errors and convert to standardized format
 * @param {Error} error - Original error
 * @param {Object} options - Processing options
 * @returns {Error} Processed error
 */
export function processError(error, options = {}) {
  // Already a WalletError, return as is
  if (error instanceof WalletError) {
    return error;
  }
  
  const { context = '' } = options;
  const errorMessage = error.message?.toLowerCase() || '';
  
  // Map common error patterns to WalletError
  
  // Connection errors
  if (errorMessage.includes('not connected') || errorMessage.includes('disconnected')) {
    return new WalletError({
      code: WalletErrorCodes.WALLET_NOT_CONNECTED,
      message: 'Wallet is not connected',
      retriable: true,
      context: { originalError: error, context }
    });
  }
  
  // Rejection errors
  if (errorMessage.includes('reject') || errorMessage.includes('cancel') || errorMessage.includes('decline')) {
    return new WalletError({
      code: WalletErrorCodes.TRANSACTION_REJECTED,
      message: 'Action was rejected by user',
      retriable: true,
      context: { originalError: error, context }
    });
  }
  
  // Balance errors
  if (errorMessage.includes('insufficient') || errorMessage.includes('not enough')) {
    return new WalletError({
      code: WalletErrorCodes.INSUFFICIENT_FUNDS,
      message: 'Insufficient funds for this transaction',
      retriable: false,
      context: { originalError: error, context }
    });
  }
  
  // Return generic wallet error for unrecognized errors
  return new WalletError({
    code: WalletErrorCodes.UNKNOWN_ERROR,
    message: error.message || 'An unknown wallet error occurred',
    retriable: false,
    context: { originalError: error, context }
  });
}

/**
 * Check if an error can be retried
 * @param {Error} error - Error to check
 * @returns {boolean} Whether the error is retriable
 */
export function isRetriableError(error) {
  return error.retriable || 
         (error instanceof WalletError && error.retriable) ||
         error.code === WalletErrorCodes.WALLET_NOT_CONNECTED ||
         error.code === WalletErrorCodes.NETWORK_MISMATCH;
}

/**
 * Format error message for user display
 * @param {Error} error - Error to format
 * @returns {string} User-friendly error message
 */
export function formatErrorForUser(error) {
  // If no error provided, return generic message
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // If already a WalletError, use its message
  if (error instanceof WalletError) {
    return error.message;
  }
  
  // Check for wallet connection errors
  if (error.code === WalletErrorCodes.WALLET_NOT_CONNECTED) {
    return 'Please connect your wallet to continue';
  }
  
  if (error.code === WalletErrorCodes.WALLET_CONNECTION_REJECTED) {
    return 'Wallet connection was rejected. Please try again.';
  }
  
  if (error.code === WalletErrorCodes.WALLET_NOT_FOUND) {
    return 'No compatible wallet found. Please install Phantom or Solflare.';
  }
  
  if (error.code === WalletErrorCodes.INSUFFICIENT_FUNDS) {
    return 'Insufficient funds for this transaction. Please add more SOL to your wallet.';
  }
  
  if (error.code === WalletErrorCodes.TRANSACTION_REJECTED) {
    return 'Transaction was rejected. You can try again if needed.';
  }
  
  if (error.code === WalletErrorCodes.NETWORK_MISMATCH) {
    return `Please switch to the correct network in your wallet. ${error.context?.expectedNetwork ? `(${error.context.expectedNetwork})` : ''}`;
  }
  
  // Return original message if available, or generic message
  return error.message || 'An error occurred';
}

/**
 * Utility to safely parse a public key string
 * @param {string|null} publicKey - Public key to parse
 * @returns {string|null} Formatted public key or null
 */
export function parsePublicKey(publicKey) {
  if (!publicKey) return null;
  
  try {
    // If it's already a string, just return it
    if (typeof publicKey === 'string') {
      return publicKey;
    }
    
    // If it has a toString method (like Solana's PublicKey), use it
    if (publicKey.toString && typeof publicKey.toString === 'function') {
      return publicKey.toString();
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing public key:', error);
    return null;
  }
} 
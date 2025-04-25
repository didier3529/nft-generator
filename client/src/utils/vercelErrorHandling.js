/**
 * Utility functions for handling common Vercel deployment errors
 */

// Error constants
export const VERCEL_ERRORS = {
  FUNCTION_INVOCATION_FAILED: 'FUNCTION_INVOCATION_FAILED',
  FUNCTION_INVOCATION_TIMEOUT: 'FUNCTION_INVOCATION_TIMEOUT',
  MIDDLEWARE_INVOCATION_FAILED: 'MIDDLEWARE_INVOCATION_FAILED',
  MIDDLEWARE_INVOCATION_TIMEOUT: 'MIDDLEWARE_INVOCATION_TIMEOUT',
  EDGE_FUNCTION_INVOCATION_FAILED: 'EDGE_FUNCTION_INVOCATION_FAILED',
  EDGE_FUNCTION_INVOCATION_TIMEOUT: 'EDGE_FUNCTION_INVOCATION_TIMEOUT',
  FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE: 'FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE',
  FUNCTION_PAYLOAD_TOO_LARGE: 'FUNCTION_PAYLOAD_TOO_LARGE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};

/**
 * Maps HTTP status codes to potential Vercel error types
 * @param {number} statusCode - HTTP status code
 * @returns {string|null} - Mapped error type or null if not recognized
 */
export const mapStatusCodeToVercelError = (statusCode) => {
  switch (statusCode) {
    case 500:
      return 'A server error occurred. This could be due to function invocation failure.';
    case 503:
      return 'Service unavailable. The server might be overloaded or down for maintenance.';
    case 504:
      return 'Gateway timeout. The server function took too long to respond.';
    case 413:
      return 'Payload too large. Try reducing the size of your request or response.';
    default:
      return null;
  }
};

/**
 * Handles errors from API calls and checks if they might be Vercel-related
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error) => {
  // If we have a response with status code, check for Vercel-specific errors
  if (error.response && error.response.status) {
    const vercelError = mapStatusCodeToVercelError(error.response.status);
    if (vercelError) {
      return `${vercelError} (Status: ${error.response.status})`;
    }
  }

  // Extract message from various error formats
  const message = 
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    'An unknown error occurred';

  return message;
};

/**
 * Checks if the error appears to be a Vercel deployment error
 * @param {Error} error - The error object
 * @returns {boolean} - True if it matches Vercel deployment error patterns
 */
export const isVercelDeploymentError = (error) => {
  // Check for Vercel-specific status codes
  if (error.response && error.response.status) {
    return [500, 503, 504, 413].includes(error.response.status);
  }

  // Check for error messages that might indicate Vercel issues
  if (error.message) {
    const message = error.message.toLowerCase();
    return message.includes('function') && 
           (message.includes('timeout') || 
            message.includes('failed') ||
            message.includes('invocation'));
  }

  return false;
};

/**
 * Provides recommendations for fixing common Vercel deployment errors
 * @param {Error} error - The error object
 * @returns {string} - Recommendation for fixing the error
 */
export const getVercelErrorRecommendation = (error) => {
  if (!isVercelDeploymentError(error)) {
    return 'This does not appear to be a Vercel deployment error.';
  }

  // For timeout errors
  if (error.response && error.response.status === 504) {
    return 'The operation took too long to complete. Try optimizing your code or breaking it into smaller functions.';
  }

  // For payload errors
  if (error.response && error.response.status === 413) {
    return 'Your request or response is too large. Try reducing the data size or chunking the data.';
  }

  // For server errors
  if (error.response && error.response.status === 500) {
    return 'Check the function logs in your Vercel dashboard for more details. Ensure all dependencies are properly installed.';
  }

  return 'Check your Vercel deployment logs and configuration. Make sure all environment variables are set correctly.';
};

export default {
  VERCEL_ERRORS,
  mapStatusCodeToVercelError,
  handleApiError,
  isVercelDeploymentError,
  getVercelErrorRecommendation
}; 
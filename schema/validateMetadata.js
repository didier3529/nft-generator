const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = require('./nft-schema.json');

/**
 * Validates NFT metadata against the Solana NFT metadata schema
 * 
 * @param {Object} metadata - The NFT metadata to validate
 * @returns {Object} - Object containing validation result and any errors
 * @property {boolean} valid - Whether the metadata is valid
 * @property {Array|null} errors - Validation errors if any
 */
function validateNFTMetadata(metadata) {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  
  const validate = ajv.compile(schema);
  const valid = validate(metadata);
  
  return {
    valid,
    errors: valid ? null : validate.errors
  };
}

/**
 * Formats validation errors for easier reading
 * 
 * @param {Array} errors - The errors from the validator
 * @returns {Array} - Formatted error messages
 */
function formatErrors(errors) {
  if (!errors || !Array.isArray(errors)) {
    return [];
  }
  
  return errors.map(error => {
    const path = error.instancePath || '';
    const property = error.params.missingProperty || '';
    const location = path ? path : property ? `property '${property}'` : '';
    
    switch (error.keyword) {
      case 'required':
        return `Missing required ${location}`;
      case 'type':
        return `${location} should be a ${error.params.type}`;
      case 'maxLength':
        return `${location} exceeds maximum length of ${error.params.limit}`;
      case 'pattern':
        return `${location} does not match required pattern`;
      case 'minimum':
        return `${location} should be >= ${error.params.limit}`;
      case 'maximum':
        return `${location} should be <= ${error.params.limit}`;
      default:
        return `${location} ${error.message}`;
    }
  });
}

/**
 * Validates and provides detailed feedback on NFT metadata
 * 
 * @param {Object} metadata - The NFT metadata to validate
 * @returns {Object} - Object containing validation results and formatted errors
 */
function validateMetadata(metadata) {
  const result = validateNFTMetadata(metadata);
  return {
    isValid: result.valid,
    errors: formatErrors(result.errors),
    rawErrors: result.errors
  };
}

module.exports = {
  validateMetadata,
  validateNFTMetadata,
  formatErrors
}; 
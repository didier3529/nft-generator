const { validateMetadata } = require('./validateMetadata');

// Example valid NFT metadata
const validMetadata = {
  name: "My Awesome NFT",
  symbol: "MANFT",
  description: "This is a description of my awesome NFT on Solana",
  image: "ipfs://QmXzWS9x4GdXEiHZfyuXiPQqT4TAcS1mKbS2nXXvvSWv4Q",
  seller_fee_basis_points: 500, // 5%
  attributes: [
    {
      trait_type: "Background",
      value: "Blue"
    },
    {
      trait_type: "Eyes",
      value: "Green"
    }
  ],
  properties: {
    files: [
      {
        uri: "ipfs://QmXzWS9x4GdXEiHZfyuXiPQqT4TAcS1mKbS2nXXvvSWv4Q",
        type: "image/png"
      }
    ],
    category: "image",
    creators: [
      {
        address: "8zTCsABJntVsNqGYWEWcYXuNCGp88sSMPHkr4LjzeaJt",
        share: 100,
        verified: true
      }
    ]
  }
};

// Example invalid NFT metadata (missing required fields)
const invalidMetadata = {
  name: "Invalid NFT",
  symbol: "INVNFT",
  // Missing description and image
  seller_fee_basis_points: 15000, // Invalid: exceeds maximum
  attributes: [] // Empty but present
};

// Test the validator with valid metadata
console.log("Validating valid metadata:");
const validResult = validateMetadata(validMetadata);
console.log("Is valid:", validResult.isValid);
if (!validResult.isValid) {
  console.log("Errors:", validResult.errors);
}

console.log("\n--------------------------------------\n");

// Test the validator with invalid metadata
console.log("Validating invalid metadata:");
const invalidResult = validateMetadata(invalidMetadata);
console.log("Is valid:", invalidResult.isValid);
if (!invalidResult.isValid) {
  console.log("Errors:");
  invalidResult.errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });
}

/**
 * Example of how to use the validator in an export function
 * This would typically be used in an API endpoint or NFT minting function
 */
function processNFTMetadata(metadata) {
  // Validate the metadata first
  const validation = validateMetadata(metadata);
  
  if (!validation.isValid) {
    // Handle invalid metadata
    return {
      success: false,
      message: "Invalid NFT metadata",
      errors: validation.errors
    };
  }
  
  // If validation passes, proceed with minting or storing the NFT
  try {
    // Example logic - this would be replaced with actual minting/storage code
    console.log("NFT metadata is valid, proceeding with processing...");
    
    // Mock successful processing
    return {
      success: true,
      message: "NFT metadata validated and processed successfully",
      nftData: {
        ...metadata,
        processed: true,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return {
      success: false,
      message: "Error processing NFT metadata",
      error: error.message
    };
  }
}

// Example of using the export function
console.log("\n--------------------------------------\n");
console.log("Processing valid NFT metadata:");
console.log(JSON.stringify(processNFTMetadata(validMetadata), null, 2));

console.log("\n--------------------------------------\n");
console.log("Processing invalid NFT metadata:");
console.log(JSON.stringify(processNFTMetadata(invalidMetadata), null, 2)); 
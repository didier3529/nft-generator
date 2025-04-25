# Solana NFT Metadata Validator

A validation utility for Solana NFT metadata using JSON schema.

## Installation

```bash
cd schema
npm install
```

## Usage

### Basic Validation

```javascript
const { validateMetadata } = require('./validateMetadata');

// Your NFT metadata object
const metadata = {
  name: "My NFT",
  symbol: "MNFT",
  description: "Description of my NFT",
  image: "ipfs://Qm...",
  seller_fee_basis_points: 500,
  attributes: [
    {
      trait_type: "Background",
      value: "Blue"
    }
  ]
  // ... other properties
};

// Validate the metadata
const result = validateMetadata(metadata);

if (result.isValid) {
  console.log("Metadata is valid!");
} else {
  console.log("Validation errors:", result.errors);
}
```

### Validation in Export Functions

Implement validation in your export or API functions:

```javascript
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
  
  // If validation passes, proceed with processing
  try {
    // Your NFT processing logic here
    // ...
    
    return {
      success: true,
      message: "NFT processed successfully",
      data: { /* processed data */ }
    };
  } catch (error) {
    return {
      success: false,
      message: "Error processing NFT",
      error: error.message
    };
  }
}
```

### Command Line Validation

You can validate a JSON file directly from the command line:

```bash
npm run validate path/to/metadata.json
```

## Schema Details

The validation schema enforces the following requirements:

- **Required Fields**: 
  - `name` (string, max 32 chars)
  - `symbol` (string, max 10 chars)
  - `description` (string)
  - `image` (string, must be IPFS or HTTP URL)
  - `seller_fee_basis_points` (integer, 0-10000)
  - `attributes` (array of trait objects)

- **Optional Fields**:
  - `animation_url`
  - `external_url`
  - `collection`
  - `properties` (including files, creators, etc.)

See `nft-schema.json` for the complete schema definition.

## Example

Run the example to see validation in action:

```bash
npm test
```

## License

MIT 
/**
 * Converts a canvas element to a data URL
 * @param {HTMLCanvasElement} canvas - The canvas element to convert
 * @param {string} format - The image format (e.g., 'image/png', 'image/jpeg')
 * @param {number} quality - Image quality for JPEG (0-1)
 * @returns {string} The data URL of the image
 */
export const canvasToDataURL = (canvas, format = 'image/png', quality = 0.92) => {
  return canvas.toDataURL(format, quality);
};

/**
 * Converts a data URL to a Blob object
 * @param {string} dataURL - The data URL to convert
 * @returns {Blob} The Blob object
 */
export const dataURLToBlob = (dataURL) => {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

/**
 * Initiates a download of a Blob as a file
 * @param {Blob} blob - The Blob to download
 * @param {string} filename - The filename to use
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates metadata for an NFT based on selected traits and collection info
 * @param {Object} params - Parameters for metadata generation
 * @param {Object} params.selectedTraits - The selected traits for the NFT
 * @param {Object} params.metadata - Collection metadata (name, description, etc.)
 * @param {number} params.tokenId - Token ID for this NFT (optional)
 * @returns {Object} The generated metadata object
 */
export const generateNftMetadata = ({ 
  selectedTraits, 
  metadata = {}, 
  tokenId = 1 
}) => {
  // Default collection metadata
  const collectionMetadata = {
    name: metadata.name || 'NFT Collection',
    description: metadata.description || 'A collection of NFTs',
    symbol: metadata.symbol || 'NFT',
    baseUri: metadata.baseUri || '',
    externalLink: metadata.externalUrl || '',
    sellerFeeBasisPoints: metadata.sellerFeeBasisPoints || 0,
    ...metadata
  };
  
  // Generate NFT-specific metadata
  const nftName = `${collectionMetadata.name} #${tokenId}`;
  
  // Generate attributes from selected traits
  const attributes = [];
  Object.entries(selectedTraits).forEach(([category, trait]) => {
    if (trait) {
      attributes.push({
        trait_type: category,
        value: trait.name || trait.id || 'Unknown'
      });
    }
  });
  
  // Construct final metadata following NFT metadata standards
  return {
    name: nftName,
    description: collectionMetadata.description,
    image: `${collectionMetadata.baseUri}${tokenId}.png`, // Usually points to IPFS or hosted image
    external_url: collectionMetadata.externalLink,
    seller_fee_basis_points: collectionMetadata.sellerFeeBasisPoints,
    attributes,
    collection: {
      name: collectionMetadata.name,
      family: collectionMetadata.symbol
    }
  };
};

/**
 * Exports a single NFT as image and metadata files
 * @param {Object} params - Export parameters
 * @param {HTMLCanvasElement} params.canvas - The canvas element with the NFT image
 * @param {Object} params.selectedTraits - The selected traits for the NFT
 * @param {Object} params.metadata - Collection metadata
 * @param {number} params.tokenId - Token ID for this NFT (optional)
 * @param {string} params.imageFormat - Image format to use (optional)
 * @param {number} params.imageQuality - Image quality for JPEG (optional)
 */
export const exportSingleNft = ({
  canvas,
  selectedTraits,
  metadata = {},
  tokenId = 1,
  imageFormat = 'image/png',
  imageQuality = 0.92
}) => {
  try {
    // Generate image
    const dataURL = canvasToDataURL(canvas, imageFormat, imageQuality);
    const imageBlob = dataURLToBlob(dataURL);
    
    // Generate metadata
    const nftMetadata = generateNftMetadata({ selectedTraits, metadata, tokenId });
    const metadataBlob = new Blob(
      [JSON.stringify(nftMetadata, null, 2)], 
      { type: 'application/json' }
    );
    
    // Determine file extension
    const extension = imageFormat === 'image/jpeg' ? 'jpg' : 'png';
    
    // Download files
    downloadBlob(imageBlob, `${metadata.name || 'nft'}-${tokenId}.${extension}`);
    downloadBlob(metadataBlob, `${metadata.name || 'nft'}-${tokenId}.json`);
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting NFT:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to export NFT' 
    };
  }
}; 
/**
 * Batch export service for exporting the entire NFT collection
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateNftMetadata, canvasToDataURL, dataURLToBlob } from './exportService';

/**
 * Export the entire NFT collection as a ZIP archive
 * @param {Object} options - Export options
 * @param {Array} options.combinations - Array of trait combinations to export
 * @param {Object} options.metadata - Collection metadata
 * @param {Object} options.settings - Export settings
 * @param {Function} options.onProgress - Progress callback function
 * @param {Object} options.layers - All available layers
 * @returns {Promise} Promise that resolves when export is complete
 */
export const exportBatchNfts = async ({
  combinations,
  metadata,
  settings,
  onProgress = () => {},
  layers
}) => {
  try {
    const zip = new JSZip();
    const totalItems = combinations.length;
    
    if (totalItems === 0) {
      throw new Error('No NFTs to export');
    }
    
    // Create a folder for images
    const imagesFolder = zip.folder('images');
    // Create a folder for metadata
    const metadataFolder = zip.folder('metadata');
    
    // Determine image file extension
    const imageExtension = settings.imageFormat === 'image/jpeg' ? 'jpg' : 'png';
    
    // Use a modified collection name to use as filename (sanitized)
    const collectionName = (metadata.name || 'nft-collection')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    
    // Create a temporary canvas for rendering
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size - default to 1000x1000 if not specified
    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    
    // Generate each NFT
    for (let i = 0; i < totalItems; i++) {
      const combination = combinations[i];
      const tokenId = settings.baseTokenId + i;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sorted categories to ensure consistent layering
      const sortedCategories = Object.keys(combination).sort();
      
      // Load and draw each trait on the canvas
      for (const category of sortedCategories) {
        const trait = combination[category];
        if (trait && trait.imageUrl) {
          await drawTraitOnCanvas(ctx, trait.imageUrl, canvas.width, canvas.height);
        }
      }
      
      // Generate image data URL
      const dataURL = canvasToDataURL(
        canvas,
        settings.imageFormat,
        settings.imageFormat === 'image/jpeg' ? settings.imageQuality : undefined
      );
      
      // Convert data URL to Blob
      const imageBlob = dataURLToBlob(dataURL);
      
      // Add image to ZIP
      imagesFolder.file(`${tokenId}.${imageExtension}`, imageBlob, { binary: true });
      
      // Generate metadata
      const nftMetadata = generateNftMetadata({
        selectedTraits: combination,
        metadata,
        tokenId
      });
      
      // Update image URL to point to the correct location
      if (nftMetadata.image) {
        // Strip baseUri and just use the filename
        nftMetadata.image = `${tokenId}.${imageExtension}`;
      }
      
      // Add metadata to ZIP
      metadataFolder.file(
        `${tokenId}.json`,
        JSON.stringify(nftMetadata, null, 2)
      );
      
      // Update progress
      onProgress((i + 1) / totalItems * 100);
    }
    
    // Add collection metadata if requested
    if (settings.includeCollection) {
      const collectionMetadata = {
        name: metadata.name || 'NFT Collection',
        description: metadata.description || '',
        image: '', // Placeholder for collection image
        external_link: metadata.externalUrl || '',
        seller_fee_basis_points: metadata.sellerFeeBasisPoints || 0,
        fee_recipient: '',  // Placeholder for fee recipient address
        symbol: metadata.symbol || '',
        date: new Date().toISOString()
      };
      
      zip.file('collection.json', JSON.stringify(collectionMetadata, null, 2));
    }
    
    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6  // Balance between size and speed
      },
      onUpdate: (metadata) => {
        // This gets called with progress updates during ZIP generation
        if (metadata.percent) {
          onProgress(metadata.percent);
        }
      }
    });
    
    // Trigger download of the ZIP file
    saveAs(zipBlob, `${collectionName}.zip`);
    
    return { success: true };
  } catch (error) {
    console.error('Error in batch export:', error);
    throw error;
  }
};

/**
 * Draw a trait image on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} imageUrl - URL of the image to draw
 * @param {number} canvasWidth - Width of the canvas
 * @param {number} canvasHeight - Height of the canvas
 * @returns {Promise} Promise that resolves when image is drawn
 */
const drawTraitOnCanvas = (ctx, imageUrl, canvasWidth, canvasHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Calculate proportional scaling
      const scale = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      );
      
      // Calculate centered position
      const x = (canvasWidth - img.width * scale) / 2;
      const y = (canvasHeight - img.height * scale) / 2;
      
      // Draw the image
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      resolve();
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${imageUrl}`);
      // Continue without this image instead of failing the export
      resolve();
    };
    
    img.src = imageUrl;
  });
}; 
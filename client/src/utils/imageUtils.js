/**
 * Loads an image from a URL and returns a Promise
 * @param {string} url - The URL of the image to load
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the loaded image
 */
const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
};

/**
 * Composes multiple image layers into a single image
 * @param {string[]} layerURLs - Array of image URLs in order (bottom to top)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Promise<string>} A promise that resolves with the composed image data URL
 */
export const composeLayers = async (layerURLs, width = 500, height = 500) => {
    try {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Clear canvas with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Load and draw each image
        for (const url of layerURLs) {
            try {
                const img = await loadImage(url);
                ctx.drawImage(img, 0, 0, width, height);
            } catch (error) {
                console.error(`Error loading layer: ${url}`, error);
                // Continue with other layers if one fails
            }
        }

        // Convert canvas to data URL
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('Error composing layers:', error);
        return null;
    }
};

/**
 * Gets a list of available layer images from the public directory
 * @returns {Promise<Array>} Array of layer objects with name and url
 */
export const getAvailableLayers = async () => {
    // For now, return hardcoded layer list
    // In a real app, this might come from an API or directory listing
    return [
        { id: 'background', name: 'Background', url: '/layers/background.png' },
        { id: 'body', name: 'Body', url: '/layers/body.png' },
        { id: 'eyes', name: 'Eyes', url: '/layers/eyes.png' },
        { id: 'mouth', name: 'Mouth', url: '/layers/mouth.png' },
        { id: 'hat', name: 'Hat', url: '/layers/hat.png' }
    ];
}; 
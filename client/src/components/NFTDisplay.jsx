import React, { useEffect, useState } from 'react';
import { composeLayers } from '../utils/imageUtils';

const NFTDisplay = ({ layers }) => {
    const [composedImage, setComposedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const updateComposedImage = async () => {
            if (!layers || layers.length === 0) {
                setComposedImage(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Get URLs from layer objects
                const layerURLs = layers.map(layer => layer.url);
                const composedImageUrl = await composeLayers(layerURLs);
                
                if (composedImageUrl) {
                    setComposedImage(composedImageUrl);
                } else {
                    setError('Failed to compose image layers');
                }
            } catch (err) {
                setError('Error composing layers: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        updateComposedImage();
    }, [layers]);

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4">NFT Preview</h2>
            <div className="relative aspect-square w-full max-w-md mx-auto">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 text-red-500">
                        {error}
                    </div>
                )}
                {composedImage && (
                    <img
                        src={composedImage}
                        alt="Composed NFT"
                        className="w-full h-full object-contain"
                    />
                )}
            </div>
        </div>
    );
};

export default NFTDisplay; 
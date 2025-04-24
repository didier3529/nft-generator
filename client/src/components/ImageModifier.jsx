import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageModifier = ({ imageUrl }) => {
    const [modifiedImageUrl, setModifiedImageUrl] = useState(imageUrl);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [greyscale, setGreyscale] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setModifiedImageUrl(imageUrl);
    }, [imageUrl]);

    const handleModifyImage = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/image/modify', {
                imageUrl: imageUrl,
                brightness: brightness,
                contrast: contrast,
                greyscale: greyscale
            });
            setModifiedImageUrl(response.data.modifiedImageUrl);
        } catch (error) {
            console.error("Error modifying image:", error);
            alert("Failed to modify image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Image Modifier</h2>
            <div className="space-y-4">
                <div className="flex flex-col">
                    <label className="mb-2 font-medium">Brightness:</label>
                    <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.1"
                        value={brightness}
                        onChange={(e) => setBrightness(e.target.value)}
                        className="w-full"
                    />
                    <span className="text-sm text-gray-600">{brightness}</span>
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 font-medium">Contrast:</label>
                    <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.1"
                        value={contrast}
                        onChange={(e) => setContrast(e.target.value)}
                        className="w-full"
                    />
                    <span className="text-sm text-gray-600">{contrast}</span>
                </div>
                <div className="flex items-center">
                    <label className="mr-2 font-medium">Greyscale:</label>
                    <input
                        type="checkbox"
                        checked={greyscale}
                        onChange={(e) => setGreyscale(e.target.checked)}
                        className="w-4 h-4"
                    />
                </div>
                <button
                    onClick={handleModifyImage}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? "Modifying..." : "Apply Changes"}
                </button>
            </div>
            {modifiedImageUrl && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Modified Image:</h3>
                    <img
                        src={modifiedImageUrl}
                        alt="Modified"
                        className="max-w-full h-auto rounded-lg shadow-sm"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageModifier; 
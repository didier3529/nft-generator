'use client';

import { useEffect, useRef } from 'react';
import { useNftStore } from '@/lib/store/useNftStore';

export default function NftCanvas() {
  const { 
    layers, 
    resolution, 
    generatePreview, 
    previewUrl 
  } = useNftStore();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Get the dimensions based on the selected resolution
  const getDimensions = () => {
    const [width, height] = resolution.split('x').map(Number);
    return { width, height };
  };
  
  const { width, height } = getDimensions();
  
  // Regenerate preview when layers or resolution changes
  useEffect(() => {
    const generateCanvasPreview = async () => {
      await generatePreview();
    };
    
    generateCanvasPreview();
  }, [layers, resolution, generatePreview]);
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg"
        style={{ width: width / 2, height: height / 2 }}
        ref={canvasRef}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="NFT Preview" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500 dark:text-gray-400">
            Loading preview...
          </div>
        )}
        
        {/* Grid overlay for transparency */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 bg-grid-pattern"
          style={{ 
            backgroundSize: '20px 20px',
            backgroundImage: 'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)'
          }}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Resolution: {resolution}
      </div>
    </div>
  );
} 
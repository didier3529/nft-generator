import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Box, IconButton, Paper, Slider, Typography, Divider } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLayerStore } from '../../stores';
import ExportButton from './ExportButton';
import './nftPreview.css';

// Flag to control whether to use server paths or preview data URLs
const USE_PREVIEW_DATA = true;

const NftCanvas = ({ width = 500, height = 500 }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canvasUpdated, setCanvasUpdated] = useState(false);

  // Get selected layers from store using memoization with strict equality comparison
  const selectedLayers = useLayerStore(useCallback((state) => {
    return state.getSelectedLayers();
  }, []), (prev, next) => {
    // Deep equality check for selectedLayers objects
    if (Object.keys(prev).length !== Object.keys(next).length) return false;
    
    for (const key of Object.keys(prev)) {
      if (!next[key] || prev[key].id !== next[key].id) return false;
    }
    
    return true;
  });
  
  // Create a stable reference to selectedLayers for use in drawCanvas
  const selectedLayersRef = useRef(selectedLayers);
  
  // Update the ref when selectedLayers changes
  useEffect(() => {
    selectedLayersRef.current = selectedLayers;
  }, [selectedLayers]);
  
  // Load an image and return a Promise - this doesn't need to change with render cycles
  const loadImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      // Skip loading if URL is empty
      if (!url) {
        resolve(null);
        return;
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });
  }, []);

  // Draw the canvas with all layers - memoize with stable dependencies
  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with a transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations for zoom and pan
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Draw white background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);
      
      // Draw grid pattern for transparency
      const gridSize = 10;
      ctx.fillStyle = '#ffffff';
      for (let x = 0; x < canvas.width / scale; x += gridSize * 2) {
        for (let y = 0; y < canvas.height / scale; y += gridSize * 2) {
          ctx.fillRect(x, y, gridSize, gridSize);
          ctx.fillRect(x + gridSize, y + gridSize, gridSize, gridSize);
        }
      }

      // Access the current selected layers from the ref to break dependency cycle
      const layersToRender = selectedLayersRef.current;
      
      // Get selected layers for each category
      const layerUrls = [];
      
      // Get the image URLs for each selected layer
      Object.keys(layersToRender).forEach(category => {
        const layer = layersToRender[category];
        if (layer) {
          // Prefer preview data URLs or fall back to server path
          if (USE_PREVIEW_DATA && layer.preview) {
            layerUrls.push(layer.preview);
          } else if (layer.path) {
            // Build server URL if needed
            const serverUrl = `http://localhost:5000${layer.path}`;
            layerUrls.push(serverUrl);
          }
        }
      });
      
      // Draw each layer
      for (const url of layerUrls) {
        try {
          const img = await loadImage(url);
          if (!img) continue;
          
          // Draw the image centered and scaled to fit the canvas
          const aspectRatio = img.width / img.height;
          const drawWidth = canvas.width / scale;
          const drawHeight = canvas.height / scale;
          
          // If the image is wider than tall, fit to width, else fit to height
          let newWidth, newHeight;
          if (aspectRatio > 1) {
            newWidth = drawWidth;
            newHeight = drawWidth / aspectRatio;
          } else {
            newHeight = drawHeight;
            newWidth = drawHeight * aspectRatio;
          }
          
          // Center the image
          const x = (drawWidth - newWidth) / 2;
          const y = (drawHeight - newHeight) / 2;
          
          ctx.drawImage(img, x, y, newWidth, newHeight);
        } catch (err) {
          console.error('Error loading layer:', err);
        }
      }
      
      setCanvasUpdated(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error drawing canvas:', err);
      setError('Error drawing canvas: ' + err.message);
      setIsLoading(false);
    }
    
    ctx.restore();
  }, [scale, offsetX, offsetY, loadImage]); // Removed selectedLayers from dependencies, using ref instead

  // Initialize canvas and add event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      requestAnimationFrame(() => drawCanvas());
    };
    
    // Draw initial canvas
    requestAnimationFrame(() => drawCanvas());
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [drawCanvas]);

  // Re-render the canvas when selectedLayers changes
  useEffect(() => {
    console.log('[NftCanvas] selectedLayers changed, triggering redraw');
    requestAnimationFrame(() => drawCanvas());
  }, [selectedLayers, drawCanvas]);

  // Handle mouse events for panning
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    setOffsetX(prev => prev + dx);
    setOffsetY(prev => prev + dy);
    setStartX(e.clientX);
    setStartY(e.clientY);
  }, [isDragging, startX, startY]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    
    setOffsetX(prev => prev + dx);
    setOffsetY(prev => prev + dy);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  }, [isDragging, startX, startY]);

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle zoom
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY);
    const factor = delta > 0 ? 1.1 : 0.9;
    setScale(prev => Math.max(0.5, Math.min(5, prev * factor)));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  // Removed the problematic useEffect that was causing infinite renders
  // by duplicating the drawCanvas call

  const hasLayers = Object.keys(selectedLayers).length > 0;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          NFT Preview
        </Typography>
        <ExportButton canvasRef={canvasRef} />
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1',
            maxWidth: width,
            maxHeight: height,
            margin: '0 auto',
            bgcolor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: 1,
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none', // Prevent browser handling of touch events
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
              width: '100%', 
              height: '100%',
              objectFit: 'contain'
            }}
          />
          
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #f0f0f0', borderTop: '3px solid #3f51b5', animation: 'spin 1s linear infinite' }} />
            </Box>
          )}
          
          {error && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 233, 233, 0.8)',
                zIndex: 2,
                p: 2
              }}
            >
              <Typography color="error" align="center">
                {error}
              </Typography>
            </Box>
          )}
          
          {!hasLayers && !isLoading && !error && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(245, 245, 245, 0.8)',
                zIndex: 2,
              }}
            >
              <Typography color="text.secondary" align="center" sx={{ p: 2 }}>
                Select traits from the layer manager to preview your NFT
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
          <IconButton onClick={handleZoomOut} disabled={scale <= 0.5}>
            <ZoomOutIcon />
          </IconButton>
          
          <Slider
            sx={{ mx: 2, width: '150px' }}
            min={0.5}
            max={5}
            step={0.1}
            value={scale}
            onChange={(_, value) => setScale(value)}
            aria-label="Zoom"
          />
          
          <IconButton onClick={handleZoomIn} disabled={scale >= 5}>
            <ZoomInIcon />
          </IconButton>
          
          <IconButton onClick={handleReset} sx={{ ml: 1 }}>
            <RestartAltIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default NftCanvas; 
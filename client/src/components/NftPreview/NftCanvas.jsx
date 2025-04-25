import React, { useRef, useEffect, useState, useCallback, useMemo, forwardRef, useLayoutEffect } from 'react';
import { Box, IconButton, Paper, Slider, Typography, Divider, Snackbar, Alert } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLayerStore } from '../../stores';
import ExportButton from './ExportButton';
import './nftPreview.css';
import { debounce } from 'lodash'; // Make sure lodash is installed

// Flag to control whether to use server paths or preview data URLs
const USE_PREVIEW_DATA = true;

// Modified to use forwardRef to allow parent components to access the canvas
const NftCanvas = forwardRef(({ width = 500, height = 500 }, ref) => {
  const internalCanvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canvasUpdated, setCanvasUpdated] = useState(false);
  const [saveNotification, setSaveNotification] = useState({ open: false, message: 'Saved!', severity: 'success' });

  // Store previous render timestamp to throttle updates
  const lastRenderTimestamp = useRef(0);
  // Animation frame request ID for cleanup
  const animationFrameId = useRef(null);
  // Flag for pending updates
  const hasPendingUpdate = useRef(false);

  // Use the external ref if provided, otherwise use the internal ref
  const canvasRef = ref || internalCanvasRef;

  // Get selected layers from store using selector function with shallow equality
  const selectedLayers = useLayerStore(
    state => state.getSelectedLayers(),
    (prev, next) => {
      // Return true if they should be considered equal (preventing re-render)
      if (Object.keys(prev).length !== Object.keys(next).length) return false;
      
      for (const key of Object.keys(prev)) {
        if (!next[key] || prev[key].id !== next[key].id) return false;
      }
      
      return true;
    }
  );
  
  // Create a stable reference to selectedLayers for use in drawCanvas
  const selectedLayersRef = useRef(selectedLayers);
  
  // Update the ref when selectedLayers changes
  useEffect(() => {
    selectedLayersRef.current = selectedLayers;
    // Schedule a redraw when layers change
    requestCanvasUpdate();
  }, [selectedLayers]);
  
  // Load an image and return a Promise - memoized to maintain reference stability
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

  // Throttle canvas updates to prevent too many redraws
  const requestCanvasUpdate = useCallback(() => {
    hasPendingUpdate.current = true;
    
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(() => {
        const now = performance.now();
        // Only redraw if sufficient time has passed (throttling)
        if (now - lastRenderTimestamp.current > 50 || hasPendingUpdate.current) {
          drawCanvas();
          lastRenderTimestamp.current = now;
          hasPendingUpdate.current = false;
        }
        animationFrameId.current = null;
        
        // If updates are still needed, request another frame
        if (hasPendingUpdate.current) {
          requestCanvasUpdate();
        }
      });
    }
  }, []);

  // Draw the canvas with all layers - memoized with stable dependencies
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
    } catch (err) {
      console.error('Error drawing canvas:', err);
      setError('Error drawing canvas: ' + err.message);
    } finally {
      setIsLoading(false);
    }
    
    ctx.restore();
  }, [scale, offsetX, offsetY, loadImage]);

  // Initialize canvas and add event listeners using useLayoutEffect for smoother rendering
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initial canvas draw 
    requestCanvasUpdate();
    
    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [requestCanvasUpdate]);

  // Memoized resize handler with proper cleanup
  useEffect(() => {
    const handleResize = debounce(() => {
      requestCanvasUpdate();
    }, 100); // Debounce window resize events
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel(); // Cancel any pending debounce
    };
  }, [requestCanvasUpdate]);

  // Update canvas when transform changes
  useEffect(() => {
    requestCanvasUpdate();
  }, [scale, offsetX, offsetY, requestCanvasUpdate]);

  // Handle mouse events for panning - memoized to prevent recreation
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    setOffsetX(prev => prev + dx);
    setOffsetY(prev => prev + dy);
    setStartX(e.clientX);
    setStartY(e.clientY);
  }, [isDragging, startX, startY]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch events for mobile - memoized to prevent recreation
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    
    setOffsetX(prev => prev + dx);
    setOffsetY(prev => prev + dy);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  }, [isDragging, startX, startY]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle zoom actions - memoize to prevent recreation
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  }, []);

  const handleZoomChange = useCallback((e, newValue) => {
    setScale(newValue);
  }, []);

  // Register mouse/touch event listeners with proper cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  ]);

  // Memoize UI components to prevent re-creation
  const zoomControls = useMemo(() => (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <IconButton onClick={handleZoomOut} size="small">
        <ZoomOutIcon />
      </IconButton>
      
      <Slider
        value={scale}
        min={0.5}
        max={5}
        step={0.1}
        onChange={handleZoomChange}
        sx={{ mx: 2, width: '100px' }}
      />
      
      <IconButton onClick={handleZoomIn} size="small">
        <ZoomInIcon />
      </IconButton>
      
      <IconButton onClick={handleReset} size="small" sx={{ ml: 1 }}>
        <RestartAltIcon />
      </IconButton>
    </Box>
  ), [scale, handleZoomChange, handleZoomIn, handleZoomOut, handleReset]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl key is pressed along with S or E
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault(); // Prevent browser's save dialog
          // Save functionality
          handleSave();
        } else if (e.key === 'e') {
          e.preventDefault(); // Prevent default browser behavior
          // Export functionality - simulate click on export button
          const exportButton = document.querySelector('button[data-export-button="true"]');
          if (exportButton) exportButton.click();
        }
      }
    };

    // Add event listener for keyboard shortcuts
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Save functionality
  const handleSave = () => {
    // In a real implementation, this would save the current state
    // For now, just show a success notification
    
    // Check if we have layers to save
    const hasLayers = Object.keys(selectedLayers).length > 0;
    
    if (hasLayers) {
      // Show save notification
      setSaveNotification({ 
        open: true, 
        message: 'Saved!', 
        severity: 'success' 
      });
      
      // In a real implementation, you would call a save function here
      console.log('Canvas state saved');
    } else {
      // Show error if no layers to save
      setSaveNotification({ 
        open: true, 
        message: 'Nothing to save! Add layers first.', 
        severity: 'warning' 
      });
    }
  };

  const handleNotificationClose = () => {
    setSaveNotification({ ...saveNotification, open: false });
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        NFT Preview
      </Typography>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 1, 
          mb: 2,
          position: 'relative',
          width: width,
          height: height,
          margin: '0 auto',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        {isLoading && (
          <div className="canvas-loading-overlay">
            <div className="canvas-loading-spinner"></div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
        />
        
        {error && (
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 10, 
              left: 10, 
              right: 10,
              p: 1,
              bgcolor: 'error.light',
              color: 'error.contrastText',
              borderRadius: 1
            }}
          >
            {error}
          </Box>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ExportButton canvasRef={canvasRef} />
        {zoomControls}
      </Box>
      
      {/* Toast notification for save */}
      <Snackbar
        open={saveNotification.open}
        autoHideDuration={3000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={saveNotification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {saveNotification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
});

// Add displayName for better debugging
NftCanvas.displayName = 'NftCanvas';

export default React.memo(NftCanvas); 
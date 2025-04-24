import React, { createContext, useContext, useState, useCallback } from 'react';
import layerService from '../services/layerService';

const LayerContext = createContext();

export function LayerProvider({ children }) {
  const [layers, setLayers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadLayer = useCallback(async (file, category) => {
    try {
      setLoading(true);
      setError(null);
      const newLayer = await layerService.uploadLayer(file, category);
      setLayers(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), newLayer]
      }));
      return newLayer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLayers = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);
      const layerList = await layerService.getLayers(category);
      setLayers(prev => ({
        ...prev,
        [category]: layerList
      }));
      return layerList;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLayer = useCallback(async (category, filename) => {
    try {
      setLoading(true);
      setError(null);
      await layerService.deleteLayer(category, filename);
      setLayers(prev => ({
        ...prev,
        [category]: prev[category].filter(layer => layer.name !== filename)
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    layers,
    loading,
    error,
    uploadLayer,
    getLayers,
    deleteLayer
  };

  return (
    <LayerContext.Provider value={value}>
      {children}
    </LayerContext.Provider>
  );
}

export function useLayer() {
  const context = useContext(LayerContext);
  if (!context) {
    throw new Error('useLayer must be used within a LayerProvider');
  }
  return context;
} 
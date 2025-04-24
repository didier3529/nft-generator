import { create } from 'zustand';
import layerService from '../services/layerService';

// Keep track of fetch status for categories to prevent duplicate calls
const fetchedCategories = new Set();

// Cache for the getSelectedLayers selector to prevent creating new objects on each call
let selectedLayersCache = {
  selectedTraits: {},
  layers: {},
  result: {}
};

const useLayerStore = create((set, get) => ({
  // State
  layers: {}, // Organize layers by category
  selectedTraits: {}, // Selected trait for each category
  isLoading: false,
  error: null,
  
  // Actions for layers
  uploadLayer: async (file, category) => {
    try {
      set({ isLoading: true, error: null });
      const newLayer = await layerService.uploadLayer(file, category);
      
      set((state) => ({
        layers: {
          ...state.layers,
          [category]: [...(state.layers[category] || []), newLayer]
        },
        isLoading: false
      }));
      
      return newLayer;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Error uploading layer' });
      throw error;
    }
  },
  
  getLayers: async (category) => {
    // Skip if already fetched this category and it exists in the store
    const currentLayers = get().layers;
    if (fetchedCategories.has(category) && currentLayers[category]) {
      return currentLayers[category];
    }
    
    try {
      set({ isLoading: true, error: null });
      const layerList = await layerService.getLayers(category);
      
      // Mark this category as fetched
      fetchedCategories.add(category);
      
      set((state) => ({
        layers: {
          ...state.layers,
          [category]: layerList
        },
        isLoading: false
      }));
      
      return layerList;
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Error fetching layers' });
      throw error;
    }
  },
  
  deleteLayer: async (category, filename) => {
    try {
      set({ isLoading: true, error: null });
      await layerService.deleteLayer(category, filename);
      
      set((state) => ({
        layers: {
          ...state.layers,
          [category]: (state.layers[category] || []).filter(layer => layer.name !== filename)
        },
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Error deleting layer' });
      throw error;
    }
  },
  
  reorderLayers: (category, startIndex, endIndex) => {
    // Safely handle invalid indices
    if (startIndex < 0 || endIndex < 0) return;
    
    const currentLayers = get().layers[category] || [];
    if (startIndex >= currentLayers.length || endIndex >= currentLayers.length) return;
    
    const layerList = [...currentLayers];
    const [removed] = layerList.splice(startIndex, 1);
    layerList.splice(endIndex, 0, removed);
    
    set((state) => ({
      layers: {
        ...state.layers,
        [category]: layerList
      }
    }));
  },
  
  // Clear the fetch status cache - useful for testing/reloading
  clearFetchCache: () => {
    fetchedCategories.clear();
  },
  
  // Actions for trait selection
  selectTrait: (category, traitId) => {
    // Safely handle empty or null values
    if (!category) return;
    
    if (!traitId) {
      // If traitId is empty, remove the category from selection
      set((state) => {
        const newTraits = { ...state.selectedTraits };
        delete newTraits[category];
        return { selectedTraits: newTraits };
      });
    } else {
      set((state) => ({
        selectedTraits: {
          ...state.selectedTraits,
          [category]: traitId
        }
      }));
    }
    
    // Reset selected layers cache to force recalculation
    selectedLayersCache = {
      selectedTraits: {},
      layers: {},
      result: {}
    };
  },
  
  randomizeTraits: () => {
    const { layers } = get();
    const randomTraits = {};
    
    Object.keys(layers).forEach(category => {
      if (layers[category] && layers[category].length > 0) {
        const randomIndex = Math.floor(Math.random() * layers[category].length);
        const layer = layers[category][randomIndex];
        if (layer && (layer.id || layer.name)) {
          randomTraits[category] = layer.id || layer.name;
        }
      }
    });
    
    set({ selectedTraits: randomTraits });
    
    // Reset selected layers cache to force recalculation
    selectedLayersCache = {
      selectedTraits: {},
      layers: {},
      result: {}
    };
  },
  
  resetTraitSelection: () => {
    set({ selectedTraits: {} });
    
    // Reset selected layers cache to force recalculation
    selectedLayersCache = {
      selectedTraits: {},
      layers: {},
      result: {}
    };
  },
  
  // Selectors
  getLayersByCategory: (category) => {
    return get().layers[category] || [];
  },
  
  getSelectedLayers: () => {
    const { layers, selectedTraits } = get();
    
    // Check if we can use the cached result by comparing references
    const selectedTraitsChanged = selectedLayersCache.selectedTraits !== selectedTraits;
    const layersChanged = selectedLayersCache.layers !== layers;
    
    // If nothing changed, return the cached result
    if (!selectedTraitsChanged && !layersChanged) {
      return selectedLayersCache.result;
    }
    
    // Calculate new result
    const selectedLayers = {};
    
    Object.keys(selectedTraits).forEach(category => {
      const traitId = selectedTraits[category];
      if (!traitId || !layers[category]) return;
      
      // Look for layers by id or name
      const layer = layers[category].find(l => 
        (l.id && l.id === traitId) || (l.name && l.name === traitId)
      );
      
      if (layer) {
        selectedLayers[category] = layer;
      }
    });
    
    // Update cache
    selectedLayersCache = {
      selectedTraits,
      layers,
      result: selectedLayers
    };
    
    return selectedLayers;
  }
}));

export default useLayerStore; 
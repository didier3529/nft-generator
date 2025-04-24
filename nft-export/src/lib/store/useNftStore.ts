import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileType = 'image/png' | 'image/gif' | 'video/webm';
export type TabType = 'backgrounds' | 'characters' | 'accessories' | 'effects';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';
export type Resolution = '500x500' | '1000x1000' | '2000x2000';
export type ExportFormat = 'png' | 'svg' | 'gif';

export interface Layer {
  id: string;
  name: string;
  file: File;
  url: string;
  visible: boolean;
  position: { x: number; y: number };
  tab: TabType;
  order: number;
  blendMode: BlendMode;
}

export interface TraitMetadata {
  trait_type: string;
  value: string;
  rarity?: number;
}

export interface NftMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: TraitMetadata[];
  royalty?: number;
  ipfs_cid?: string;
}

interface NftState {
  layers: Layer[];
  activeTab: TabType;
  resolution: Resolution;
  metadata: NftMetadata;
  previewUrl: string | null;
  exportFormat: ExportFormat;
  royaltyPercentage: number;
  isProcessing: boolean;
  projectName: string;
  projectVersion: number;
  savedStates: Array<{ name: string; timestamp: number; snapshot: string }>;
  
  // Actions
  addLayer: (file: File, tab: TabType) => Promise<void>;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  toggleLayerVisibility: (id: string) => void;
  setLayerOrder: (ids: string[]) => void;
  moveLayer: (id: string, direction: 'up' | 'down') => void;
  updateLayerPosition: (id: string, position: { x: number; y: number }) => void;
  updateLayerBlendMode: (id: string, blendMode: BlendMode) => void;
  updateMetadata: (updates: Partial<NftMetadata>) => void;
  generatePreview: () => Promise<string>;
  clearLayers: () => void;
  setActiveTab: (tab: TabType) => void;
  setResolution: (resolution: Resolution) => void;
  setExportFormat: (format: ExportFormat) => void;
  saveProjectState: (name: string) => void;
  loadProjectState: (timestamp: number) => void;
  setRoyaltyPercentage: (percentage: number) => void;
  setProjectName: (name: string) => void;
  downloadAsset: (format: ExportFormat) => Promise<void>;
}

export const useNftStore = create<NftState>()(
  persist(
    (set, get) => ({
      layers: [],
      activeTab: 'backgrounds',
      resolution: '1000x1000',
      previewUrl: null,
      exportFormat: 'png',
      royaltyPercentage: 5,
      isProcessing: false,
      projectName: 'Untitled NFT Project',
      projectVersion: 1,
      savedStates: [],
      metadata: {
        name: '',
        description: '',
        image: '',
        attributes: [],
      },

      // Actions
      addLayer: async (file: File, tab: TabType) => {
        const url = URL.createObjectURL(file);
        const id = `layer_${Date.now()}`;
        const order = get().layers.filter(l => l.tab === tab).length;
        
        set(state => ({
          layers: [
            ...state.layers,
            {
              id,
              name: file.name.split('.')[0],
              file,
              url,
              visible: true,
              position: { x: 0, y: 0 },
              tab,
              order,
              blendMode: 'normal',
            },
          ],
        }));
        
        // Generate a new preview after adding a layer
        get().generatePreview();
      },
      
      removeLayer: (id: string) => {
        const { layers } = get();
        const layerToRemove = layers.find(l => l.id === id);
        
        if (layerToRemove) {
          // Revoke the object URL to prevent memory leaks
          URL.revokeObjectURL(layerToRemove.url);
          
          set(state => ({
            layers: state.layers
              .filter(l => l.id !== id)
              .map(l => {
                // Adjust order for items in the same tab with a higher order
                if (l.tab === layerToRemove.tab && l.order > layerToRemove.order) {
                  return { ...l, order: l.order - 1 };
                }
                return l;
              }),
          }));
          
          // Update preview after removing a layer
          get().generatePreview();
        }
      },
      
      updateLayer: (id: string, updates: Partial<Layer>) => {
        set(state => ({
          layers: state.layers.map(layer => 
            layer.id === id ? { ...layer, ...updates } : layer
          ),
        }));
        
        // Update preview if visibility or position changed
        if ('visible' in updates || 'position' in updates || 'blendMode' in updates) {
          get().generatePreview();
        }
      },
      
      toggleLayerVisibility: (id: string) => {
        set(state => ({
          layers: state.layers.map(layer => 
            layer.id === id ? { ...layer, visible: !layer.visible } : layer
          ),
        }));
        
        // Update preview after toggling visibility
        get().generatePreview();
      },
      
      setLayerOrder: (ids: string[]) => {
        const { layers } = get();
        const currentTab = get().activeTab;
        
        // Only reorder layers in the current tab
        const tabLayers = layers.filter(l => l.tab === currentTab);
        const otherLayers = layers.filter(l => l.tab !== currentTab);
        
        // Create a map of id to new order
        const orderMap = ids.reduce((map, id, index) => {
          map[id] = index;
          return map;
        }, {} as Record<string, number>);
        
        // Update orders based on the provided array of ids
        const updatedTabLayers = tabLayers
          .map(layer => ({
            ...layer,
            order: orderMap[layer.id] !== undefined ? orderMap[layer.id] : layer.order,
          }))
          .sort((a, b) => a.order - b.order);
        
        set({ layers: [...otherLayers, ...updatedTabLayers] });
        
        // Update preview after reordering
        get().generatePreview();
      },
      
      moveLayer: (id: string, direction: 'up' | 'down') => {
        const { layers } = get();
        const layerIndex = layers.findIndex(l => l.id === id);
        
        if (layerIndex === -1) return;
        
        const layer = layers[layerIndex];
        const tabLayers = layers.filter(l => l.tab === layer.tab).sort((a, b) => a.order - b.order);
        const layerTabIndex = tabLayers.findIndex(l => l.id === id);
        
        // Cannot move if already at top/bottom
        if (
          (direction === 'up' && layerTabIndex === 0) ||
          (direction === 'down' && layerTabIndex === tabLayers.length - 1)
        ) {
          return;
        }
        
        // Swap orders with adjacent layer
        const adjacentIndex = direction === 'up' ? layerTabIndex - 1 : layerTabIndex + 1;
        const adjacentLayer = tabLayers[adjacentIndex];
        
        const layerOrder = layer.order;
        const adjacentOrder = adjacentLayer.order;
        
        set(state => ({
          layers: state.layers.map(l => {
            if (l.id === layer.id) {
              return { ...l, order: adjacentOrder };
            }
            if (l.id === adjacentLayer.id) {
              return { ...l, order: layerOrder };
            }
            return l;
          }),
        }));
        
        // Update preview after moving layer
        get().generatePreview();
      },
      
      updateLayerPosition: (id: string, position: { x: number; y: number }) => {
        set(state => ({
          layers: state.layers.map(layer => 
            layer.id === id ? { ...layer, position } : layer
          ),
        }));
        
        // Update preview after changing position
        get().generatePreview();
      },
      
      updateLayerBlendMode: (id: string, blendMode: BlendMode) => {
        set(state => ({
          layers: state.layers.map(layer => 
            layer.id === id ? { ...layer, blendMode } : layer
          ),
        }));
        
        // Update preview after changing blend mode
        get().generatePreview();
      },
      
      updateMetadata: (updates: Partial<NftMetadata>) => {
        set(state => ({
          metadata: { ...state.metadata, ...updates },
        }));
      },
      
      generatePreview: async () => {
        set({ isProcessing: true });
        
        try {
          // In a real implementation, we would:
          // 1. Create a canvas
          // 2. Load all visible layer images
          // 3. Render them in order with appropriate blend modes
          // 4. Convert the canvas to a data URL
          
          // For this example, we'll just create a placeholder
          // In a real app this would use Konva.js or similar
          const previewUrl = await new Promise<string>(resolve => {
            // Simulate processing time
            setTimeout(() => {
              // In a real implementation this would be the data URL from canvas
              resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
            }, 500);
          });
          
          set({ previewUrl, isProcessing: false });
          return previewUrl;
        } catch (error) {
          console.error('Error generating preview:', error);
          set({ isProcessing: false });
          return '';
        }
      },
      
      clearLayers: () => {
        // Revoke all object URLs to prevent memory leaks
        get().layers.forEach(layer => {
          URL.revokeObjectURL(layer.url);
        });
        
        set({ layers: [], previewUrl: null });
      },
      
      setActiveTab: (tab: TabType) => {
        set({ activeTab: tab });
      },
      
      setResolution: (resolution: Resolution) => {
        set({ resolution });
        // Update preview with new resolution
        get().generatePreview();
      },
      
      setExportFormat: (format: ExportFormat) => {
        set({ exportFormat: format });
      },
      
      saveProjectState: (name: string) => {
        const state = get();
        const snapshot = JSON.stringify({
          layers: state.layers.map(layer => ({
            ...layer,
            // Can't serialize File object, so we exclude it
            file: null,
            // Store relative position and other essential data
            position: layer.position,
            visible: layer.visible,
            tab: layer.tab,
            order: layer.order,
            blendMode: layer.blendMode,
          })),
          metadata: state.metadata,
          resolution: state.resolution,
          projectName: state.projectName,
          projectVersion: state.projectVersion,
        });
        
        set(state => ({
          savedStates: [
            ...state.savedStates,
            { name, timestamp: Date.now(), snapshot },
          ],
          projectVersion: state.projectVersion + 1,
        }));
      },
      
      loadProjectState: (timestamp: number) => {
        const savedState = get().savedStates.find(state => state.timestamp === timestamp);
        
        if (!savedState) return;
        
        try {
          const parsedState = JSON.parse(savedState.snapshot);
          
          // We can't restore File objects, so we maintain current layer files
          // but apply the saved positions, visibility, etc.
          const currentLayers = get().layers;
          
          set({
            ...parsedState,
            layers: currentLayers.map(layer => {
              const savedLayer = parsedState.layers.find((l: any) => l.id === layer.id);
              if (savedLayer) {
                return {
                  ...layer,
                  position: savedLayer.position,
                  visible: savedLayer.visible,
                  tab: savedLayer.tab,
                  order: savedLayer.order,
                  blendMode: savedLayer.blendMode,
                };
              }
              return layer;
            }),
          });
          
          // Update preview after loading state
          get().generatePreview();
        } catch (error) {
          console.error('Error loading project state:', error);
        }
      },
      
      setRoyaltyPercentage: (percentage: number) => {
        const validPercentage = Math.min(Math.max(percentage, 0), 15);
        set(state => ({
          royaltyPercentage: validPercentage,
          metadata: {
            ...state.metadata,
            royalty: validPercentage,
          },
        }));
      },
      
      setProjectName: (name: string) => {
        set({
          projectName: name,
          metadata: {
            ...get().metadata,
            name,
          },
        });
      },
      
      downloadAsset: async (format: ExportFormat) => {
        set({ isProcessing: true });
        
        try {
          // In a real implementation, this would:
          // 1. Render the canvas at the selected resolution
          // 2. Convert to the requested format
          // 3. Trigger download using file-saver
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isProcessing: false });
        } catch (error) {
          console.error('Error downloading asset:', error);
          set({ isProcessing: false });
        }
      },
    }),
    {
      name: 'nft-export-store',
      partialize: (state) => ({
        // Only persist essential data, not files or URLs
        projectName: state.projectName,
        projectVersion: state.projectVersion,
        metadata: state.metadata,
        royaltyPercentage: state.royaltyPercentage,
        resolution: state.resolution,
        savedStates: state.savedStates,
      }),
    }
  )
); 
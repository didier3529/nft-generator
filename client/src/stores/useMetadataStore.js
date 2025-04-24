import { create } from 'zustand';

const useMetadataStore = create((set) => ({
  // Collection metadata
  metadata: {
    name: '',
    description: '',
    symbol: '',
    baseUri: '',
    externalUrl: '',
    sellerFeeBasisPoints: 0
  },
  
  // Trait attributes metadata by category
  traitMetadata: {},
  
  // Update collection metadata
  updateCollectionMetadata: (newMetadata) => {
    set((state) => ({
      metadata: {
        ...state.metadata,
        ...newMetadata
      }
    }));
  },
  
  // Update specific trait category metadata
  updateTraitMetadata: (category, metadata) => {
    set((state) => ({
      traitMetadata: {
        ...state.traitMetadata,
        [category]: {
          ...(state.traitMetadata[category] || {}),
          ...metadata
        }
      }
    }));
  },
  
  // Update trait rarity
  updateTraitRarity: (category, traitName, rarity) => {
    set((state) => {
      const traits = state.traitMetadata[category]?.traits || {};
      
      return {
        traitMetadata: {
          ...state.traitMetadata,
          [category]: {
            ...(state.traitMetadata[category] || {}),
            traits: {
              ...traits,
              [traitName]: {
                ...traits[traitName],
                rarity
              }
            }
          }
        }
      };
    });
  },
  
  // Add a new trait category
  addTraitCategory: (category, displayName) => {
    set((state) => ({
      traitMetadata: {
        ...state.traitMetadata,
        [category]: {
          ...(state.traitMetadata[category] || {}),
          displayName: displayName || category,
          traits: state.traitMetadata[category]?.traits || {}
        }
      }
    }));
  },
  
  // Add a trait to a category
  addTrait: (category, traitName, traitMetadata = {}) => {
    set((state) => {
      const traits = state.traitMetadata[category]?.traits || {};
      
      return {
        traitMetadata: {
          ...state.traitMetadata,
          [category]: {
            ...(state.traitMetadata[category] || {}),
            traits: {
              ...traits,
              [traitName]: {
                ...traitMetadata,
                rarity: traitMetadata.rarity || 100
              }
            }
          }
        }
      };
    });
  },
  
  // Remove a trait from a category
  removeTrait: (category, traitName) => {
    set((state) => {
      const newTraits = { ...state.traitMetadata[category]?.traits };
      delete newTraits[traitName];
      
      return {
        traitMetadata: {
          ...state.traitMetadata,
          [category]: {
            ...(state.traitMetadata[category] || {}),
            traits: newTraits
          }
        }
      };
    });
  },
  
  // Reset all metadata to default values
  resetMetadata: () => {
    set({
      metadata: {
        name: '',
        description: '',
        symbol: '',
        baseUri: '',
        externalUrl: '',
        sellerFeeBasisPoints: 0
      },
      traitMetadata: {}
    });
  }
}));

export default useMetadataStore; 
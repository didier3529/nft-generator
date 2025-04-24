import { create } from 'zustand';
import { generateTraitCombinations, analyzeRarityDistribution } from '../services/generation/generationService';

const useGenerationStore = create((set, get) => ({
  // Generation settings
  settings: {
    collectionSize: 10,
    seed: Date.now(),
    respectRarity: true,
    avoidDuplicates: true,
    maxAttempts: 10000,
  },
  
  // Generation state
  generatedCombinations: [],
  generationProgress: 0,
  isGenerating: false,
  rarityDistribution: null,
  error: null,
  
  // Update generation settings
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings
      }
    }));
  },
  
  // Generate new seed
  generateNewSeed: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        seed: Date.now()
      }
    }));
  },
  
  // Start collection generation
  generateCollection: async (layers, traitMetadata) => {
    const { settings } = get();
    
    try {
      set({ isGenerating: true, generationProgress: 0, error: null });
      
      // Generate combinations in the background (but can't truly be async in browser)
      // In a real implementation, you might want to use a Web Worker
      
      // Update progress periodically to show feedback
      const progressInterval = setInterval(() => {
        const { generationProgress } = get();
        if (generationProgress < 95) {
          set({ generationProgress: generationProgress + 5 });
        }
      }, 100);
      
      // Generate the combinations
      const combinations = generateTraitCombinations(
        layers, 
        traitMetadata, 
        settings.collectionSize,
        {
          seed: settings.seed,
          avoidDuplicates: settings.avoidDuplicates,
          respectRarity: settings.respectRarity,
        }
      );
      
      // Analyze rarity distribution
      const distribution = analyzeRarityDistribution(combinations);
      
      // Complete the generation
      clearInterval(progressInterval);
      
      set({ 
        generatedCombinations: combinations,
        rarityDistribution: distribution,
        generationProgress: 100,
        isGenerating: false
      });
      
      return combinations;
    } catch (error) {
      set({ 
        error: error.message || 'Generation failed',
        isGenerating: false
      });
      throw error;
    }
  },
  
  // Clear the generated collection
  clearCollection: () => {
    set({
      generatedCombinations: [],
      rarityDistribution: null,
      generationProgress: 0
    });
  },
  
  // Get a specific generated NFT by index
  getNft: (index) => {
    const { generatedCombinations } = get();
    if (index >= 0 && index < generatedCombinations.length) {
      return generatedCombinations[index];
    }
    return null;
  },
  
  // Get the total number of generated NFTs
  getTotalNfts: () => {
    return get().generatedCombinations.length;
  }
}));

export default useGenerationStore; 
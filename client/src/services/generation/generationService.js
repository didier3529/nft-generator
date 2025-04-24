/**
 * Collection generation service for NFT trait combinations
 */

import { MersenneTwister } from '../../utils/mersenneTwister';

/**
 * Generates all possible trait combinations based on layers and rarity settings
 * @param {Object} layers - Object containing all layers organized by category
 * @param {Object} traitMetadata - Metadata for traits including rarity settings
 * @param {number} size - Number of NFTs to generate
 * @param {Object} options - Additional generation options
 * @returns {Array} Array of trait combinations for NFT generation
 */
export const generateTraitCombinations = (layers, traitMetadata, size, options = {}) => {
  const {
    seed = Date.now(),
    avoidDuplicates = true,
    respectRarity = true
  } = options;

  // Initialize RNG with seed for reproducible results
  const rng = new MersenneTwister(seed);
  
  // Create a map of categories to their traits
  const traitsByCategory = {};
  const uniqueTraits = new Set();
  let totalPossibleCombinations = 1;
  
  // Collect available traits for each category
  Object.keys(layers).forEach(category => {
    if (layers[category] && layers[category].length > 0) {
      traitsByCategory[category] = layers[category].map(layer => {
        const traitName = layer.name || layer.id;
        const rarity = respectRarity ? 
          (traitMetadata[category]?.traits?.[traitName]?.rarity || 100) / 100 : 
          1;
        
        uniqueTraits.add(`${category}:${traitName}`);
        
        return {
          ...layer,
          traitName,
          rarity
        };
      });
      
      // Calculate the total possible combinations
      totalPossibleCombinations *= layers[category].length;
    }
  });
  
  // Adjust size if we can't generate enough unique combinations
  if (avoidDuplicates && size > totalPossibleCombinations) {
    console.warn(`Requested ${size} combinations but only ${totalPossibleCombinations} are possible. Limiting to maximum available.`);
    size = totalPossibleCombinations;
  }
  
  // Set of already generated combinations to avoid duplicates
  const generatedCombinations = new Set();
  const result = [];
  
  // Generate combinations based on rarity weights
  for (let i = 0; i < size; i++) {
    const combination = {};
    
    for (const category in traitsByCategory) {
      const traits = traitsByCategory[category];
      
      if (traits.length === 0) continue;
      
      // Apply rarity weights using stochastic acceptance method
      if (respectRarity) {
        let selectedTrait = null;
        
        // Keep trying until we select a trait based on its rarity
        while (selectedTrait === null) {
          const randomIndex = Math.floor(rng.random() * traits.length);
          const trait = traits[randomIndex];
          
          // Stochastic acceptance: Accept with probability equal to normalized rarity
          if (rng.random() < trait.rarity) {
            selectedTrait = trait;
          }
        }
        
        combination[category] = selectedTrait;
      } else {
        // Just select a random trait with equal probability
        const randomIndex = Math.floor(rng.random() * traits.length);
        combination[category] = traits[randomIndex];
      }
    }
    
    // Convert combination to string for duplicate detection
    const combinationString = Object.entries(combination)
      .map(([category, trait]) => `${category}:${trait.traitName}`)
      .sort()
      .join('|');
    
    // Skip if this combination was already generated and we want to avoid duplicates
    if (avoidDuplicates && generatedCombinations.has(combinationString)) {
      // Try again
      i--;
      // But prevent infinite loop if we can't generate more unique combinations
      if (generatedCombinations.size >= totalPossibleCombinations) {
        break;
      }
      continue;
    }
    
    // Add to results
    result.push(combination);
    generatedCombinations.add(combinationString);
  }
  
  return result;
};

/**
 * Analyze a rarity distribution based on generated combinations
 * @param {Array} combinations - Generated trait combinations
 * @returns {Object} Statistics about trait distribution
 */
export const analyzeRarityDistribution = (combinations) => {
  const traitCounts = {};
  const categoryPercents = {};
  
  // Count occurrences of each trait
  combinations.forEach(combination => {
    Object.entries(combination).forEach(([category, trait]) => {
      if (!traitCounts[category]) {
        traitCounts[category] = {};
      }
      
      const traitName = trait.traitName;
      traitCounts[category][traitName] = (traitCounts[category][traitName] || 0) + 1;
    });
  });
  
  // Calculate percentages
  const totalItems = combinations.length;
  if (totalItems === 0) return { traitCounts, categoryPercents };
  
  Object.entries(traitCounts).forEach(([category, traits]) => {
    categoryPercents[category] = {};
    
    Object.entries(traits).forEach(([traitName, count]) => {
      categoryPercents[category][traitName] = (count / totalItems) * 100;
    });
  });
  
  return {
    traitCounts,
    categoryPercents,
    totalItems
  };
};

/**
 * Calculate rarity score for an NFT based on trait rarity
 * @param {Object} nft - The NFT's trait combination
 * @param {Object} rarityDistribution - Results from analyzeRarityDistribution
 * @returns {number} Rarity score (higher means more rare)
 */
export const calculateRarityScore = (nft, rarityDistribution) => {
  let score = 0;
  const { categoryPercents, totalItems } = rarityDistribution;
  
  Object.entries(nft).forEach(([category, trait]) => {
    if (categoryPercents[category] && categoryPercents[category][trait.traitName]) {
      // Lower percentage means higher rarity, so we invert
      const traitRarity = 100 / categoryPercents[category][trait.traitName];
      score += traitRarity;
    }
  });
  
  return score;
}; 
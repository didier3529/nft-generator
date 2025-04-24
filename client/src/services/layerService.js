import axios from 'axios';
import mockLayers from '../mock/mockLayers';

// Toggle to use mock data instead of real API calls
const USE_MOCK_DATA = true;

// Base API URL for the backend
const API_URL = 'http://localhost:5000/api/layers';

// Helper to introduce a delay to simulate network latency
const simulateNetworkDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class LayerService {
  /**
   * Upload a new layer file
   * @param {File} file - The file to upload
   * @param {string} category - The category this layer belongs to
   * @returns {Promise<Object>} The uploaded layer data
   */
  async uploadLayer(file, category) {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await simulateNetworkDelay();
      
      // Create a mock layer object
      const newLayer = {
        id: `${category.toLowerCase()}-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        filename: file.name,
        path: `/${category.toLowerCase()}s/${file.name}`,
        preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
      };
      
      // Update our mock data (this is normally handled by backend)
      if (!mockLayers[category]) {
        mockLayers[category] = [];
      }
      mockLayers[category].push(newLayer);
      
      console.log(`[MOCK] Uploaded ${file.name} to ${category}`, newLayer);
      return newLayer;
    } else {
      // Real API implementation
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error uploading layer:', error);
        throw error;
      }
    }
  }

  /**
   * Get all layers for a specific category
   * @param {string} category - The category to fetch layers for
   * @returns {Promise<Array>} Array of layer objects
   */
  async getLayers(category) {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await simulateNetworkDelay();
      
      // Return mock data for the requested category
      const layers = mockLayers[category] || [];
      console.log(`[MOCK] Getting layers for ${category}`, layers);
      
      return layers;
    } else {
      // Real API implementation
      try {
        const response = await axios.get(`${API_URL}/${category}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching layers for ${category}:`, error);
        throw error;
      }
    }
  }

  /**
   * Delete a layer
   * @param {string} category - The category the layer belongs to
   * @param {string} filename - The filename of the layer to delete
   * @returns {Promise<Object>} Success or error response
   */
  async deleteLayer(category, filename) {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await simulateNetworkDelay();
      
      // Remove from mock data
      if (mockLayers[category]) {
        const index = mockLayers[category].findIndex(
          layer => layer.filename === filename || layer.name === filename
        );
        
        if (index !== -1) {
          mockLayers[category].splice(index, 1);
          console.log(`[MOCK] Deleted ${filename} from ${category}`);
        }
      }
      
      return { success: true, message: 'Layer deleted successfully' };
    } else {
      // Real API implementation
      try {
        const response = await axios.delete(`${API_URL}/${category}/${filename}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting layer ${filename}:`, error);
        throw error;
      }
    }
  }
}

export default new LayerService(); 
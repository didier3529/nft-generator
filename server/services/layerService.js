const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

class LayerService {
  constructor() {
    this.layersPath = path.join(__dirname, '../uploads/layers');
    this.ensureDirectoryExists();
  }

  async ensureDirectoryExists() {
    await fs.ensureDir(this.layersPath);
  }

  async saveLayer(file, category) {
    try {
      const categoryPath = path.join(this.layersPath, category);
      await fs.ensureDir(categoryPath);

      // Process image with sharp
      const processedImagePath = path.join(categoryPath, file.filename);
      await sharp(file.path)
        .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile(processedImagePath);

      // Remove original upload
      await fs.remove(file.path);

      return {
        name: file.filename,
        path: processedImagePath,
        category
      };
    } catch (error) {
      throw new Error(`Error saving layer: ${error.message}`);
    }
  }

  async getLayers(category) {
    try {
      const categoryPath = path.join(this.layersPath, category);
      const exists = await fs.pathExists(categoryPath);
      
      if (!exists) {
        return [];
      }

      const files = await fs.readdir(categoryPath);
      return files.map(file => ({
        name: file,
        path: path.join(category, file),
        category
      }));
    } catch (error) {
      throw new Error(`Error getting layers: ${error.message}`);
    }
  }

  async deleteLayer(category, filename) {
    try {
      const filePath = path.join(this.layersPath, category, filename);
      await fs.remove(filePath);
      return true;
    } catch (error) {
      throw new Error(`Error deleting layer: ${error.message}`);
    }
  }
}

module.exports = new LayerService(); 
const layerService = require('../services/layerService');

class LayerController {
  async uploadLayer(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { category } = req.body;
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }

      const layer = await layerService.saveLayer(req.file, category);
      res.status(201).json(layer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLayers(req, res) {
    try {
      const { category } = req.params;
      if (!category) {
        return res.status(400).json({ error: 'Category is required' });
      }

      const layers = await layerService.getLayers(category);
      res.json(layers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteLayer(req, res) {
    try {
      const { category, filename } = req.params;
      if (!category || !filename) {
        return res.status(400).json({ error: 'Category and filename are required' });
      }

      await layerService.deleteLayer(category, filename);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LayerController(); 
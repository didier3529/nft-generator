const express = require('express');
const router = express.Router();
const layerController = require('../controllers/layerController');
const upload = require('../middleware/uploadMiddleware');

// Upload a new layer
router.post('/upload', upload.single('file'), layerController.uploadLayer);

// Get all layers in a category
router.get('/:category', layerController.getLayers);

// Delete a layer
router.delete('/:category/:filename', layerController.deleteLayer);

module.exports = router; 
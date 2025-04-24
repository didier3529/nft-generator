const express = require('express');
const router = express.Router();
const jimp = require('jimp');
const cors = require('cors');

router.use(cors()); // Enable CORS for all routes

router.post('/modify', async (req, res) => {
    try {
        const { imageUrl, brightness, contrast, greyscale } = req.body;

        // 1. Validate Inputs
        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required." });
        }

        // 2. Load Image
        const image = await jimp.read(imageUrl);

        // 3. Apply Modifications
        if (brightness) {
            image.brightness(parseFloat(brightness)); // Adjust brightness
        }
        if (contrast) {
            image.contrast(parseFloat(contrast)); // Adjust contrast
        }
        if (greyscale) {
            image.greyscale(); // Apply greyscale
        }

        // 4. Convert to Base64 for Sending
        const base64Image = await image.getBase64Async(jimp.MIME_PNG);

        // 5. Send Modified Image Back
        res.json({ modifiedImageUrl: base64Image });

    } catch (error) {
        console.error("Error modifying image:", error);
        res.status(500).json({ message: "Image modification failed.", error: error.message });
    }
});

module.exports = router; 
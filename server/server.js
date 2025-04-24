require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const layerRoutes = require('./routes/layerRoutes');

// Test if .env is being read
console.log('Environment Test:', {
  hasApiKey: !!process.env.ANTHROPIC_API_KEY,
  projectName: process.env.PROJECT_NAME
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/layers', layerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
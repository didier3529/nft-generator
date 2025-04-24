import React, { useState } from 'react';
import { Container, Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import LayerUpload from './LayerUpload';
import LayerList from './LayerList';
import TestPreview from './TestPreview';

const categories = ['Background', 'Body', 'Eyes', 'Mouth', 'Accessories'];

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel">
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LayerManager = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showTestPreview, setShowTestPreview] = useState(true); // Set to false in production

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Layer Manager
      </Typography>

      {showTestPreview && (
        <Paper sx={{ mb: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Preview Test Mode
          </Typography>
          <TestPreview />
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <button
              onClick={() => setShowTestPreview(false)}
              style={{
                padding: '8px 16px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Hide Test Preview
            </button>
          </Box>
        </Paper>
      )}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab key={category} label={category} />
          ))}
        </Tabs>
      </Box>

      {categories.map((category, index) => (
        <TabPanel key={category} value={selectedTab} index={index}>
          <LayerUpload category={category} />
          <LayerList category={category} />
        </TabPanel>
      ))}
    </Container>
  );
};

export default LayerManager; 
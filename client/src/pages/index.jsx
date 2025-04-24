import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import LayerManager from '../components/LayerManager/LayerManager';
import NftPreview from '../components/NftPreview';
import MetadataEditor from '../components/MetadataEditor';
import CollectionGenerator from '../components/CollectionGenerator';

function Home() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
                NFT Generator
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                >
                    <Tab label="Layer Manager" />
                    <Tab label="Preview & Configure" />
                    <Tab label="Metadata Editor" />
                    <Tab label="Collection Generator" />
                </Tabs>
            </Box>
            
            <Box hidden={tabValue !== 0} sx={{ pt: 2 }}>
                {tabValue === 0 && <LayerManager />}
            </Box>
            
            <Box hidden={tabValue !== 1} sx={{ pt: 2 }}>
                {tabValue === 1 && <NftPreview />}
            </Box>

            <Box hidden={tabValue !== 2} sx={{ pt: 2 }}>
                {tabValue === 2 && <MetadataEditor />}
            </Box>

            <Box hidden={tabValue !== 3} sx={{ pt: 2 }}>
                {tabValue === 3 && <CollectionGenerator />}
            </Box>
        </Container>
    );
}

export default Home; 
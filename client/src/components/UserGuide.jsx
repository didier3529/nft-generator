import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Link
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SecurityIcon from '@mui/icons-material/Security';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DevicesIcon from '@mui/icons-material/Devices';
import HelpIcon from '@mui/icons-material/Help';
import PublishIcon from '@mui/icons-material/Publish';

/**
 * User Guide Component - Comprehensive documentation for NFT Generator
 */
const UserGuide = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <HelpIcon sx={{ mr: 1 }} /> User Guide
      </Typography>
      
      <Paper variant="outlined" sx={{ mt: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DevicesIcon />} label="Getting Started" />
          <Tab icon={<PhoneAndroidIcon />} label="Mobile Setup" />
          <Tab icon={<SecurityIcon />} label="Security & Privacy" />
          <Tab icon={<PublishIcon />} label="Pump.fun Export" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Getting Started Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Getting Started with NFT Generator
              </Typography>
              
              <Typography variant="body2" paragraph>
                Welcome to the Solana NFT Generator! This tool allows you to create, customize, and mint NFT collections without coding knowledge.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Quick Start Guide:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Set Up Your Wallet" 
                    secondary="Connect a Phantom or Solflare wallet with SOL for minting (0.01 SOL minimum per NFT)." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Upload Your Assets" 
                    secondary="Upload images for each trait category (Background, Body, Head, etc.)." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Generate Collection" 
                    secondary="Set your desired collection size and generate unique combinations." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Edit Metadata" 
                    secondary="Add collection name, description, and other important metadata." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Export or Mint" 
                    secondary="Choose to export locally or mint directly to the Solana blockchain." 
                  />
                </ListItem>
              </List>
              
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">System Requirements</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Web Browser" 
                        secondary="Chrome, Firefox, Brave, or Edge (latest versions)" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Wallet Extension" 
                        secondary="Phantom or Solflare browser extension installed" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="SOL Balance" 
                        secondary="Minimum 0.01 SOL per NFT for minting" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Storage Space" 
                        secondary="At least 500MB free for large collections" 
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
          
          {/* Mobile Setup Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Mobile Setup Instructions
              </Typography>
              
              <Typography variant="body2" paragraph>
                While desktop is recommended for creating large collections, you can use the NFT Generator on mobile devices with some adjustments.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Mobile Browser Setup:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PhoneAndroidIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use Landscape Mode" 
                    secondary="Rotate your device to landscape orientation for better workspace visibility." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneAndroidIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Enable Desktop Site" 
                    secondary={
                      <>
                        In Chrome: Tap the three dots → Request Desktop Site<br />
                        In Safari: Tap 'aA' icon → Request Desktop Website
                      </>
                    } 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PhoneAndroidIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Install Wallet App" 
                    secondary="Download Phantom or Solflare mobile app from your app store." 
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Mobile Wallet Connection:
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" paragraph>
                  To connect your wallet on mobile:
                </Typography>
                
                <ol>
                  <li>
                    <Typography variant="body2" paragraph>
                      Open the Phantom or Solflare app on your device
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      In the app, tap the scanner/QR button
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      On the NFT Generator, click "Connect Wallet"
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      Scan the displayed QR code with your wallet app
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      Approve the connection request in your wallet app
                    </Typography>
                  </li>
                </ol>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Mobile-Specific Tips:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="File Selection" 
                    secondary="Tap and hold to select multiple images when uploading." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Canvas Navigation" 
                    secondary="Use pinch to zoom and two fingers to pan across the canvas." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Battery Optimization" 
                    secondary="Keep your device plugged in when generating large collections." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Storage Limitations" 
                    secondary="Export frequently to cloud storage to avoid overwhelming your device." 
                  />
                </ListItem>
              </List>
            </Box>
          )}
          
          {/* Security & Privacy Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Security & Privacy Guide
              </Typography>
              
              <Typography variant="body2" paragraph>
                Protect your identity and assets with these security best practices when creating NFTs.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Burner Wallet Setup:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" paragraph>
                  For maximum anonymity, use a dedicated "burner" wallet for NFT creation:
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Phantom Wallet:
                </Typography>
                <ol>
                  <li>
                    <Typography variant="body2">
                      Install <Link href="https://phantom.app/download" target="_blank" rel="noopener noreferrer">Phantom</Link> browser extension
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Click "Create New Wallet" instead of importing an existing one
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Set a strong password that you haven't used elsewhere
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Write down your recovery phrase on physical paper (not digital)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Fund this wallet with only the amount of SOL needed (minimum 0.01 SOL per NFT)
                    </Typography>
                  </li>
                </ol>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Solflare Wallet:
                </Typography>
                <ol>
                  <li>
                    <Typography variant="body2">
                      Install <Link href="https://solflare.com/download" target="_blank" rel="noopener noreferrer">Solflare</Link> browser extension
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Select "Create New Wallet"
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Save your recovery phrase securely offline
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Add SOL from an exchange or another wallet (0.01 SOL minimum)
                    </Typography>
                  </li>
                </ol>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Privacy Protection:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="EXIF Data" 
                    secondary="All uploaded images have EXIF data automatically removed to protect your privacy." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auto-wipe" 
                    secondary="After 15 minutes of inactivity, all local storage data is automatically erased." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Client-side Processing" 
                    secondary="All image processing happens locally on your device, not on remote servers." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Metadata Control" 
                    secondary="You control what information is included in your NFT metadata." 
                  />
                </ListItem>
              </List>
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                component={Link}
                href="https://solana.com/docs/core/security-best-practices"
                target="_blank"
                rel="noopener noreferrer"
              >
                Solana Security Best Practices
              </Button>
            </Box>
          )}
          
          {/* Pump.fun Export Tab */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Pump.fun Export Guide
              </Typography>
              
              <Typography variant="body2" paragraph>
                Learn how to prepare and export your NFTs for Pump.fun, a popular Solana NFT platform.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                What is Pump.fun?
              </Typography>
              
              <Typography variant="body2" paragraph>
                Pump.fun is a creator-focused NFT platform on Solana that allows for easy minting and trading. It's designed to be simple to use with minimal fees and maximum exposure.
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Export Steps:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 1: Prepare Your Collection" 
                    secondary="Generate your NFT collection and ensure metadata is complete." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 2: Export Files" 
                    secondary="Use the 'Export Collection' button to download your images and metadata as a ZIP file." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 3: Create Pump.fun Account" 
                    secondary="Go to Pump.fun and connect your wallet (use the same wallet you plan to mint with)." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 4: Create New Collection" 
                    secondary="On Pump.fun, select 'Create' and then 'New Collection'." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 5: Upload Assets" 
                    secondary="Upload your NFT image (thumbnail) and fill in collection details." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 6: Configure Options" 
                    secondary="Set mint price, supply limit, royalties, and other collection settings." 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 7: Launch" 
                    secondary="Review your settings and publish your collection on Pump.fun." 
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Pump.fun Metadata Requirements:
              </Typography>
              
              <Typography variant="body2" paragraph>
                Ensure your NFT Generator metadata includes:
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Collection name (max 32 characters)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Symbol (short collection code, max 10 characters)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Description (max 500 characters)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Royalty percentage (0-10%)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Traits (categorized attributes)" />
                </ListItem>
              </List>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                component={Link}
                href="https://pump.fun/create"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to Pump.fun
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserGuide; 
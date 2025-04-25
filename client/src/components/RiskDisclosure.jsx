import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Risk Disclosure Component - Provides legal disclaimers for NFT creation/minting
 */
const RiskDisclosure = ({ onAcknowledge, alwaysExpanded = false }) => {
  const [expanded, setExpanded] = useState(alwaysExpanded);
  const [checkedItems, setCheckedItems] = useState({
    financialRisk: false,
    intellectualProperty: false,
    regulatoryUncertainty: false,
    privacyRisks: false
  });
  const [showFullDisclosure, setShowFullDisclosure] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked
    });
  };

  // Check if all items are acknowledged
  const allChecked = Object.values(checkedItems).every(Boolean);

  // Handle acknowledge click
  const handleAcknowledge = () => {
    if (allChecked && onAcknowledge) {
      onAcknowledge();
    }
  };

  // Toggle full disclosure dialog
  const toggleFullDisclosure = () => {
    setShowFullDisclosure(!showFullDisclosure);
  };

  return (
    <>
      <Accordion
        expanded={expanded || alwaysExpanded} 
        onChange={() => !alwaysExpanded && setExpanded(!expanded)}
        sx={{ 
          mt: 2, 
          border: '1px solid',
          borderColor: 'error.main',
          bgcolor: 'rgba(211, 47, 47, 0.04)'
        }}
      >
        <AccordionSummary
          expandIcon={!alwaysExpanded && <ExpandMoreIcon />}
          sx={{ 
            bgcolor: 'rgba(211, 47, 47, 0.08)',
            '&:hover': {
              bgcolor: 'rgba(211, 47, 47, 0.12)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              IMPORTANT: Risk Disclosure & Legal Disclaimer
            </Typography>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Creating and minting NFTs involves various risks. Please review and acknowledge the following disclaimers before proceeding.
            </Typography>
          </Alert>
          
          <Typography variant="subtitle2" gutterBottom>
            By using this NFT Generator, you acknowledge and accept the following risks:
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checkedItems.financialRisk}
                  onChange={handleCheckboxChange}
                  name="financialRisk"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                  I understand that cryptocurrency and NFT values can be highly volatile, and I may lose my investment.
                </Typography>
              }
            />
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checkedItems.intellectualProperty}
                  onChange={handleCheckboxChange}
                  name="intellectualProperty"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                  I confirm that I have all necessary rights to any content I upload and will not infringe on others' intellectual property.
                </Typography>
              }
            />
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checkedItems.regulatoryUncertainty}
                  onChange={handleCheckboxChange}
                  name="regulatoryUncertainty"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                  I acknowledge that NFT regulations are evolving and may change in ways that could affect my NFTs.
                </Typography>
              }
            />
          </Paper>
          
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={checkedItems.privacyRisks}
                  onChange={handleCheckboxChange}
                  name="privacyRisks"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                  I understand blockchain transactions are public and pseudonymous, not anonymous, which may have privacy implications.
                </Typography>
              }
            />
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="text" 
              color="primary"
              startIcon={<InfoIcon />}
              onClick={toggleFullDisclosure}
            >
              View Full Disclosure
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              disabled={!allChecked}
              onClick={handleAcknowledge}
            >
              I Acknowledge All Risks
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Full Disclosure Dialog */}
      <Dialog
        open={showFullDisclosure}
        onClose={toggleFullDisclosure}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ bgcolor: 'error.light', color: 'white', display: 'flex', alignItems: 'center' }}>
          <WarningIcon sx={{ mr: 1 }} />
          Comprehensive Risk Disclosure
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            Financial Risks
          </Typography>
          
          <Typography variant="body2" paragraph>
            The NFT and cryptocurrency markets are highly volatile and speculative. The value of NFTs can fluctuate dramatically, and you may lose part or all of your investment. NFTs might become illiquid, making it difficult or impossible to sell them at a desired price or at all. Past performance is not indicative of future results, and there is no guarantee that the NFTs created will maintain or increase in value.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Technical Risks
          </Typography>
          
          <Typography variant="body2" paragraph>
            Blockchain technology and smart contracts may contain bugs, vulnerabilities, or other issues that could lead to technical failures, transaction problems, or loss of assets. Access to your NFTs depends on maintaining access to your crypto wallet, private keys, and seed phrases. Loss of these can result in permanent loss of access to your NFTs. The blockchain protocol or platform on which your NFT is minted could change, fork, or cease operations, potentially affecting the accessibility or value of your NFTs.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Intellectual Property Considerations
          </Typography>
          
          <Typography variant="body2" paragraph>
            The legal framework around NFTs and digital ownership is still developing. When creating or purchasing NFTs, you may not receive all intellectual property rights to the underlying content. You are responsible for ensuring you have all necessary rights to mint content as NFTs. Minting or selling content without proper rights could lead to copyright infringement claims.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Regulatory Uncertainty
          </Typography>
          
          <Typography variant="body2" paragraph>
            The regulatory landscape for NFTs and cryptocurrencies is uncertain and evolving. Future regulatory changes could impact the legality, usability, or value of NFTs. Depending on your jurisdiction, there may be tax implications for creating, buying, selling, or trading NFTs, including potential capital gains taxes, income taxes, or other tax liabilities.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Platform Risks
          </Typography>
          
          <Typography variant="body2" paragraph>
            NFT marketplaces or platforms may charge fees for listing, minting, or sales transactions. NFT platforms may cease operations, experience technical difficulties, or change their terms of service, potentially affecting access to or value of your NFTs. While blockchain entries are permanent, the files and content that NFTs point to might be stored on centralized servers that could go offline, potentially affecting the accessibility or value of your NFTs.
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Privacy Considerations
          </Typography>
          
          <Typography variant="body2" paragraph>
            Blockchain transactions are pseudonymous but not anonymous. Your transaction history and wallet address are publicly visible, which could have privacy implications. For maximum privacy protection, consider using a dedicated wallet for NFT activities that is not linked to your personal identity.
          </Typography>
          
          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="subtitle2">
              No Investment Advice
            </Typography>
            <Typography variant="body2">
              Nothing in this NFT Generator constitutes investment advice, financial advice, trading advice, or any other sort of advice. Conduct your own due diligence before making any investment decisions. Use this tool at your own risk.
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={toggleFullDisclosure}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RiskDisclosure; 
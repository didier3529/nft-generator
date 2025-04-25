import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Alert,
  AlertTitle,
  Link
} from '@mui/material';
import { FiAlertTriangle, FiChevronDown, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { mapStatusCodeToVercelError, getVercelErrorRecommendation } from '../../utils/vercelErrorHandling';

/**
 * Component for handling and displaying Vercel deployment-related errors with troubleshooting steps
 */
const VercelErrorHandler = ({ error, resetError }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Extract status code if available
  const statusCode = error?.response?.status || null;
  const errorMessage = error?.message || 'An unknown error occurred';
  
  // Get Vercel-specific error message and recommendation
  const vercelErrorMessage = statusCode ? mapStatusCodeToVercelError(statusCode) : null;
  const recommendation = getVercelErrorRecommendation(error);
  
  // Determine if this is likely a Vercel deployment error
  const isLikelyVercelError = vercelErrorMessage !== null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        m: 2,
        border: '1px solid',
        borderColor: 'error.main',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FiAlertTriangle size={24} color="#d32f2f" style={{ marginRight: '12px' }} />
        <Typography variant="h5" color="error">
          {isLikelyVercelError ? 'Vercel Deployment Error' : 'Application Error'}
        </Typography>
      </Box>
      
      <Alert severity="error" sx={{ mb: 3 }}>
        <AlertTitle>Error {statusCode ? `(${statusCode})` : ''}</AlertTitle>
        {vercelErrorMessage || errorMessage}
      </Alert>
      
      {isLikelyVercelError && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Troubleshooting Steps
          </Typography>
          <Typography variant="body1" paragraph>
            {recommendation}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            For more information, check the 
            <Link 
              href="https://vercel.com/docs/errors" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ mx: 1, display: 'inline-flex', alignItems: 'center' }}
            >
              Vercel Error Documentation
              <FiExternalLink size={14} style={{ marginLeft: '4px' }} />
            </Link>
          </Typography>
        </Box>
      )}
      
      <Accordion 
        expanded={expanded} 
        onChange={() => setExpanded(!expanded)}
        sx={{ mb: 3 }}
      >
        <AccordionSummary expandIcon={<FiChevronDown />}>
          <Typography>Technical Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
            {JSON.stringify(error, null, 2)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={resetError} 
          startIcon={<FiRefreshCw />}
        >
          Retry
        </Button>
      </Box>
    </Paper>
  );
};

export default VercelErrorHandler; 
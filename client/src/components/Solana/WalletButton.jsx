import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Box, Typography, Tooltip } from '@mui/material';
import { formatWalletAddress } from '../../services/solanaService';

/**
 * WalletButton - A minimal wallet connection button for Solana
 * Wraps the WalletMultiButton from wallet-adapter-react-ui with custom styling and status info
 */
const WalletButton = () => {
  const { connected, publicKey } = useWallet();
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {connected && publicKey && (
        <Tooltip title={publicKey.toString()} arrow>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {formatWalletAddress(publicKey.toString())}
          </Typography>
        </Tooltip>
      )}
      
      <WalletMultiButton
        style={{
          backgroundColor: connected ? '#4caf50' : '#3f51b5',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '6px 16px',
          textTransform: 'uppercase',
          transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          border: 'none',
          outline: 'none',
          whiteSpace: 'nowrap',
          minWidth: '140px'
        }}
      />
    </Box>
  );
};

export default WalletButton; 
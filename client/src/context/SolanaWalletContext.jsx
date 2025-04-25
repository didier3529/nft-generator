import React, { createContext, useContext, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import the styles for the wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// Create a context for additional wallet-related data or methods
const SolanaContext = createContext({});

/**
 * SolanaWalletProvider - Provides Solana wallet connection functionality to the app
 * This minimal implementation only supports Phantom wallet to keep the codebase simple
 */
export const SolanaWalletProvider = ({ children }) => {
  // Use devnet for testing and lower fees (switch to mainnet-beta for production)
  const network = WalletAdapterNetwork.Devnet;
  
  // Generate the Solana RPC endpoint URL
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // Only use Phantom wallet to keep implementation simple
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <SolanaContext.Provider value={{ network }}>
            {children}
          </SolanaContext.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Custom hook for using the Solana context
export const useSolanaWallet = () => useContext(SolanaContext);

export default SolanaWalletProvider; 
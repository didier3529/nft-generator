import React from 'react';
import { clusterApiUrl } from '@solana/web3.js';

// Define network endpoints
const NETWORKS = {
  devnet: clusterApiUrl('devnet'),
  testnet: clusterApiUrl('testnet'),
  mainnet: clusterApiUrl('mainnet-beta')
};

/**
 * NetworkSelector component for selecting Solana network
 * 
 * @param {Object} props - Component props
 * @param {function} props.onChange - Callback function when network changes, receives endpoint URL
 * @param {string} props.defaultNetwork - Default selected network (devnet, testnet, mainnet)
 * @param {string} props.className - Optional CSS class name
 * @returns {JSX.Element} Network selector dropdown
 */
export default function NetworkSelector({ onChange, defaultNetwork = 'devnet', className = '' }) {
  // Handle network change
  const handleNetworkChange = (e) => {
    const network = e.target.value;
    const endpoint = NETWORKS[network];
    
    // Call the onChange handler with the new endpoint URL
    if (onChange) {
      onChange(endpoint, network);
    }
  };

  return (
    <div className={`network-selector ${className}`}>
      <label htmlFor="network-select">Network:</label>
      <select 
        id="network-select"
        onChange={handleNetworkChange}
        defaultValue={defaultNetwork}
      >
        <option value="devnet">Devnet</option>
        <option value="testnet">Testnet</option>
        <option value="mainnet">Mainnet</option>
      </select>
    </div>
  );
}

// Export the NETWORKS object for external use
export { NETWORKS }; 
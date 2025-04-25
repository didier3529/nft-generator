import React, { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';
import NetworkSelector, { NETWORKS } from './components/NetworkSelector';
import './App.css';

function App() {
  // State to track the selected Solana network endpoint
  const [endpoint, setEndpoint] = useState(NETWORKS.devnet);
  const [networkName, setNetworkName] = useState('devnet');
  const [connection, setConnection] = useState(null);

  // Update connection when endpoint changes
  useEffect(() => {
    // Create new connection to Solana network
    const newConnection = new Connection(endpoint, 'confirmed');
    setConnection(newConnection);
    
    // Log connection information
    console.log(`Connected to Solana ${networkName}`);
    
    // Optional: Fetch network stats or other info when connection changes
    async function fetchNetworkInfo() {
      try {
        const version = await newConnection.getVersion();
        console.log('Solana version:', version);
      } catch (error) {
        console.error('Error fetching Solana version:', error);
      }
    }
    
    fetchNetworkInfo();
  }, [endpoint, networkName]);

  // Handle network change from selector
  const handleNetworkChange = (newEndpoint, newNetworkName) => {
    console.log(`Switching to ${newNetworkName} (${newEndpoint})`);
    setEndpoint(newEndpoint);
    setNetworkName(newNetworkName);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana NFT Generator</h1>
        <NetworkSelector 
          onChange={handleNetworkChange} 
          defaultNetwork="devnet"
          className="network-dropdown"
        />
      </header>
      <main>
        <div className="network-info">
          <p>Current Network: <strong>{networkName}</strong></p>
          <p>Endpoint: {endpoint}</p>
          {connection && (
            <p>Connection Status: <span className="status-connected">Connected</span></p>
          )}
        </div>
        {/* Additional app components would go here */}
      </main>
    </div>
  );
}

export default App; 
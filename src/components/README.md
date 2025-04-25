# Solana NetworkSelector Component

A React component for selecting between Solana networks (devnet, testnet, mainnet).

## Installation

This component requires `@solana/web3.js` as a dependency:

```bash
npm install @solana/web3.js
# or
yarn add @solana/web3.js
```

## Usage

```jsx
import React, { useState } from 'react';
import { Connection } from '@solana/web3.js';
import NetworkSelector, { NETWORKS } from './components/NetworkSelector';

function App() {
  // Initialize with devnet by default
  const [endpoint, setEndpoint] = useState(NETWORKS.devnet);
  const [connection, setConnection] = useState(
    new Connection(NETWORKS.devnet, 'confirmed')
  );

  // Handle network change
  const handleNetworkChange = (newEndpoint, networkName) => {
    setEndpoint(newEndpoint);
    setConnection(new Connection(newEndpoint, 'confirmed'));
    console.log(`Switched to ${networkName} (${newEndpoint})`);
  };

  return (
    <div>
      <h1>Solana App</h1>
      <NetworkSelector 
        onChange={handleNetworkChange} 
        defaultNetwork="devnet" 
      />
      <p>Current endpoint: {endpoint}</p>
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onChange` | function | Yes | - | Callback when network changes, receives `(endpointUrl, networkName)` |
| `defaultNetwork` | string | No | `'devnet'` | Default selected network (`'devnet'`, `'testnet'`, or `'mainnet'`) |
| `className` | string | No | `''` | Additional CSS class name for styling |

## Network Endpoints

The component exports a `NETWORKS` object that contains the RPC endpoints for each network:

```js
import { NETWORKS } from './components/NetworkSelector';

// Access endpoints directly
const devnetEndpoint = NETWORKS.devnet;
const testnetEndpoint = NETWORKS.testnet;
const mainnetEndpoint = NETWORKS.mainnet;
```

## Styling

The component includes basic styling with the following CSS classes:

- `.network-selector` - Container for the component
- `.network-selector label` - The network label
- `.network-selector select` - The dropdown element

You can customize the appearance by providing your own CSS or by passing a `className` prop.

## Example with custom styling

```jsx
import './NetworkSelector.css'; // Your custom CSS

<NetworkSelector 
  onChange={handleNetworkChange} 
  defaultNetwork="testnet"
  className="custom-network-dropdown"
/>
``` 
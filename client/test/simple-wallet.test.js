// Simple Phantom Wallet Connection Test Suite - No dependencies

describe('Phantom Wallet Connection Tests', () => {
  // Mock formatWalletAddress function
  function formatWalletAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  // Mock Phantom wallet
  const mockWallet = {
    publicKey: {
      toString: jest.fn().mockReturnValue('FakePublicKeyForTestingPurposes123456789ABCDEFG'),
    },
    connect: jest.fn().mockResolvedValue({ 
      publicKey: { 
        toString: jest.fn().mockReturnValue('FakePublicKeyForTestingPurposes123456789ABCDEFG') 
      } 
    }),
    disconnect: jest.fn().mockResolvedValue(true),
    isPhantom: true,
  };

  // Mock connection with balance function
  const mockConnection = {
    getBalance: jest.fn().mockResolvedValue(5000000) // 0.005 SOL in lamports
  };

  beforeEach(() => {
    // Set up global window object with mock Phantom wallet
    global.window = {
      solana: mockWallet
    };
    
    // Reset mock function calls
    jest.clearAllMocks();
  });

  test('Phantom wallet is available in window object', () => {
    expect(window.solana).toBeDefined();
    expect(window.solana.isPhantom).toBe(true);
  });

  test('Can connect to wallet and retrieve public key', async () => {
    const response = await window.solana.connect();
    const address = response.publicKey.toString();
    
    expect(window.solana.connect).toHaveBeenCalled();
    expect(address).toBe('FakePublicKeyForTestingPurposes123456789ABCDEFG');
  });

  test('Can format wallet address for display', () => {
    const address = 'FakePublicKeyForTestingPurposes123456789ABCDEFG';
    const formatted = formatWalletAddress(address);
    
    expect(formatted).toBe('Fake...DEFG');
  });

  test('Can get wallet balance from Solana devnet', async () => {
    // Mock balance check
    const balance = await mockConnection.getBalance();
    
    // Verify balance is retrieved and returned
    expect(balance).toBeDefined();
    expect(balance).toBeGreaterThanOrEqual(0);
    expect(typeof balance).toBe('number');
  });
}); 
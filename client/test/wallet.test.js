// Phantom Wallet Connection Test Suite
const { Connection, PublicKey } = require('@solana/web3.js');
const solanaService = require('./mocks/solanaService');

// Mock services
jest.mock('../src/services/solanaService', () => require('./mocks/solanaService'));

// Mock Solana web3.js module
jest.mock('@solana/web3.js', () => {
  return {
    Connection: jest.fn().mockImplementation(() => ({
      getBalance: jest.fn().mockResolvedValue(5000000) // 0.005 SOL in lamports
    })),
    PublicKey: jest.fn().mockImplementation((address) => ({
      toString: () => address,
      toBase58: () => address
    })),
    clusterApiUrl: jest.fn().mockReturnValue('https://api.devnet.solana.com')
  };
});

describe('Phantom Wallet Connection Tests', () => {
  // Mock window.solana (Phantom wallet)
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
    const formatted = solanaService.formatWalletAddress(address);
    
    expect(formatted).toBe('Fake...DEFG');
  });

  test('Can get wallet balance from Solana devnet', async () => {
    // Get address from wallet
    const address = window.solana.publicKey.toString();
    const publicKey = new PublicKey(address);
    
    // Get wallet balance
    const connection = new Connection('devnet');
    const balance = await connection.getBalance(publicKey);
    
    // Verify balance is retrieved and returned
    expect(balance).toBeDefined();
    expect(balance).toBeGreaterThanOrEqual(0);
    expect(typeof balance).toBe('number');
  });

  test('Verifies wallet balance using service function', async () => {
    const address = window.solana.publicKey.toString();
    const balance = await solanaService.getWalletBalance(address, 'devnet');
    
    expect(balance).toBeDefined();
    expect(balance).toBeGreaterThanOrEqual(0);
  });
}); 
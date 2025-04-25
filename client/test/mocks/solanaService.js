// Mock solanaService.js for testing
module.exports = {
  formatWalletAddress: (address) => {
    if (!address) return '';
    if (typeof address !== 'string') {
      try {
        address = address.toString();
      } catch (e) {
        return 'Invalid Address';
      }
    }
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  },
  
  getWalletBalance: async (walletAddress, network = 'devnet') => {
    // Return mock balance of 5000000 lamports (0.005 SOL)
    return Promise.resolve(5000000);
  },
  
  getSolanaConnection: (network = 'devnet') => {
    return {
      getBalance: async () => Promise.resolve(5000000)
    };
  }
}; 
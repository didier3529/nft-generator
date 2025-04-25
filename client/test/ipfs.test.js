import { NFTStorage } from 'nft.storage';

jest.mock('nft.storage', () => ({
  NFTStorage: jest.fn().mockImplementation(() => ({
    store: jest.fn().mockResolvedValue({
      url: 'ipfs://bafy...mock',
      ipnft: 'bafy...mock-ipnft',
      data: {
        name: 'Test NFT',
        description: 'Mocked NFT data',
        image: 'ipfs://bafy...mock-image',
      }
    })
  }))
}));

describe('IPFS Upload Tests', () => {
  test('Uploads NFT metadata to IPFS', async () => {
    // Create a mock NFT.Storage client
    const client = new NFTStorage({ token: 'fake-api-key' });
    
    // Mock NFT metadata
    const metadata = { 
      name: 'Test NFT',
      description: 'Test description',
      image: new Blob(['fake-image-data'])
    };
    
    // Upload to IPFS (mocked)
    const result = await client.store(metadata);
    
    // Assertions
    expect(result.url).toContain('ipfs://');
    expect(result.ipnft).toBeDefined();
    expect(NFTStorage).toHaveBeenCalledWith({ token: 'fake-api-key' });
    expect(client.store).toHaveBeenCalledWith(metadata);
  });

  test('Handles errors from NFT.Storage', async () => {
    // Override the mock for this specific test
    const mockStore = jest.fn().mockRejectedValueOnce(new Error('IPFS upload failed'));
    NFTStorage.mockImplementationOnce(() => ({
      store: mockStore
    }));
    
    const client = new NFTStorage({ token: 'fake-api-key' });
    const metadata = { name: 'Error Test NFT' };
    
    // Expect the rejected promise
    await expect(client.store(metadata)).rejects.toThrow('IPFS upload failed');
    
    // Verify the mock was called
    expect(mockStore).toHaveBeenCalledWith(metadata);
  });
}); 
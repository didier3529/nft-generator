import React, { useState } from 'react';
import './NFTGenerator.css';

const NFTGenerator = ({ walletAddress }) => {
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would implement the NFT minting logic
    console.log('Creating NFT with:', {
      name: nftName,
      description: nftDescription,
      walletAddress,
      // The image file would be sent to your backend or IPFS
    });
    alert('NFT creation functionality will be implemented in the next step!');
  };

  return (
    <div className="nft-generator">
      <h2>Create Your NFT</h2>
      <p>Connected wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nft-name">NFT Name:</label>
          <input 
            type="text" 
            id="nft-name" 
            value={nftName} 
            onChange={(e) => setNftName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nft-description">Description:</label>
          <textarea 
            id="nft-description" 
            value={nftDescription} 
            onChange={(e) => setNftDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nft-image">Upload Image:</label>
          <input 
            type="file" 
            id="nft-image" 
            accept="image/*" 
            onChange={handleImageChange}
            required
          />
        </div>
        
        {imagePreview && (
          <div className="image-preview">
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="NFT Preview" className="preview-image" />
          </div>
        )}
        
        <button type="submit" className="create-nft-btn">
          Create NFT
        </button>
      </form>
    </div>
  );
};

export default NFTGenerator; 
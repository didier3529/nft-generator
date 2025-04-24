# NFT Generator

A comprehensive application for creating, customizing, and exporting NFT collections with layered trait attributes.

## Features

- **Layer Management**: Upload, organize, and categorize traits by type (Background, Body, Eyes, etc.)
- **Canvas Preview**: Real-time preview of NFT with pan, zoom, and reset functionality
- **Trait Selection**: UI for selecting specific traits from each category
- **Randomization**: Generate random trait combinations
- **Batch Export**: Generate multiple NFTs from selected traits
- **Metadata Editor**: Customize NFT metadata configuration
- **Collection Generator**: Create complete NFT collections with randomized traits

## Project Structure

### Frontend (React)
- **NftPreview**: Canvas rendering and trait selection
- **LayerManager**: Uploading, managing, and organizing traits by category
- **BatchExport**: Generating multiple NFTs from selected traits
- **MetadataEditor**: Customizing NFT metadata configuration
- **CollectionGenerator**: Creating complete NFT collections with randomized traits
- **UploadTraits**: Bulk image uploading and categorization

### Backend
- **Layer Service**: Managing asset storage and retrieval
- **Export Service**: Handling NFT generation and export

## Technical Stack

- **Frontend**: React with Material UI components
- **State Management**: Zustand
- **Canvas Rendering**: HTML5 Canvas API
- **Backend**: Node.js server
- **Asset Management**: File system-based storage

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/didier3529/nft-generator.git
   cd nft-generator
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   cd client
   npm install
   cd ..

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. Start the development servers:
   ```bash
   # Start the backend server
   cd server
   npm start
   
   # In a separate terminal, start the client
   cd client
   npm start
   ```

4. Open http://localhost:3000 in your browser to access the application.

## Usage

1. **Upload Traits**: Use the Layer Manager to upload and categorize your trait images
2. **Preview NFTs**: Select traits to preview your NFT in the canvas
3. **Customize**: Adjust settings, organize layers, and configure metadata
4. **Export**: Generate individual NFTs or create collections with metadata

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped build and improve this project
- Inspired by the growing NFT creation community 
# NFT Generator User Guide

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [System Requirements](#system-requirements)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Mobile Support](#mobile-support)
  - [Supported Mobile Browsers](#supported-mobile-browsers)
  - [Mobile Features](#mobile-features)
  - [Known Mobile Limitations](#known-mobile-limitations)
  - [Mobile-Specific Tips](#mobile-specific-tips)
- [Mobile Testing Plan](#mobile-testing-plan)
  - [Test Environment Setup](#test-environment-setup)
  - [Test Cases](#test-cases)
  - [Test Report Documentation](#test-report-documentation)
  - [Troubleshooting Mobile-Specific Issues](#troubleshooting-mobile-specific-issues)
- [Pricing](#pricing)
- [Connecting Your Wallet](#connecting-your-wallet)
- [Generating NFTs](#generating-nfts)
  - [Basic Generation](#basic-generation)
  - [Custom Attributes](#custom-attributes)
  - [Collection Creation](#collection-creation)
- [Minting NFTs](#minting-nfts)
  - [Single NFT Minting](#single-nft-minting)
  - [Batch Minting](#batch-minting)
- [Managing Your NFTs](#managing-your-nfts)
  - [Viewing Your Collection](#viewing-your-collection)
  - [Bulk Selection and Actions](#bulk-selection-and-actions)
  - [Using the History Tab](#using-the-history-tab)
  - [Exporting Your Collection](#exporting-your-collection)
  - [Editing Metadata](#editing-metadata)
  - [Transferring Ownership](#transferring-ownership)
- [Exporting to Marketplaces](#exporting-to-marketplaces)
  - [Understanding Marketplace Requirements](#understanding-marketplace-requirements)
  - [Exporting for Pump.fun](#exporting-for-pumpfun)
  - [Exporting for Other Marketplaces](#exporting-for-other-marketplaces)
- [Advanced Features](#advanced-features)
  - [Royalty Settings](#royalty-settings)
  - [Unlockable Content](#unlockable-content)
  - [Rarity Attributes](#rarity-attributes)
- [Tips & Shortcuts](#tips-and-shortcuts)
  - [Keyboard Shortcuts](#keyboard-shortcuts)
  - [Default Metadata Values](#default-metadata-values)
  - [Other Productivity Tips](#other-productivity-tips)
- [Security & Anonymity](#security--anonymity)
- [Troubleshooting](#troubleshooting)
  - [Wallet Connection Issues](#wallet-connection-issues)
  - [Generation Errors](#generation-errors)
  - [Minting Problems](#minting-problems)
  - [Deployment Errors](#deployment-errors)
  - [Frequently Asked Troubleshooting Questions](#frequently-asked-troubleshooting-questions)
- [FAQ](#faq)
- [Support and Resources](#support-and-resources)

## Introduction

Welcome to the NFT Generator, a powerful tool that allows you to create, customize, and mint unique NFTs on the Solana blockchain. This guide will walk you through all aspects of using the platform, from initial setup to advanced features.

## Getting Started

### System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Browser**: Chrome, Firefox, or Edge (latest versions)
- **Wallet**: Phantom, Solflare, or other Solana-compatible wallet extension
- **Internet**: Stable broadband connection

### Installation

No installation is required for the web interface. Simply visit [nftgenerator.example.com](https://nftgenerator.example.com) to access the platform.

For developers who want to run the platform locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nft-generator.git
   ```

2. Install dependencies:
   ```bash
   cd nft-generator
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Configuration

Before generating NFTs, you'll need to:

1. Create an account or sign in
2. Connect your Solana wallet
3. Set up your creator profile
4. Configure your default royalty settings

## Mobile Support

The NFT Generator platform is designed to be responsive and work on mobile devices, allowing you to create and manage NFTs on the go.

### Supported Mobile Browsers

- **Chrome for Android/iOS** (recommended for best experience)
- **Firefox for Android/iOS**
- **Safari for iOS** (iOS 14+)
- **Samsung Internet**

### Mobile Features

- **Responsive Interface**: The UI automatically adapts to different screen sizes
- **Touch Gestures**: Pinch-to-zoom supported for detailed image inspection
- **Wallet Connections**: Compatible with mobile wallet apps through WalletConnect
- **Gallery Integration**: Upload images directly from your device's photo gallery

### Known Mobile Limitations

1. **Batch Operations**: Batch minting of large collections (20+ NFTs) may be slower on mobile devices
2. **Advanced Editing**: Some complex attribute editing features work better on desktop
3. **File Size**: Mobile connections may struggle with uploading large media files (>50MB)
4. **Browser Storage**: Mobile browsers have more limited storage for draft NFTs

### Mobile-Specific Tips

1. For the best experience, keep your mobile browser updated to the latest version
2. Use Wi-Fi when uploading artwork or minting NFTs to avoid mobile data charges
3. If using a mobile wallet, ensure it's properly configured for the Solana network
4. Consider creating collections on desktop and managing/viewing on mobile

## Mobile Testing Plan

### Test Environment Setup

1. **Device Compatibility**: Ensure testing on multiple mobile devices with different operating systems (iOS, Android)
2. **Network Conditions**: Test under various network conditions (2G, 3G, 4G, Wi-Fi)
3. **Browser Versions**: Test on multiple browser versions (Chrome, Firefox, Safari)
4. **Wallet Extensions**: Test with different wallet extensions (Phantom, Solflare, Backpack)

### Test Cases

1. **Basic Generation**: Verify NFT creation from scratch
2. **Custom Attributes**: Test attribute editing and visibility
3. **Collection Creation**: Verify collection setup and attribute sharing
4. **Minting NFTs**: Test single and batch minting processes
5. **Managing NFTs**: Verify collection management features (viewing, exporting, editing)
6. **Exporting to Marketplaces**: Test export to various marketplaces
7. **Advanced Features**: Verify royalty settings, unlockable content, and rarity attributes
8. **Mobile-Specific Issues**: Identify and test mobile-specific limitations and features

### Test Report Documentation

- **Test Results**: Record pass/fail status for each test case
- **Issue Description**: Detailed description of any issues encountered
- **Root Cause Analysis**: Analysis of the root cause of the issue
- **Resolution Steps**: Steps taken to resolve the issue
- **Test Environment**: Details of the environment in which the test was conducted

### Troubleshooting Mobile-Specific Issues

- **Batch Minting**: If batch minting is slow, check network congestion and optimize batch size
- **Gallery Integration**: If images are not loading, verify gallery integration and network connectivity
- **Wallet Connection**: If wallet connection issues persist, ensure wallet extension is up-to-date

## Pricing

**NFT Generator is completely free to use.** We believe in democratizing access to NFT creation tools and empowering all creators regardless of budget.

### Cost Breakdown

- **Platform Usage Fee**: $0.00
- **NFT Creation**: Free
- **Collection Management**: Free
- **Account Features**: Free
- **Solana Network Fees**: Usually less than $0.01 per mint (paid directly to the Solana network, not to us)

### Transparency

- The only costs you'll ever incur are the minimal Solana blockchain transaction fees
- These fees are not set by us and go directly to network validators
- Fees are displayed before you confirm any transaction
- Fees may fluctuate slightly based on network congestion

### Enterprise Usage

For businesses requiring high-volume minting, custom features, or dedicated support:
- Contact us at enterprise@nftgenerator.example.com
- Custom pricing based on specific needs and usage volume
- All standard features remain free regardless of usage level

## Connecting Your Wallet

1. Click the "Connect Wallet" button in the top-right corner
2. Select your wallet provider (Phantom, Solflare, etc.)
3. Approve the connection request in your wallet extension
4. Verify that your wallet address appears in the application header

## Generating NFTs

### Basic Generation

1. Navigate to the "Create" tab
2. Select "New NFT" from the options
3. Upload your artwork (supported formats: PNG, JPG, GIF, MP4, max size: 100MB)
4. Enter the basic details:
   - Name
   - Description
   - Category
5. Click "Generate Preview" to see how your NFT will appear
6. Click "Save" to store the NFT in your drafts

### Custom Attributes

1. On the NFT creation page, scroll to the "Attributes" section
2. Click "Add Attribute"
3. For each attribute, specify:
   - Trait Type (e.g., "Background", "Clothing", "Eyes")
   - Value (e.g., "Blue", "T-Shirt", "Sunglasses")
4. Attributes will be visible when your NFT is viewed on marketplaces

### Collection Creation

1. Navigate to the "Collections" tab
2. Click "Create New Collection"
3. Set up your collection:
   - Name
   - Description
   - Cover image
   - Category
4. Define shared attributes for all NFTs in the collection
5. Click "Create Collection"
6. When generating NFTs, you can select this collection from the dropdown

## Minting NFTs

### Single NFT Minting

1. Select an NFT from your drafts
2. Click the "Mint" button
3. Review the minting details:
   - Gas fees
   - Royalty settings
   - Network (Mainnet or Devnet)
4. Confirm the transaction in your wallet
5. Wait for the transaction to be confirmed on the blockchain
6. View your minted NFT in the "My NFTs" section

### Batch Minting

1. Go to the "Batch Actions" tab
2. Select multiple NFTs from your drafts
3. Click "Batch Mint"
4. Review the total costs and settings
5. Confirm the transactions in your wallet
6. Monitor progress in the "Transaction History" section

## Managing Your NFTs

### Viewing Your Collection

1. Navigate to the "My NFTs" tab
2. Browse through all your created and owned NFTs
3. Use filters to sort by:
   - Date created
   - Collection
   - Minting status
   - Price (if listed)

### Bulk Selection and Actions

The NFT Generator allows you to select multiple NFTs at once for bulk operations like exporting or deleting:

1. **Entering Selection Mode**:
   - In the Collection view, click the "Select NFTs" button
   - The interface will switch to selection mode, showing checkboxes on each NFT

2. **Selecting NFTs**:
   - Click the checkbox on each NFT you want to select
   - Alternatively, click anywhere on the NFT card to select/deselect it
   - Use "Select All on Page" to quickly select all NFTs on the current page
   - Use "Deselect All" to clear your selection

3. **Performing Bulk Actions**:
   - **Export Selected**: Creates a ZIP file containing only the selected NFTs and their metadata
   - **Delete Selected**: Removes the selected NFTs from your collection

4. **Exiting Selection Mode**:
   - Click "Exit Selection" when finished
   - Your selections will be cleared when exiting selection mode

5. **Selection Persistence**:
   - Selections persist when navigating between pages
   - The total number of selected NFTs is displayed at the top of the collection
   - Selections are reset when generating a new collection

### Using the History Tab

The NFT Generator includes a History tab that tracks your export activities, providing a quick reference of your recent exports:

- **Accessing the History Tab**: Click on the "History" tab in the main navigation to view your export history.

- **Export Records**: Each export record shows:
  - The type of export (Full Collection or Selected NFTs)
  - The number of NFTs exported
  - The collection name at the time of export
  - The exact date and time of the export

- **Storage Details**:
  - The application stores your 5 most recent export activities
  - Export history is saved to your browser's local storage
  - Your export history persists between sessions until cleared

- **Managing History**:
  - To clear your export history, click the "Clear History" button at the bottom of the History tab
  - Clearing history is permanent and cannot be undone

- **Empty History**: If you haven't exported any NFTs yet, the History tab will display a message indicating that no export history is available.

This feature helps you keep track of your export activities, especially when working on multiple collections or making iterative exports with different settings.

### Exporting Your Collection

The NFT Generator provides several ways to export your NFTs:

1. **Quick Export (Export All)**: 
   - In the Collection view, locate the green "Export All" button
   - Click the button to automatically export all NFTs in your collection
   - A ZIP file will be created containing:
     - All NFT images in PNG format
     - JSON metadata files for each NFT
     - A collection metadata file
   - The download will start automatically once the ZIP is created
   - Progress is displayed while the export is being prepared

2. **Custom Export (Batch Export)**:
   - For more control over the export format, use the "Batch Export" button
   - Customize options such as:
     - Image format (PNG or JPEG)
     - Image quality
     - Starting token ID
     - Whether to include a collection metadata file

3. **Single NFT Export**:
   - Select an individual NFT
   - Click the download icon to export just that NFT
   - Choose between downloading only the image or both image and metadata

4. **Export Reminders**:
   - The system will automatically display an "Export Your Collection" reminder every 30 minutes during active editing
   - This helps ensure you regularly save your progress
   - The reminder offers two options:
     - "Export Now": Initiates the Export All function to save your entire collection
     - "Remind Me Later": Dismisses the reminder for another 30 minutes
   - Reminders only appear when you have NFTs in your collection
   - These reminders are tracked separately from the auto-save feature, which preserves your work in case of inactivity

The exported files can be used for:
- Backup purposes
- Uploading to marketplaces
- Custom website integration
- Sharing with collaborators

### Editing Metadata

For unminted NFTs:
1. Select the NFT from your drafts
2. Click "Edit"
3. Update any fields as needed
4. Click "Save Changes"

For minted NFTs:
1. Select the minted NFT
2. Click "Update Metadata"
3. Note that some properties cannot be changed after minting
4. Confirm the metadata update transaction

### Transferring Ownership

1. Select the NFT you want to transfer
2. Click "Transfer"
3. Enter the recipient's wallet address
4. Confirm the transfer in your wallet
5. The NFT will appear in the recipient's wallet once confirmed

## Exporting to Marketplaces

Once you've created and minted your NFTs, you may want to list them for sale on various marketplaces. This section guides you through the process of preparing and exporting your NFTs for popular marketplaces, with a specific focus on Pump.fun.

### Understanding Marketplace Requirements

Different marketplaces have specific requirements for NFT listings. Here are some general considerations:

1. **Metadata Format**: Most marketplaces require standard Metaplex metadata format for Solana NFTs
2. **Image Hosting**: Assets should be hosted on IPFS or another decentralized storage solution
3. **Collection Verification**: Some marketplaces require collection verification for enhanced visibility
4. **Royalty Standards**: Ensure your royalty settings conform to the marketplace's supported standards
5. **File Size and Format Restrictions**: Be aware of any limitations on image dimensions or file sizes

### Exporting for Pump.fun

[Pump.fun](https://pump.fun) is a popular Solana NFT marketplace known for its user-friendly interface and low fees. Follow these steps to export your NFTs to Pump.fun:

#### Step 1: Export Your NFT Files

1. From your NFT collection view, select the NFT(s) you want to list on Pump.fun
2. Click the "Export" button for individual NFTs or "Export All" for the entire collection
3. Choose "Export with Pump.fun Compatibility" from the dropdown options
   - This ensures the metadata includes all fields required by Pump.fun
   - If this option isn't available, use the standard export and we'll modify it later
4. Wait for the export process to complete and download the ZIP file
5. Extract the ZIP file to a convenient location on your computer

#### Step 2: Prepare Your Assets for Pump.fun

1. Open the extracted folder from your export
2. You'll see two main folders:
   - `images/`: Contains all your NFT image files
   - `metadata/`: Contains JSON metadata files for each NFT
3. For Pump.fun, you'll need to ensure your images are hosted on IPFS:
   - If you've already used our IPFS upload feature, you can skip to Step 3
   - If not, continue with these steps

4. Upload your images to IPFS:
   - Visit a service like [NFT.Storage](https://nft.storage) or [Pinata](https://pinata.cloud)
   - Create an account if you don't have one
   - Upload the entire `images/` folder
   - Wait for the upload to complete and copy the CID (Content Identifier)
   - The CID looks like: `QmYpC8jNBLjgtM9irz4C4aBJtMhf1RSQKZu7nniQRRQSvF`

5. Update your metadata files to point to IPFS:
   - Open each JSON file in the `metadata/` folder using a text editor
   - Find the `"image"` field that currently points to a local file
   - Replace it with the IPFS URI: `"ipfs://YOUR_CID_HERE/images/filename.png"`
   - Replace `YOUR_CID_HERE` with the actual CID you received
   - Save each updated file

#### Step 3: Create Your Listing on Pump.fun

1. Visit [Pump.fun](https://pump.fun) and connect your wallet
   - Use the same wallet that owns the NFTs you want to list
   - If using a burner wallet for security, first ensure the NFTs are in that wallet

2. Navigate to the "Create" section on Pump.fun
   - Look for a "Create" or "List NFT" button (exact wording may vary)
   - Select the option to list an existing NFT

3. Choose your upload method:
   - Select "Upload Metadata"
   - Click "Choose File" and select one of your prepared JSON metadata files
   - Alternatively, some versions may allow batch uploads of multiple metadata files

4. Verify the NFT details:
   - Pump.fun will display a preview of your NFT based on the metadata
   - Verify that the image loads correctly (if not, check your IPFS links)
   - Confirm that attributes and other details appear as expected

5. Set your listing details:
   - Enter your desired price in SOL
   - Choose between fixed price or auction format
   - Set the listing duration
   - Add any additional listing details Pump.fun requests

6. Submit your listing:
   - Review all information for accuracy
   - Click "Create Listing" or similar button
   - Approve the transaction in your wallet
   - Wait for confirmation that your listing is live

7. For batch listings:
   - Some versions of Pump.fun support batch listing
   - Look for a "Batch Upload" or "Multiple Listings" option
   - Follow the platform's instructions for uploading multiple metadata files at once

#### Step 4: Verify Your Listings

1. After listing, navigate to your profile on Pump.fun
2. Check the "My Listings" or similar section
3. Verify all your NFTs appear and display correctly
4. Test the listings by viewing them as a potential buyer would
5. Make sure images load properly and all metadata displays correctly

### Exporting for Other Marketplaces

The NFT Generator supports exporting to various other popular marketplaces. The general process is similar to the Pump.fun workflow, with some platform-specific adjustments:

#### Magic Eden

1. Export your NFTs using the "Standard Export" option
2. Follow Magic Eden's creator portal instructions for listing existing NFTs
3. Note that Magic Eden may require collection verification for enhanced visibility

#### OpenSea (Solana)

1. Use the "OpenSea Compatible Export" option when exporting your NFTs
2. This format ensures that OpenSea can properly read your metadata structure
3. Follow OpenSea's listing process for Solana NFTs

#### Tensor

1. Export using the "Standard Export" option
2. Tensor works well with standard Metaplex metadata
3. Follow Tensor's guide for listing existing NFTs

#### Marketplace-Specific Tips

- **Royalty Enforcement**: Different marketplaces have different approaches to royalty enforcement. Check each platform's current policy.
- **Collection Grouping**: To ensure your NFTs appear together as a collection, verify the collection fields in your metadata match across all NFTs.
- **Delayed Indexing**: After listing, some marketplaces may take time (5-30 minutes) to fully index your NFTs and make them searchable.
- **Marketplace Fees**: Be aware of the fee structure for each marketplace before listing.

## Advanced Features

### Royalty Settings

1. Go to "Account Settings" > "Creator Profile"
2. Configure your default royalty percentage (0-100%)
3. For individual NFTs, you can override the default during creation
4. Royalties are automatically sent to your wallet when your NFTs are sold on compatible marketplaces

### Unlockable Content

1. During NFT creation, find the "Unlockable Content" section
2. Toggle "Add Unlockable Content"
3. Enter the content that only the NFT owner will be able to access:
   - Private links
   - Redemption codes
   - Special instructions
4. This content remains encrypted until purchased

### Rarity Attributes

1. When creating a collection, click "Advanced Settings"
2. Enable "Rarity Scores"
3. For each attribute, you can set a rarity percentage
4. The platform will automatically calculate the overall rarity score for each NFT
5. Rarity scores are visible on marketplaces that support this feature

## Tips & Shortcuts

The NFT Generator includes several features designed to streamline your workflow and enhance productivity. Here are some helpful tips and keyboard shortcuts to improve your experience.

### Keyboard Shortcuts

To increase efficiency when working with the NFT canvas, the following keyboard shortcuts are available:

- **Ctrl+S (or Cmd+S on Mac)**: Save the current canvas state
  - Prevents the browser's default save dialog from appearing
  - Displays a "Saved!" toast message when successful
  - Will show a warning if there are no layers added to the canvas

- **Ctrl+E (or Cmd+E on Mac)**: Open the Export dialog
  - Quickly access the export options without using the mouse
  - Same functionality as clicking the "Export NFT" button
  - Requires at least one trait to be added to the canvas

These shortcuts work on the canvas page and are particularly useful when you're making frequent changes that you want to preserve.

### Default Metadata Values

To help you create NFTs more efficiently, some metadata fields are pre-filled with sensible defaults:

- **Description Field**: Automatically populated with "Unique 1/1 NFT generated on [current date]"
  - The date is formatted according to your local settings (e.g., "June 15, 2023")
  - This default description remains consistent when switching between traits
  - You can edit or replace this text at any time

This feature speeds up the creation process while still allowing full customization of all metadata fields.

### Other Productivity Tips

- Save your work frequently using the Ctrl+S shortcut
- Use the built-in zoom controls to focus on specific details of your NFT
- Batch similar operations together (e.g., upload all backgrounds at once)
- Consider using descriptive naming conventions for your traits to make organization easier
- Take advantage of collection metadata to maintain consistent information across multiple NFTs

## Security & Anonymity

The NFT Generator platform prioritizes your security and privacy throughout the NFT creation and minting process. This section outlines our security practices and provides recommendations to protect your digital assets and identity.

### Our Security Commitment

- **No Storage of Private Keys**: The NFT Generator **never** stores, logs, or transmits your wallet's private keys
- **Zero NFT Custody**: We do not maintain custody of your NFTs at any point
- **Local Processing**: Core generation and preview functions happen in your browser, not on our servers
- **Minimized Data Collection**: We only collect data necessary for the functioning of the platform
- **Transparent Transactions**: All blockchain interactions are visible for your review before signing

### Recommended Security Practices

#### Wallet Security

1. **Use Burner Wallets for Minting**
   - Create a dedicated wallet specifically for minting operations
   - Transfer valuable NFTs to your primary wallet after minting
   - Consider using a hardware wallet for long-term NFT storage
   - Generate a new burner wallet for each major project

### Why and How to Use Burner Wallets

A burner wallet is a secondary wallet specifically created for higher-risk activities like minting NFTs, interacting with new dApps, or participating in airdrops. Think of it as a disposable wallet that limits your exposure if something goes wrong.

#### Why Use a Burner Wallet?

1. **Risk Isolation**: Keep your main portfolio separate from minting activities
2. **Malicious Contract Protection**: If you accidentally interact with a malicious contract, only your burner wallet is exposed
3. **Privacy Enhancement**: Prevents linking your main wallet/holdings to your creative activities
4. **Organized Operations**: Easier to track minting expenses and new NFT acquisitions
5. **Emergency Abandonment**: If compromised, you can simply abandon the wallet without risking your main assets

#### Creating a Burner Wallet with Phantom

Phantom is one of the most popular Solana wallets and makes it easy to create and manage multiple wallets. Here's how to set up a burner wallet with Phantom:

**For New Phantom Users:**

1. **Install Phantom**:
   - Visit [Phantom.app](https://phantom.app/) or your browser's extension store
   - Download and install the official Phantom extension
   - Be careful to only install the authentic Phantom wallet (look for verified publisher)

2. **Create Your First Wallet**:
   - Open the Phantom extension
   - Click "Create a new wallet"
   - Write down and safely store your 12-word recovery phrase
   - This can serve as your main wallet

3. **Create a Burner Wallet**:
   - Click the profile icon in the top-right corner
   - Select "Add/Connect Wallet"
   - Choose "Create a new wallet"
   - Set a name like "NFT Minting Burner"
   - Create a password
   - Store the new recovery phrase separately from your main wallet's phrase

**For Existing Phantom Users:**

1. **Add a New Wallet**:
   - Open your Phantom extension
   - Click your profile icon in the top-right corner
   - Select "Add/Connect Wallet"
   - Choose "Create a new wallet"
   - Name it something clear like "NFT Generator Burner"

2. **Fund Your Burner Wallet**:
   - Switch to your burner wallet in Phantom
   - Copy the wallet address
   - From your main wallet or exchange, send a small amount of SOL (just enough for your planned activities)
   - Typically 0.1-0.5 SOL is sufficient for several mint transactions

#### Using Your Burner Wallet

1. **Connect to NFT Generator**:
   - Ensure you have your burner wallet selected in Phantom
   - Connect to the NFT Generator platform
   - Verify the correct wallet address appears in the interface

2. **Minting Process**:
   - Use the burner wallet for all minting transactions
   - Keep only the SOL you need for immediate transactions
   - Monitor your transaction history for any suspicious activity

3. **After Minting**:
   - Transfer valuable NFTs to your main wallet:
     - In Phantom, select the NFT
     - Click "Send"
     - Enter your main wallet address
     - Confirm the transaction
   - Consider leaving a small amount of SOL in the burner wallet for future transactions

4. **Wallet Hygiene**:
   - Create a new burner wallet for different projects or periodically
   - Never reuse recovery phrases between wallets
   - Don't store more value in the burner wallet than you're willing to lose

#### Mobile Burner Wallet Setup

If you're using the Phantom mobile app:

1. **Install Phantom** on your mobile device from the App Store or Google Play Store
2. **Open the app** and either create a new wallet or import an existing one
3. **Tap your profile icon** in the top-right corner
4. **Select "Add/Connect Wallet"**
5. **Choose "Create a new wallet"** and follow the prompts
6. **Switch between wallets** by tapping your profile icon and selecting the desired wallet

#### Security Best Practices for Burner Wallets

1. **Use Unique Passwords** for each wallet
2. **Store Recovery Phrases Separately** for different wallets
3. **Transfer Assets Promptly** after minting to your secure wallet
4. **Never Share Your Phrase** with anyone, even for "verification"
5. **Check Transactions Carefully** before approving them
6. **Avoid Connecting** your burner wallet to multiple dApps simultaneously

2. **Private Key Protection**
   - Never share your seed phrase or private keys with anyone
   - Store backup phrases offline in a secure location
   - Be suspicious of any requests to "validate" or "verify" your wallet
   - Consider using a hardware wallet for additional security

3. **Transaction Verification**
   - Always review transaction details before signing
   - Verify recipients and amounts match your expectations
   - Be wary of unusual permission requests
   - Set reasonable spending limits in your wallet when possible

#### Privacy Considerations

1. **Browser Privacy**
   - Clear your browser cache after using the NFT Generator
   - Use private/incognito mode for additional privacy
   - Consider using a privacy-focused browser for NFT operations
   - Disable unnecessary browser extensions during sessions

2. **Network Security**
   - Avoid using public Wi-Fi when minting valuable NFTs
   - Consider using a VPN for additional network privacy
   - Ensure your connection is secure (HTTPS) before connecting your wallet
   - Keep your operating system and security software updated

3. **Identity Protection**
   - Consider using pseudonyms for your NFT creator profile
   - Be mindful of what personal information you include in NFT metadata
   - Remember that blockchain transactions create a permanent public record
   - Use different wallet addresses for different types of activities

### Data Practices & Storage

1. **What We Store**
   - User preferences and settings
   - NFT metadata templates you create (until you clear your browser data)
   - Collection configurations you generate

2. **What We Don't Store**
   - Private keys or seed phrases
   - Wallet connection details after session ends
   - Complete copies of your NFTs or artwork
   - Transaction history beyond active sessions

3. **Local-First Approach**
   - Most data is stored in your browser's local storage
   - Export your collections regularly for backup
   - Clearing browser data will remove your locally stored collections

### Security FAQs

**Q: Is it safe to connect my primary wallet to NFT Generator?**  
A: While our platform is secure, we recommend using burner wallets specifically for minting operations as a best practice for any NFT platform.

**Q: How can I verify that the NFT Generator isn't storing my keys?**  
A: Our platform is built with client-side processing for sensitive operations. You can verify this by checking that wallet interactions leverage standard web3 libraries and by reviewing our open source components.

**Q: What should I do if I notice suspicious activity after using NFT Generator?**  
A: If you notice any suspicious activity:
1. Disconnect your wallet from all dApps immediately
2. Transfer valuable assets to a secure wallet if possible
3. Report the activity to support@nftgenerator.example.com
4. Clear your browser cache and run a security scan on your device

## Troubleshooting

### Wallet Connection Issues

1. **Wallet Not Connecting**:
   - Clear your browser cache
   - Update your wallet extension to the latest version
   - Disable other wallet extensions that might conflict
   - Try using a different browser

2. **Transaction Signing Fails**:
   - Ensure you have sufficient SOL for transaction fees
   - Check that your wallet is unlocked
   - Try reconnecting your wallet

3. **Phantom-Specific Issues**:
   - Check `solana config get` output to verify you're on the correct network
   - Try the "Reset Account" feature in Phantom settings (note: this won't affect your funds)

### Generation Errors

1. **Artwork Upload Failures**:
   - Verify the file is under the 100MB limit
   - Check that the file format is supported
   - Try reducing the file size or converting to a different format
   - Clear browser cache and try again

2. **Preview Not Generating**:
   - Refresh the page and try again
   - Try a different browser
   - Check your internet connection stability

3. **Attributes Not Saving**:
   - Ensure attribute names don't contain special characters
   - Limit the number of attributes to 20 or fewer
   - Check that all required fields are filled

### Minting Problems

1. **Transaction Fails**:
   - Ensure you have enough SOL to cover minting fees
   - Check network congestion and try again later
   - Verify you're connected to the correct network (Mainnet/Devnet)

2. **Minting Stuck in Progress**:
   - Check transaction status in Solana Explorer
   - If confirmed on-chain but not in UI, refresh the page
   - Contact support if the issue persists for more than 30 minutes

3. **NFT Not Appearing After Minting**:
   - Wait 5-10 minutes for the transaction to fully propagate
   - Refresh your wallet and the NFT Generator interface
   - Check Solana Explorer to confirm the token was created

### Deployment Errors

For developers running their own instance:

1. **Local Instance Not Starting**:
   - Check console logs for specific error messages
   - Verify all dependencies are installed correctly
   - Ensure you have the correct environment variables set

2. **Program Deployment Issues**:
   - Get more devnet SOL if needed:
     ```bash
     solana airdrop 2
     ```
   - Verify your program was deployed correctly:
     ```bash
     solana program show --program-id YOUR_PROGRAM_ID
     ```
   - Check logs for specific error codes and refer to the Solana documentation

3. **API Connection Problems**:
   - Verify API endpoint URLs in your configuration
   - Check network permissions and firewall settings
   - Test API endpoints directly to isolate the issue

### Frequently Asked Troubleshooting Questions

#### Wallet and Connection Issues

**Q: Why won't my wallet connect to the NFT Generator?**  
A: This is usually due to one of the following issues:
- **Browser Extensions Conflict**: Disable other wallet extensions temporarily
- **Outdated Wallet**: Update your wallet extension to the latest version
- **Browser Permissions**: Ensure that popup windows are allowed for the NFT Generator site
- **Network Mismatch**: Make sure your wallet is set to the same network as the NFT Generator (Mainnet/Devnet)

**Q: I keep getting "User rejected request" errors when trying to connect my wallet. What's wrong?**  
A: This occurs when you (or your security software) deny the connection request. Check for:
- Pop-up blockers preventing wallet confirmation screens
- Security software intercepting the wallet connection
- Wallet app notifications if using a mobile wallet
- Try approving the request within 30 seconds before it times out

**Q: My wallet shows connected but the NFT Generator doesn't recognize it. How do I fix this?**  
A: Try these steps in order:
1. Refresh the page
2. Disconnect and reconnect your wallet
3. Clear your browser cache for the site
4. Check if you have multiple wallet accounts and ensure you're using the intended one
5. Try a different browser or device

#### Transaction and Minting Problems

**Q: Why do my transactions keep failing?**  
A: Transaction failures typically happen because of:
- **Insufficient Funds**: You need enough SOL to cover both the NFT mint cost and transaction fees
- **Network Congestion**: During peak times, transactions may fail due to network load
- **RPC Node Issues**: The Solana RPC node may be experiencing problems
- **Invalid Parameters**: The transaction may contain invalid data

Try increasing your transaction priority fee slightly and ensure you have at least 0.05 SOL available above your minting costs.

**Q: My transaction shows as "confirmed" in Solana Explorer but the NFT isn't showing up. What happened?**  
A: This is usually a timing or caching issue:
1. Wait 5-15 minutes for full blockchain propagation and indexing
2. Refresh your wallet or NFT collection view
3. Check that the NFT is associated with the correct wallet address
4. Verify the transaction details in Solana Explorer to confirm successful metadata creation

**Q: Why am I seeing "Transaction simulation failed" errors?**  
A: This means the transaction would fail if submitted. Common causes include:
- Insufficient funds for the transaction
- Program instruction errors
- Account permission issues

Check your wallet balance first, then try again with a smaller batch of NFTs if you're batch minting.

#### IPFS Upload Issues

**Q: My IPFS uploads are failing. How can I troubleshoot this?**  
A: IPFS upload issues are typically related to:
- **Connection Problems**: Check your internet stability
- **Rate Limiting**: You may be hitting API rate limits with the IPFS provider
- **File Size**: Files may be too large for direct upload
- **Format Issues**: The file format might not be supported

Try these solutions:
1. Reduce image file sizes to under 15MB each
2. Use a direct HTTPS URL for metadata instead of IPFS temporarily
3. Try uploading smaller batches of files
4. Check if your IPFS service (like Pinata or nft.storage) is experiencing outages

**Q: My NFT images uploaded to IPFS but are showing as broken links on marketplaces. Why?**  
A: This could be due to:
- IPFS gateway configuration issues
- Unpinned content that is no longer available on the network
- Incorrect CID (Content Identifier) in your metadata

To fix this:
1. Ensure your files are properly pinned on IPFS (using Pinata, nft.storage, or similar services)
2. Verify your metadata points to the correct IPFS URI format (ipfs://CID/filename)
3. Try accessing your file through multiple IPFS gateways to verify availability
4. If using a custom gateway, ensure it's properly configured and operational

**Q: How long should IPFS uploads take? Mine seem stuck.**  
A: IPFS uploads typically take:
- Small files (<5MB): 10-30 seconds
- Medium files (5-20MB): 30-90 seconds
- Large files (>20MB): 2-5 minutes or more

If uploads are taking significantly longer:
1. Check your internet connection speed
2. Try a different IPFS gateway or service
3. Break up large uploads into smaller batches
4. Ensure you're not uploading during peak network congestion periods

#### Export and Download Issues

**Q: The "Export All" function isn't working. What should I check?**  
A: If the export function isn't working properly:
- Ensure you have generated NFTs in your collection first
- Check that your browser supports file downloading
- Verify you have sufficient disk space for the ZIP file
- Try exporting a smaller number of NFTs at a time
- Disable download blockers or security software temporarily

**Q: My exported files have incorrect metadata. How can I fix this?**  
A: This could happen due to:
1. Outdated collection data in the interface
2. Interrupted export process
3. Missing or corrupted metadata fields

Solutions:
- Regenerate your collection before exporting
- Check all metadata fields are properly filled in
- Export again with custom settings to ensure all fields are included
- For serious issues, contact support with examples of the incorrect metadata

**Q: Can I resume a failed export or does it start over each time?**  
A: Currently, exports start from the beginning if interrupted. For large collections:
- Export in smaller batches (100-200 NFTs at a time)
- Ensure stable internet connection before starting
- Keep the browser tab active during export
- Consider using the batch export with more specific settings

#### General Troubleshooting Tips

**Q: The app seems slow or unresponsive. How can I improve performance?**  
A: Try these general performance improvements:
1. Clear your browser cache and cookies
2. Close unnecessary browser tabs and applications
3. Use a modern browser (Chrome, Firefox, Edge latest versions)
4. Disable browser extensions temporarily
5. For large collections, break operations into smaller batches
6. If on mobile, try switching to a desktop for resource-intensive operations

**Q: I've tried everything and still have issues. What should I do next?**  
A: For persistent problems:
1. Check the [official documentation](https://docs.nftgenerator.example.com) for updates
2. Join our [Discord community](https://discord.gg/nftgenerator) for peer support
3. Contact support directly at support@nftgenerator.example.com with:
   - Detailed description of the issue
   - Browser and OS information
   - Wallet type and version
   - Screenshots of any error messages
   - Transaction IDs if applicable
4. Check our status page for any ongoing service disruptions

## FAQ

The following frequently asked questions are organized by category to help you quickly find answers to common queries about the NFT Generator platform.

### Costs and Pricing

**Q: How much does it cost to mint an NFT?**
A: The NFT Generator platform itself is completely free to use. The only costs you'll incur are the Solana blockchain network fees, which typically range from 0.00001-0.001 SOL per transaction (approximately $0.001-$0.01 USD at current rates). These fees go directly to the Solana network validators, not to us. For large collections, you can estimate total minting costs by multiplying the per-transaction fee by the number of NFTs in your collection.

**Q: Are there any hidden fees?**
A: No, there are no hidden fees. We clearly display all costs before you confirm any transaction. While the NFT Generator platform is free, be aware that marketplaces where you list your NFTs may charge their own listing or transaction fees.

**Q: Is there a limit to how many NFTs I can create?**
A: There's no limit imposed by our platform on how many NFTs you can create. However, practical limitations may apply based on your device's capabilities, browser performance, and Solana network conditions. For large collections (1,000+ NFTs), we recommend batch processing in smaller groups.

### Wallet Compatibility

**Q: Which wallets are supported by NFT Generator?**
A: The NFT Generator platform supports most major Solana wallets, including:
- Phantom
- Solflare
- Backpack
- Glow
- Brave Wallet
- Coinbase Wallet (Solana mode)
- Slope
- Sollet
- Math Wallet
- Clover
- Ledger hardware wallets (connected via Solflare or Phantom)

We recommend Phantom or Solflare for the best experience and fullest feature support.

**Q: Can I use MetaMask with NFT Generator?**
A: MetaMask doesn't natively support the Solana blockchain, as it's primarily designed for Ethereum and EVM-compatible networks. Therefore, you cannot directly connect MetaMask to NFT Generator. However, you have several options:
1. Use a Solana-compatible wallet like Phantom or Solflare instead
2. If you're absolutely committed to using MetaMask, you can try third-party MetaMask Snaps that add Solana support, but this is experimental and not officially supported by our platform
3. For users familiar with MetaMask who want a similar experience on Solana, we recommend trying Phantom, which has a similar interface and user experience

**Q: Can I connect multiple wallets simultaneously?**
A: Currently, you can only connect one wallet at a time to the NFT Generator. If you need to use a different wallet, you'll need to disconnect the current one first and then connect the new wallet.

**Q: How do I disconnect my wallet?**
A: To disconnect your wallet, click on your wallet address in the top-right corner of the interface, then select "Disconnect." You can also disconnect from within your wallet extension itself.

### NFT Creation and Minting

**Q: What file formats are supported for NFT artwork?**
A: The NFT Generator supports the following file formats:
- Images: PNG, JPG/JPEG, GIF, SVG, WebP
- Animations: MP4, WebM
- 3D Models: GLB (limited support)
- Maximum file size: 100MB (though we recommend keeping files under 20MB for optimal performance)

**Q: How long does the minting process take?**
A: The minting process typically takes 10-30 seconds per NFT, depending on Solana network conditions. Batch minting of multiple NFTs will take proportionally longer. After minting, it may take an additional 5-15 minutes for your NFTs to appear in your wallet and on marketplaces.

**Q: Can I edit my NFT after minting?**
A: Certain aspects of NFTs can be updated after minting, while others cannot:
- **Cannot change**: The NFT image itself, token ID, or mint address
- **Can update**: Metadata descriptions, some attributes, external links (using our Update Metadata feature)
Keep in mind that metadata updates may not be reflected immediately on all marketplaces.

### Technical Questions

**Q: Does NFT Generator work on mobile devices?**
A: Yes, the NFT Generator works on mobile devices through our responsive web interface. For detailed information on mobile support, see our [Mobile Support](#mobile-support) section. For the best experience with large collections, we recommend using a desktop computer.

**Q: Where are my NFT images stored?**
A: When you mint NFTs, your images are stored on IPFS (InterPlanetary File System), a decentralized storage network. This ensures your NFT assets remain available even if our platform were to go offline. By default, we pin your assets to multiple IPFS nodes to ensure reliability, but we recommend also backing up your files and pinning them through services like Pinata or NFT.Storage for additional redundancy.

**Q: Is there an API available for developers?**
A: Yes, we offer a developer API for programmatic interaction with the NFT Generator platform. For documentation and access requests, please visit our [Developer Portal](https://developers.nftgenerator.example.com) or contact our support team.

### Marketplace and Sales

**Q: Can I sell my NFTs directly on this platform?**
A: Currently, the NFT Generator focuses on creation and minting. For selling, you can list your NFTs on marketplaces like Magic Eden, Pump.fun, Tensor, or OpenSea (Solana). See our [Exporting to Marketplaces](#exporting-to-marketplaces) section for detailed instructions.

**Q: How do I ensure my NFT collection is verified on marketplaces?**
A: After creating your collection, go to the "Verification" tab and follow the instructions for each marketplace. The process typically involves proving ownership of your creator wallet and submitting your collection for review.

**Q: How are royalties enforced?**
A: Royalties are encoded in the NFT metadata, but enforcement depends on the marketplace. Some marketplaces enforce royalties; others make them optional. The Solana ecosystem continues to evolve with various approaches to royalty enforcement.

### Legal and Rights

**Q: Can I use AI-generated artwork for my NFTs?**
A: Yes, you can use AI-generated artwork, but ensure you have the proper rights to commercialize the images based on the AI platform's terms of service. Some AI image generators have specific restrictions on commercial use or NFT creation.

**Q: What rights do buyers of my NFTs receive?**
A: By default, buyers receive a license to display and resell the NFT, but not to reproduce the artwork commercially. You can customize these rights in your NFT metadata. We recommend clearly stating the rights you're granting in your collection description.

**Q: Can I change the blockchain network after minting?**
A: No, once an NFT is minted on a specific blockchain (Solana in this case), it cannot be transferred to a different blockchain without creating a new NFT. Cross-chain bridging solutions exist but typically create wrapped versions rather than transferring the original NFT.

## Support and Resources

- **Documentation**: [docs.nftgenerator.example.com](https://docs.nftgenerator.example.com)
- **Tutorial Videos**: [YouTube Channel](https://youtube.com/nftgeneratorchannel)
- **Discord Community**: [Join our Discord](https://discord.gg/nftgenerator)
- **Email Support**: support@nftgenerator.example.com
- **Twitter Updates**: [@NFTGenerator](https://twitter.com/nftgenerator)
- **Office Hours**: Live support available Monday-Friday, 9am-5pm EST

---

The NFT Generator team is constantly working to improve the platform and add new features. Please check back regularly for updates and new capabilities!

*Last updated: August 2023* 
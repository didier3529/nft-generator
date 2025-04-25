# NFT Generator Setup Guide

This guide explains how to set up the NFT Generator application using the provided setup scripts.

## Requirements

Before running the setup scripts, ensure you have the following:

- Node.js (v14.x or later)
- npm (v6.x or later)
- Git
- MongoDB (v4.4 or later) - Optional, the server setup script can configure a local instance

## Available Setup Scripts

Three setup scripts are provided:

1. **setup-all.js** - Runs both server and client setup scripts sequentially
2. **setup-server.js** - Sets up only the server component
3. **setup-client.js** - Sets up only the client component

## Quick Start

For a complete setup of both server and client components:

```bash
# Make the script executable
chmod +x setup-all.js

# Run the script
./setup-all.js
```

Or alternatively:

```bash
node setup-all.js
```

## Individual Component Setup

If you want to set up only the server or client component:

```bash
# Server setup
node setup-server.js

# Client setup
node setup-client.js
```

## What The Scripts Do

### Server Setup (`setup-server.js`)

- Validates the server directory structure
- Cleans up old installations if needed
- Installs Node.js dependencies
- Creates a development `.env` file with default settings
- Configures MongoDB settings
- Creates necessary directories
- Verifies the installation

### Client Setup (`setup-client.js`)

- Validates the client directory structure
- Installs Node.js dependencies
- Creates a development `.env` file with default settings
- Verifies critical dependencies

## After Setup

Once setup is complete, you can start the application:

1. Start the server:
   ```bash
   cd server && npm start
   ```

2. In a new terminal, start the client:
   ```bash
   cd client && npm start
   ```

The client should be accessible at: http://localhost:3000  
The server should be running at: http://localhost:5000

## Troubleshooting

### Setup Logs

Each setup script creates a detailed log file:

- `setup-all.log` - For the combined setup
- `server-setup.log` - For server-specific setup
- `client-setup.log` - For client-specific setup

### Common Issues

1. **Permission Denied**: If you get permission errors, ensure the scripts are executable:
   ```bash
   chmod +x setup-all.js setup-server.js setup-client.js
   ```

2. **Node.js Version**: If you encounter compatibility issues, check your Node.js version:
   ```bash
   node --version
   ```

3. **MongoDB Connection**: If the server fails to connect to MongoDB, ensure MongoDB is running or check the connection string in the server's `.env` file.

4. **Port Conflicts**: If ports are already in use, modify the `.env` files in both server and client directories.

5. **Dependency Installation Failures**: If npm fails to install dependencies, try running with the `--legacy-peer-deps` flag:
   ```bash
   cd server && npm install --legacy-peer-deps
   ```

### Manual Setup

If the scripts fail, you can perform a manual setup:

1. Server:
   ```bash
   cd server
   npm install
   cp .env.example .env  # Then edit .env with your settings
   ```

2. Client:
   ```bash
   cd client
   npm install
   cp .env.example .env  # Then edit .env with your settings
   ```

## Support

If you continue to experience issues, please:

1. Check the detailed log files
2. Ensure all requirements are met
3. Try running the individual setup scripts instead of the combined one
4. Submit an issue with the log file contents if problems persist 
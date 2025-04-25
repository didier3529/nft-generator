#!/usr/bin/env node

/**
 * NFT Generator Client Setup Script
 * 
 * This script automates the client installation process with robust error handling.
 * It resolves common issues with Solana packages and other dependencies.
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CLIENT_DIR = path.join(__dirname, 'client');
const LOG_FILE = path.join(__dirname, 'client-setup.log');
const MAX_RETRIES = 3;

// Clear or create log file
fs.writeFileSync(LOG_FILE, `NFT Generator Client Setup Log - ${new Date().toISOString()}\n\n`, { flag: 'w' });

/**
 * Logging utility functions
 */
const log = {
  file: (message) => {
    fs.appendFileSync(LOG_FILE, `${message}\n`);
  },
  info: (message) => {
    console.log(`\x1b[36mℹ️  ${message}\x1b[0m`);
    log.file(`[INFO] ${message}`);
  },
  success: (message) => {
    console.log(`\x1b[32m✅ ${message}\x1b[0m`);
    log.file(`[SUCCESS] ${message}`);
  },
  warn: (message) => {
    console.log(`\x1b[33m⚠️  ${message}\x1b[0m`);
    log.file(`[WARNING] ${message}`);
  },
  error: (message, error = null) => {
    console.error(`\x1b[31m❌ ${message}\x1b[0m`);
    log.file(`[ERROR] ${message}`);
    if (error) {
      log.file(`[ERROR DETAILS] ${error instanceof Error ? error.stack : String(error)}`);
    }
  },
  divider: () => {
    console.log('\x1b[90m' + '-'.repeat(80) + '\x1b[0m');
    log.file('-'.repeat(80));
  }
};

/**
 * Execute shell command with proper error handling and logging
 */
const executeCommand = (command, cwd = __dirname, retryCount = 0) => {
  return new Promise((resolve, reject) => {
    log.info(`Executing: ${command} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    log.file(`[COMMAND] ${command} (in ${cwd})`);
    
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        log.file(`[STDERR] ${stderr}`);
        log.file(`[ERROR] Command failed: ${error.message}`);
        
        if (retryCount < MAX_RETRIES) {
          log.warn(`Command failed, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            executeCommand(command, cwd, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, 2000); // Wait 2 seconds before retry
        } else {
          log.error(`Command failed after ${MAX_RETRIES + 1} attempts`);
          reject(error);
        }
      } else {
        log.file(`[STDOUT] ${stdout}`);
        log.success(`Command completed successfully`);
        resolve(stdout);
      }
    });
  });
};

/**
 * Check if client directory exists and package.json is valid
 */
const validateClientDirectory = () => {
  log.info('Validating client directory structure...');
  
  if (!fs.existsSync(CLIENT_DIR)) {
    log.error(`Client directory not found at: ${CLIENT_DIR}`);
    throw new Error('Client directory not found');
  }

  const packageJsonPath = path.join(CLIENT_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log.error(`package.json not found in client directory`);
    throw new Error('package.json not found');
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.name || !packageJson.dependencies) {
      log.error('Invalid package.json structure');
      throw new Error('Invalid package.json');
    }
    log.success('Client directory validated successfully');
  } catch (error) {
    log.error('Error parsing package.json', error);
    throw new Error('Invalid package.json format');
  }
};

/**
 * Clean node_modules and package-lock.json
 */
const cleanInstallation = async () => {
  log.info('Cleaning previous installation if exists...');
  
  try {
    if (fs.existsSync(path.join(CLIENT_DIR, 'node_modules'))) {
      await executeCommand('rm -rf node_modules', CLIENT_DIR);
    }
    
    if (fs.existsSync(path.join(CLIENT_DIR, 'package-lock.json'))) {
      await executeCommand('rm package-lock.json', CLIENT_DIR);
    }
    
    log.success('Clean-up completed');
  } catch (error) {
    log.warn('Clean-up had some issues, but we can proceed', error);
    // Non-critical error, we can continue
  }
};

/**
 * Update package.json to fix Solana dependencies versions
 */
const updateSolanaDependencies = () => {
  log.info('Updating Solana dependencies to compatible versions...');
  
  const packageJsonPath = path.join(CLIENT_DIR, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Define fixed versions for problematic packages
  const fixedVersions = {
    '@solana/web3.js': '^1.73.0',
    '@solana/wallet-adapter-react': '^0.15.32',
    '@solana/wallet-adapter-react-ui': '^0.9.31',
    '@solana/wallet-adapter-base': '^0.9.22',
    '@solana/wallet-adapter-wallets': '^0.19.16',
    'nft.storage': '^7.0.3',
    // Add any other packages that need fixed versions
  };
  
  let updated = false;
  
  // Update dependencies
  for (const [pkg, version] of Object.entries(fixedVersions)) {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      if (packageJson.dependencies[pkg] !== version) {
        log.info(`Updating ${pkg} from ${packageJson.dependencies[pkg]} to ${version}`);
        packageJson.dependencies[pkg] = version;
        updated = true;
      }
    }
  }
  
  if (updated) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    log.success('Updated package.json with compatible dependency versions');
  } else {
    log.info('No dependency updates needed');
  }
  
  return updated;
};

/**
 * Install dependencies
 */
const installDependencies = async () => {
  log.info('Installing client dependencies...');
  log.divider();
  
  try {
    // First try with npm ci for clean install
    await executeCommand('npm ci', CLIENT_DIR);
  } catch (error) {
    log.warn('npm ci failed, falling back to npm install');
    try {
      // If npm ci fails, try npm install
      await executeCommand('npm install', CLIENT_DIR);
    } catch (secondError) {
      log.error('Installation failed, trying one more approach with specific flags');
      try {
        // Last resort with --legacy-peer-deps
        await executeCommand('npm install --legacy-peer-deps', CLIENT_DIR);
      } catch (finalError) {
        log.error('All installation attempts failed', finalError);
        throw new Error('Dependencies installation failed');
      }
    }
  }
  
  log.divider();
  log.success('Dependencies installed successfully');
};

/**
 * Create environment file with default development values
 */
const createEnvFile = () => {
  log.info('Creating development environment configuration...');
  
  const envPath = path.join(CLIENT_DIR, '.env.local');
  const envContent = `# NFT Generator Environment Configuration
# Created by setup script on ${new Date().toISOString()}

# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Solana Configuration
REACT_APP_SOLANA_NETWORK=devnet
REACT_APP_SOLANA_RPC_HOST=https://api.devnet.solana.com

# NFT.Storage (Get your key at https://nft.storage)
# REACT_APP_NFT_STORAGE_API_KEY=your_api_key_here

# Feature Flags
REACT_APP_ENABLE_SOLANA_FEATURES=true
REACT_APP_DEBUG_MODE=true

# Add any other environment variables your application needs
`;

  fs.writeFileSync(envPath, envContent, 'utf8');
  log.success(`Environment file created at: ${envPath}`);
};

/**
 * Fix any known post-installation issues
 */
const runPostInstallFixes = async () => {
  log.info('Running post-installation fixes...');
  
  // Fix specific issues that might occur after installation
  // For example, patching files or running additional commands
  
  // Example: Fix potential Solana dependency issues with patch-package
  try {
    // Placeholder for specific fixes if needed
    log.success('Post-installation fixes completed');
  } catch (error) {
    log.warn('Some post-installation fixes failed, but we can proceed', error);
    // Non-critical error, we can continue
  }
};

/**
 * Main setup function
 */
const setupClient = async () => {
  let startTime = Date.now();
  log.info('Starting NFT Generator client setup...');
  log.divider();
  
  try {
    // Step 1: Validate client directory
    validateClientDirectory();
    
    // Step 2: Clean previous installation
    await cleanInstallation();
    
    // Step 3: Update package.json if needed
    updateSolanaDependencies();
    
    // Step 4: Install dependencies
    await installDependencies();
    
    // Step 5: Create environment file
    createEnvFile();
    
    // Step 6: Run post-installation fixes
    await runPostInstallFixes();
    
    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log.divider();
    log.success(`Client setup completed successfully in ${duration} seconds!`);
    log.info('You can now run the client with: cd client && npm start');
    
    return true;
  } catch (error) {
    log.divider();
    log.error('Client setup failed', error);
    log.info(`Check the log file for details: ${LOG_FILE}`);
    log.info('You may need to manually fix the issues and retry');
    
    return false;
  }
};

// Run the setup process
setupClient().then(success => {
  if (!success) {
    process.exit(1);
  }
}); 
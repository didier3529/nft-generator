#!/usr/bin/env node

/**
 * NFT Generator Server Setup Script
 * 
 * This script automates the server installation process with robust error handling.
 * It handles package installation, database configuration, and environment setup.
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const SERVER_DIR = path.join(__dirname, 'server');
const LOG_FILE = path.join(__dirname, 'server-setup.log');
const MAX_RETRIES = 3;

// Clear or create log file
fs.writeFileSync(LOG_FILE, `NFT Generator Server Setup Log - ${new Date().toISOString()}\n\n`, { flag: 'w' });

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
 * Check if server directory exists and package.json is valid
 */
const validateServerDirectory = () => {
  log.info('Validating server directory structure...');
  
  if (!fs.existsSync(SERVER_DIR)) {
    log.error(`Server directory not found at: ${SERVER_DIR}`);
    throw new Error('Server directory not found');
  }

  const packageJsonPath = path.join(SERVER_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log.error(`package.json not found in server directory`);
    throw new Error('package.json not found');
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.name || !packageJson.dependencies) {
      log.error('Invalid package.json structure');
      throw new Error('Invalid package.json');
    }
    log.success('Server directory validated successfully');
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
    if (fs.existsSync(path.join(SERVER_DIR, 'node_modules'))) {
      await executeCommand('rm -rf node_modules', SERVER_DIR);
    }
    
    if (fs.existsSync(path.join(SERVER_DIR, 'package-lock.json'))) {
      await executeCommand('rm package-lock.json', SERVER_DIR);
    }
    
    log.success('Clean-up completed');
  } catch (error) {
    log.warn('Clean-up had some issues, but we can proceed', error);
    // Non-critical error, we can continue
  }
};

/**
 * Install dependencies
 */
const installDependencies = async () => {
  log.info('Installing server dependencies...');
  log.divider();
  
  try {
    // First try with npm ci for clean install
    await executeCommand('npm ci', SERVER_DIR);
  } catch (error) {
    log.warn('npm ci failed, falling back to npm install');
    try {
      // If npm ci fails, try npm install
      await executeCommand('npm install', SERVER_DIR);
    } catch (secondError) {
      log.error('Installation failed, trying one more approach with specific flags');
      try {
        // Last resort with --legacy-peer-deps
        await executeCommand('npm install --legacy-peer-deps', SERVER_DIR);
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
  
  const envPath = path.join(SERVER_DIR, '.env');
  const envContent = `# NFT Generator Server Environment Configuration
# Created by setup script on ${new Date().toISOString()}

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_TYPE=mongodb
DB_URI=mongodb://localhost:27017/nft-generator
# Uncomment if using a connection string with auth
# DB_URI=mongodb+srv://username:password@cluster.mongodb.net/nft-generator

# JWT Authentication
JWT_SECRET=change_this_to_a_secure_random_string_in_production
JWT_EXPIRATION=24h

# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com

# NFT.Storage (Get your key at https://nft.storage)
# NFT_STORAGE_API_KEY=your_api_key_here

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000

# Logging Level (error, warn, info, http, verbose, debug, silly)
LOG_LEVEL=info

# Add any other environment variables your application needs
`;

  fs.writeFileSync(envPath, envContent, 'utf8');
  log.success(`Environment file created at: ${envPath}`);
};

/**
 * Create default MongoDB configuration and data directory if needed
 */
const setupDatabase = async () => {
  log.info('Setting up database configuration...');
  
  const configDir = path.join(SERVER_DIR, 'config');
  
  // Create config directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    log.info('Created config directory');
  }

  // Create data directory for local MongoDB if needed
  const dataDir = path.join(SERVER_DIR, 'data', 'db');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    log.info('Created data directory for local MongoDB storage');
  }
  
  // Check if MongoDB is installed for local development
  try {
    await executeCommand('mongod --version', __dirname, 0);
    log.success('MongoDB is installed and available');
  } catch (error) {
    log.warn('MongoDB may not be installed or not in PATH. If you plan to use a local database, please install MongoDB.');
    log.info('For cloud-based MongoDB, update the DB_URI in the .env file.');
  }
  
  log.success('Database configuration completed');
};

/**
 * Fix any known post-installation issues
 */
const runPostInstallFixes = async () => {
  log.info('Running post-installation fixes...');
  
  // Check if server has required directories
  const dirs = [
    path.join(SERVER_DIR, 'uploads'),
    path.join(SERVER_DIR, 'logs')
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.info(`Created directory: ${path.relative(SERVER_DIR, dir)}`);
    }
  }
  
  log.success('Post-installation fixes completed');
};

/**
 * Run basic tests to verify the server installation
 */
const verifyInstallation = async () => {
  log.info('Verifying server installation...');
  
  try {
    // Check if critical packages are installed properly
    const nodeModulesDir = path.join(SERVER_DIR, 'node_modules');
    const criticalPackages = ['express', 'mongoose', 'jsonwebtoken'];
    
    let missingPackages = [];
    
    for (const pkg of criticalPackages) {
      if (!fs.existsSync(path.join(nodeModulesDir, pkg))) {
        missingPackages.push(pkg);
      }
    }
    
    if (missingPackages.length > 0) {
      log.warn(`Some critical packages might be missing: ${missingPackages.join(', ')}`);
    } else {
      log.success('All critical packages are installed');
    }
    
    // Try to require main server file to verify syntax
    const mainFile = path.join(SERVER_DIR, 'index.js');
    if (fs.existsSync(mainFile)) {
      try {
        // Just a syntax check, don't actually execute the server
        // This is a simple way to verify the main file has no syntax errors
        execSync(`node --check ${mainFile}`, { stdio: 'pipe' });
        log.success('Server main file syntax is valid');
      } catch (error) {
        log.warn('Server main file might have syntax errors', error);
      }
    }
    
    return true;
  } catch (error) {
    log.error('Verification had some issues', error);
    return false;
  }
};

/**
 * Main setup function
 */
const setupServer = async () => {
  let startTime = Date.now();
  log.info('Starting NFT Generator server setup...');
  log.divider();
  
  try {
    // Step 1: Validate server directory
    validateServerDirectory();
    
    // Step 2: Clean previous installation
    await cleanInstallation();
    
    // Step 3: Install dependencies
    await installDependencies();
    
    // Step 4: Create environment file
    createEnvFile();
    
    // Step 5: Setup database configuration
    await setupDatabase();
    
    // Step 6: Run post-installation fixes
    await runPostInstallFixes();
    
    // Step 7: Verify installation
    await verifyInstallation();
    
    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log.divider();
    log.success(`Server setup completed successfully in ${duration} seconds!`);
    log.info('You can now run the server with: cd server && npm start');
    
    return true;
  } catch (error) {
    log.divider();
    log.error('Server setup failed', error);
    log.info(`Check the log file for details: ${LOG_FILE}`);
    log.info('You may need to manually fix the issues and retry');
    
    return false;
  }
};

// Run the setup process
setupServer().then(success => {
  if (!success) {
    process.exit(1);
  }
}); 
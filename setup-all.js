#!/usr/bin/env node

/**
 * NFT Generator Complete Setup Script
 * 
 * This script orchestrates the setup of both server and client components
 * of the NFT Generator application, running them sequentially with proper
 * error handling and reporting.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CLIENT_SETUP_SCRIPT = path.join(__dirname, 'setup-client.js');
const SERVER_SETUP_SCRIPT = path.join(__dirname, 'setup-server.js');
const LOG_FILE = path.join(__dirname, 'setup-all.log');

// Clear or create log file
fs.writeFileSync(LOG_FILE, `NFT Generator Complete Setup Log - ${new Date().toISOString()}\n\n`, { flag: 'w' });

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
  },
  header: (message) => {
    log.divider();
    console.log(`\x1b[1;35m${message}\x1b[0m`);
    log.file(`\n[HEADER] ${message}`);
    log.divider();
  }
};

/**
 * Run a setup script as a child process
 */
const runSetupScript = (scriptPath, componentName) => {
  return new Promise((resolve, reject) => {
    log.info(`Starting ${componentName} setup...`);
    log.file(`[EXECUTE] ${scriptPath}`);
    
    // Make sure script has execute permissions
    try {
      fs.chmodSync(scriptPath, '755');
    } catch (error) {
      log.warn(`Could not set execute permissions on ${scriptPath}`, error);
    }
    
    const startTime = Date.now();
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit' // Pass I/O to parent process
    });
    
    child.on('error', (error) => {
      log.error(`Failed to start ${componentName} setup process`, error);
      reject(error);
    });
    
    child.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      if (code === 0) {
        log.success(`${componentName} setup completed successfully in ${duration} seconds`);
        resolve(true);
      } else {
        log.error(`${componentName} setup failed with exit code ${code}`);
        resolve(false); // Resolve with false to continue with next setup
      }
    });
  });
};

/**
 * Check if setup scripts exist
 */
const validateSetupScripts = () => {
  if (!fs.existsSync(CLIENT_SETUP_SCRIPT)) {
    log.error(`Client setup script not found at: ${CLIENT_SETUP_SCRIPT}`);
    throw new Error('Client setup script not found');
  }
  
  if (!fs.existsSync(SERVER_SETUP_SCRIPT)) {
    log.error(`Server setup script not found at: ${SERVER_SETUP_SCRIPT}`);
    throw new Error('Server setup script not found');
  }
  
  log.success('Setup scripts validated');
};

/**
 * Run all setup processes
 */
const runAllSetups = async () => {
  const startTime = Date.now();
  
  log.header('NFT GENERATOR COMPLETE SETUP');
  log.info('This script will set up both the server and client components');
  
  try {
    // Validate setup scripts
    validateSetupScripts();
    
    // Run server setup first
    log.header('SERVER SETUP');
    const serverSuccess = await runSetupScript(SERVER_SETUP_SCRIPT, 'Server');
    
    // Run client setup
    log.header('CLIENT SETUP');
    const clientSuccess = await runSetupScript(CLIENT_SETUP_SCRIPT, 'Client');
    
    // Show summary
    log.header('SETUP SUMMARY');
    
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    log.info(`Total setup time: ${totalDuration} seconds`);
    
    if (serverSuccess && clientSuccess) {
      log.success('Both server and client were set up successfully!');
      log.info('You can now start the application:');
      log.info('  1. Start the server: cd server && npm start');
      log.info('  2. In a new terminal, start the client: cd client && npm start');
      return 0;
    } else {
      log.warn('Setup completed with issues:');
      if (!serverSuccess) log.error('- Server setup had errors');
      if (!clientSuccess) log.error('- Client setup had errors');
      log.info('Please check the individual log files for details:');
      log.info('- Server: server-setup.log');
      log.info('- Client: client-setup.log');
      log.info('- Complete: setup-all.log (this file)');
      return 1;
    }
  } catch (error) {
    log.error('Setup failed with an unexpected error', error);
    log.info(`Check the log file for details: ${LOG_FILE}`);
    return 1;
  }
};

// Run the complete setup process
runAllSetups().then(exitCode => {
  process.exit(exitCode);
}); 
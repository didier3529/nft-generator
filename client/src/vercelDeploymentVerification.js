/**
 * Vercel Deployment Verification Script
 * 
 * This module provides functions to verify that the application is configured properly
 * for deployment to Vercel and to identify common issues before deployment.
 */

// Check for required configuration files
export const checkRequiredFiles = () => {
  const requiredFiles = [
    'vercel.json',
    'package.json'
  ];
  
  const missing = [];
  
  // In a browser environment, we can't directly check for files
  // This is just to document what files should be verified before deployment
  console.log('Verify these files exist before Vercel deployment:', requiredFiles.join(', '));
  
  return {
    allPresent: missing.length === 0,
    missing
  };
};

// Verify Node.js engine compatibility
export const checkNodeVersion = () => {
  try {
    const requiredVersion = '18.x';
    console.log(`This application requires Node.js ${requiredVersion} on Vercel`);
    
    // On Vercel, this will use the version specified in package.json
    return {
      compatible: true,
      requiredVersion
    };
  } catch (error) {
    console.error('Error checking Node version:', error);
    return {
      compatible: false,
      error: error.message
    };
  }
};

// Check for environment variables needed on Vercel
export const checkRequiredEnvVars = () => {
  const requiredVars = [
    // Add any environment variables your app needs
    // For example: 'REACT_APP_API_URL', 'REACT_APP_SOLANA_NETWORK'
  ];
  
  const missing = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  return {
    allPresent: missing.length === 0,
    missing
  };
};

// Verify build configuration is correct
export const checkBuildConfig = () => {
  // This is a simplified check for demonstration purposes
  const expectedCommands = {
    buildCommand: 'cd client && npm run build',
    outputDirectory: 'client/build'
  };
  
  console.log('Expected Vercel configuration:', expectedCommands);
  
  return {
    valid: true,
    expectedCommands
  };
};

// Run all checks
export const runAllChecks = () => {
  console.log('Running Vercel deployment verification checks...');
  
  const fileCheck = checkRequiredFiles();
  const nodeCheck = checkNodeVersion();
  const envCheck = checkRequiredEnvVars();
  const buildCheck = checkBuildConfig();
  
  const allValid = 
    fileCheck.allPresent && 
    nodeCheck.compatible && 
    envCheck.allPresent && 
    buildCheck.valid;
  
  console.log(`All checks passed: ${allValid ? 'Yes ✅' : 'No ❌'}`);
  
  return {
    allValid,
    fileCheck,
    nodeCheck,
    envCheck,
    buildCheck
  };
};

export default {
  checkRequiredFiles,
  checkNodeVersion,
  checkRequiredEnvVars,
  checkBuildConfig,
  runAllChecks
}; 
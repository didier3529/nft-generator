// This script ensures that craco is installed
// It's used in the build command for Vercel deployment

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Paths
const packageJsonPath = path.join(__dirname, 'package.json');
const nodeModulesPath = path.join(__dirname, 'node_modules', '@craco');

console.log('Checking for @craco/craco...');

// Check if craco is already installed in node_modules
let needsInstall = false;
if (!fs.existsSync(nodeModulesPath)) {
  console.log('@craco/craco not found in node_modules, will install');
  needsInstall = true;
} else {
  console.log('@craco/craco found in node_modules');
}

// Check if it's in package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (!packageJson.dependencies['@craco/craco']) {
    console.log('@craco/craco not found in package.json dependencies, will install');
    needsInstall = true;
  } else {
    console.log(`@craco/craco found in package.json: ${packageJson.dependencies['@craco/craco']}`);
  }
} catch (error) {
  console.error('Error reading package.json:', error);
  needsInstall = true;
}

// Install if needed
if (needsInstall) {
  console.log('Installing @craco/craco...');
  try {
    execSync('npm install @craco/craco --save', { stdio: 'inherit' });
    console.log('@craco/craco installed successfully');
  } catch (error) {
    console.error('Error installing @craco/craco:', error);
    process.exit(1);
  }
} else {
  console.log('No installation needed, @craco/craco is already installed');
}

console.log('Setup complete!'); 
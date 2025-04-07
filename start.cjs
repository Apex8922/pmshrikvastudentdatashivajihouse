// This is a special starter script for ES modules in production
// It handles ESM compatibility issues with platforms like Render
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log startup information
console.log('===============================================');
console.log('Starting application in production mode (ESM)...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  // Don't log sensitive information like DATABASE_URL
  DATABASE_URL_EXISTS: !!process.env.DATABASE_URL
});

// Add debug info for dist directory
const distPath = path.join(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.js');

console.log('Checking distribution files...');
console.log('Looking for dist directory at:', distPath);
console.log('Looking for index.js at:', indexPath);

try {
  if (fs.existsSync(distPath)) {
    console.log('✓ dist directory exists');
    console.log('Files in dist directory:');
    fs.readdirSync(distPath).forEach(file => {
      console.log('  - ' + file);
    });
  } else {
    console.log('✗ dist directory DOES NOT exist');
  }
  
  if (fs.existsSync(indexPath)) {
    console.log('✓ index.js exists');
    
    // Check if it contains ESM syntax
    const content = fs.readFileSync(indexPath, 'utf8').slice(0, 500); // Just check the beginning
    console.log('File starts with:', content.substring(0, 100).replace(/\n/g, ' ').trim());
    
    if (content.includes('export ') || content.includes('import ')) {
      console.log('✓ File appears to use ESM syntax');
    } else {
      console.log('⚠ File might not use ESM syntax - check content');
    }
  } else {
    console.log('✗ index.js DOES NOT exist');
  }
} catch (err) {
  console.error('Error checking files:', err);
}

// Ensure necessary environment variables
const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: process.env.PORT || '10000'  // Ensure PORT is set
};

console.log('Starting Node.js with --experimental-modules flag to support ESM');
console.log('===============================================');

// Run with explicit ESM support
const startProcess = spawn('node', [
  '--experimental-modules',  // Ensure ESM compatibility
  '--no-warnings',           // Reduce noise
  indexPath
], {
  stdio: 'inherit',
  env: env
});

startProcess.on('error', (err) => {
  console.error('Failed to start process:', err);
  process.exit(1);
});

startProcess.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  process.exit(code);
});
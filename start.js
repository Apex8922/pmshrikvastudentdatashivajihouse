// Simple CommonJS starter for production
// This helps work around potential ESM issues in some environments
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting application in production mode...');

// Add debug info
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.js');

console.log('Current directory:', __dirname);
console.log('Looking for dist directory at:', distPath);
console.log('Looking for index.js at:', indexPath);

try {
  if (fs.existsSync(distPath)) {
    console.log('dist directory exists');
    console.log('Files in dist directory:');
    fs.readdirSync(distPath).forEach(file => {
      console.log('  - ' + file);
    });
  } else {
    console.log('dist directory DOES NOT exist');
  }
  
  if (fs.existsSync(indexPath)) {
    console.log('index.js exists');
  } else {
    console.log('index.js DOES NOT exist');
  }
} catch (err) {
  console.error('Error checking files:', err);
}

// Run the actual start command
const startProcess = spawn('node', [indexPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '10000'  // Ensure PORT is set
  }
});

startProcess.on('error', (err) => {
  console.error('Failed to start process:', err);
  process.exit(1);
});

startProcess.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  process.exit(code);
});
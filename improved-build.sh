#!/bin/bash
# exit on error
set -o errexit

echo "Starting improved build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci || npm install

# Build the frontend
echo "Building frontend..."
npx vite build

# Build the server with CommonJS format
echo "Building server with CommonJS format..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=cjs --outfile=dist/index.cjs

# Create a small wrapper to run the CommonJS file
echo "Creating starter script..."
echo "// CommonJS wrapper
require('./index.cjs');" > dist/index.js

# Run the database setup script
echo "Setting up database..."
node scripts/setup-db.js

echo "Build process completed successfully!"
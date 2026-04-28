#!/bin/bash

# Build script for deployment
echo "Building Pollyfort application for deployment..."

# Run the custom build script
node build.js

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Verify deployment structure
echo "Verifying deployment structure..."

# Check if index.html exists in dist root
if [ -f "dist/index.html" ]; then
    echo "✓ index.html found in dist root"
else
    echo "✗ index.html not found in dist root - deployment may fail"
    exit 1
fi

# Check if server bundle exists
if [ -f "dist/index.js" ]; then
    echo "✓ Server bundle found"
else
    echo "✗ Server bundle not found"
fi

# List dist contents for verification
echo "Deployment directory contents:"
ls -la dist/

echo "Build preparation completed successfully!"
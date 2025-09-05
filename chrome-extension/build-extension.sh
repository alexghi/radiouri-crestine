#!/bin/bash

# Build script for Radio Crestin Chrome Extension

echo "Building Chrome Extension..."

# Clean dist directory
rm -rf dist/*

# Build the project
npm run build

# Copy necessary files
cp manifest.json dist/
cp -r icons dist/

# Copy offscreen.html manually and move popup.html to root
cp src/offscreen.html dist/
mv dist/src/popup.html dist/
rmdir dist/src

echo "Extension built successfully!"
echo "Load the extension by:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo ""
echo "Extension files are ready in: $(pwd)/dist"

#!/bin/bash

# Build script for Radio Crestin Chrome Extension - Creates zip package for Chrome Web Store submission

set -e  # Exit on any error

echo "🚀 Building Chrome Extension Package for Submission..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/*
rm -f radio-crestin-extension-*.zip

# Build the project
echo "📦 Building extension..."
npm run build

# Copy necessary files
echo "📋 Copying extension files..."
cp manifest.json dist/
cp -r icons dist/

# Copy offscreen.html manually and move popup.html to root
cp src/offscreen.html dist/
mv dist/src/popup.html dist/
rmdir dist/src 2>/dev/null || true

# Read version from manifest.json
VERSION=$(node -p "require('./manifest.json').version")
echo "📌 Extension version: $VERSION"

# Create zip package
ZIP_NAME="radio-crestin-extension-v${VERSION}.zip"
echo "🗜️  Creating zip package: $ZIP_NAME"

cd dist
zip -r ../$ZIP_NAME . -x "*.DS_Store" "*__MACOSX*"
cd ..

# Get file size
FILE_SIZE=$(du -h "$ZIP_NAME" | cut -f1)

echo ""
echo "✅ Extension package built successfully!"
echo "📦 Package: $ZIP_NAME ($FILE_SIZE)"
echo "📍 Location: $(pwd)/$ZIP_NAME"
echo ""
echo "📋 Next steps for Chrome Web Store submission:"
echo "   1. Go to https://chrome.google.com/webstore/devconsole"
echo "   2. Upload the zip file: $ZIP_NAME"
echo "   3. Fill out the store listing details"
echo "   4. Submit for review"
echo ""
echo "🔍 Package contents:"
unzip -l "$ZIP_NAME" | grep -v "Archive:" | grep -v "Length" | grep -v "^\-\-" | grep -v "files$"
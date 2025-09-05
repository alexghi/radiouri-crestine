#!/bin/bash

# Image resize script for Chrome Web Store images
# Resizes @2x images from 4K displays to correct Chrome Web Store dimensions
# Requires ImageMagick (brew install imagemagick)
# Looks for images in screenshots/ folder

echo "🖼️  Starting image resize process for Chrome Web Store..."

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "❌ Error: ImageMagick is not installed"
    echo "Install with: brew install imagemagick"
    exit 1
fi

# Check if screenshots directory exists
if [ ! -d "screenshots" ]; then
    echo "❌ Error: screenshots/ directory not found"
    echo "Please create screenshots/ directory and place your captured images there"
    exit 1
fi

# Create output directory inside screenshots/
mkdir -p screenshots/resized

echo "📁 Looking for images in screenshots/ directory..."

# Resize @2x screenshots from 4K display (2560x1600 → 1280x800)
echo "📸 Resizing screenshots from @2x to standard dimensions..."

# Check if screenshot files exist and resize them
if [ -f "screenshots/1.png" ]; then
    magick screenshots/1.png -resize 1280x800! screenshots/resized/1_resized.png
    echo "✅ screenshots/1.png → screenshots/resized/1_resized.png (1280x800)"
else
    echo "⚠️  screenshots/1.png not found, skipping..."
fi

if [ -f "screenshots/2.png" ]; then
    magick screenshots/2.png -resize 1280x800! screenshots/resized/2_resized.png
    echo "✅ screenshots/2.png → screenshots/resized/2_resized.png (1280x800)"
else
    echo "⚠️  screenshots/2.png not found, skipping..."
fi

if [ -f "screenshots/3.png" ]; then
    magick screenshots/3.png -resize 1280x800! screenshots/resized/3_resized.png
    echo "✅ screenshots/3.png → screenshots/resized/3_resized.png (1280x800)"
else
    echo "⚠️  screenshots/3.png not found, skipping..."
fi

if [ -f "screenshots/4.png" ]; then
    magick screenshots/4.png -resize 1280x800! screenshots/resized/4_resized.png
    echo "✅ screenshots/4.png → screenshots/resized/4_resized.png (1280x800)"
else
    echo "⚠️  screenshots/4.png not found, skipping..."
fi

# Resize promotional images from @2x to standard dimensions
echo "🎨 Resizing promotional images..."

if [ -f "screenshots/marquee_promo.png" ]; then
    magick screenshots/marquee_promo.png -resize 1400x560! screenshots/resized/marquee_promo_resized.png
    echo "✅ screenshots/marquee_promo.png → screenshots/resized/marquee_promo_resized.png (1400x560)"
else
    echo "⚠️  screenshots/marquee_promo.png not found, skipping..."
fi

if [ -f "screenshots/small_promo.png" ]; then
    magick screenshots/small_promo.png -resize 440x280! screenshots/resized/small_promo_resized.png
    echo "✅ screenshots/small_promo.png → screenshots/resized/small_promo_resized.png (440x280)"
else
    echo "⚠️  screenshots/small_promo.png not found, skipping..."
fi

# Create zip file for easy upload
echo "📦 Creating zip file..."
cd screenshots/resized
zip -r ../../chrome-web-store-images.zip *.png
cd ../..

echo ""
echo "🎉 Done! All resized images are ready for Chrome Web Store upload!"
echo ""
echo "📁 Files created in 'screenshots/resized' folder:"
ls -la screenshots/resized/ 2>/dev/null | grep "\.png" | awk '{print "   " $9 " (" $5 " bytes)"}'

echo ""
echo "📦 Zip file created: chrome-web-store-images.zip"
echo ""
echo "📋 Next steps:"
echo "   1. Upload the resized images to Chrome Web Store"
echo "   2. Screenshots: Use 1_resized.png through 4_resized.png"
echo "   3. Small promo tile: Use small_promo_resized.png"
echo "   4. Marquee promo tile: Use marquee_promo_resized.png"
echo ""
echo "ℹ️  Note: The ! flag forces exact dimensions (may crop/stretch)"
echo "   Remove ! if you prefer proportional scaling with padding"

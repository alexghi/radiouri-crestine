# Chrome Web Store Screenshots Guide

I've created professional mockup screenshots for your Chrome Web Store submission. Here's how to capture them:

## 📸 Quick Setup

1. **Open the mockup file**:
   ```bash
   open create-screenshots.html
   ```
   Or drag the `create-screenshots.html` file into your browser.

2. **Set browser window size** (important for consistent results):
   - Open browser dev tools (F12)
   - Click the device toolbar icon (📱)
   - Set custom size: **1280 x 800** for screenshots, **440 x 280** for small promo, **1400 x 560** for marquee promo
   - Close dev tools

3. **4K Display Considerations**:
   - Since you're on a 4K display, the images will be rendered @2x resolution
   - Screenshots will be captured at 2560x1600, small promo at 880x560, marquee at 2800x1120
   - **Use the resize script** (see below) to convert these to correct Chrome Web Store dimensions
   - This results in crisp, high-quality images on all displays

## 🖼️ Screenshot Requirements

Chrome Web Store requires:
- **Screenshots**: 1280x800 pixels (exactly) - Minimum 1, maximum 5 screenshots
- **Small Promo Tile**: 440x280 pixels (exactly) - Optional promotional image
- **Marquee Promo Tile**: 1400x560 pixels (exactly) - Featured promotional image
- **Format**: PNG or JPEG
- **Quality**: High resolution, no compression artifacts

## 📋 Ready-Made Assets

I've created 6 professional assets covering all extension features and promotional needs:

### 1. **Main Player Interface** 
- Shows the primary player with station playing
- Features: Play/pause controls, volume, station info
- Current song display with artist information
- Favorite button (remove state)

### 2. **Favorites Management**
- Displays user's saved favorite stations
- Shows favorites count in action
- Heart icons for adding/removing favorites
- Clean list view with station artwork

### 3. **Browse All Stations**
- Complete station directory view
- Mix of favorited and non-favorited stations
- Station artwork and current song info
- Add to favorites functionality visible

### 4. **Streaming & Controls**
- Loading state during stream connection
- Volume controls and mute functionality
- Station switching capabilities
- Add to favorites (empty state)

### 5. **Small Promo Tile (440x280)**
- Compact promotional image for the Chrome Web Store
- Features app icon, title, and key benefit
- Clean, minimal design with purple gradient background
- Perfect for store discovery and app listings

### 6. **Marquee Promo Tile (1400x560)**
- Large featured promotional banner
- Showcases app benefits with mini extension preview
- Professional marketing-style layout
- Ideal for featured placement on the Chrome Web Store

## 💾 How to Capture

### Method 1: Browser Screenshot (Recommended)

1. **Open the HTML file** in Chrome
2. **Right-click** on any screenshot area
3. **Select "Inspect Element"**
4. **Right-click** on the screenshot container in dev tools
5. **Choose "Capture node screenshot"**
6. **Save** with the suggested filename

### Method 2: Screen Capture Tool

1. **Open the HTML file** in full-screen browser
2. **Use your favorite screenshot tool**:
   - macOS: **Shift+Cmd+4** (select area)
   - Windows: **Snipping Tool** or **Win+Shift+S**
   - Linux: **Flameshot** or **GNOME Screenshot**
3. **Crop** to exactly 1280x800 pixels
4. **Save** as PNG format

### Method 3: Browser Extension

Use a browser extension like:
- **Awesome Screenshot**
- **Lightshot**
- **Nimbus Screenshot**

## 🔧 Resize Images (4K Display Users)

Since you're on a 4K display, captured images will be @2x resolution. Use the provided script to resize them:

### **Automatic Resize Script**

1. **Save your captured images** in the `screenshots/` folder with these names:
   - `screenshots/1.png`, `screenshots/2.png`, `screenshots/3.png`, `screenshots/4.png` (screenshots)
   - `screenshots/small_promo.png` (small promotional tile)
   - `screenshots/marquee_promo.png` (marquee promotional tile)

2. **Run the resize script**:
   ```bash
   ./resize-images.sh
   ```

3. **Script requirements**:
   - ImageMagick must be installed (`brew install imagemagick`)
   - Screenshots must be placed in the `screenshots/` folder
   - Run the script from the root directory (where `resize-images.sh` is located)

### **What the script does**:
- ✅ Resizes screenshots from 2560x1600 → 1280x800
- ✅ Resizes small promo from 880x560 → 440x280  
- ✅ Resizes marquee promo from 2800x1120 → 1400x560
- ✅ Creates `resized_images/` folder with properly sized files
- ✅ Generates `chrome-web-store-images.zip` for easy upload
- ✅ Maintains high quality with exact dimension forcing

### **Manual Resize (Alternative)**

If you prefer manual resizing:
```bash
# Screenshots (2560x1600 → 1280x800)
magick screenshot.png -resize 1280x800! screenshot_resized.png

# Small promo (880x560 → 440x280) 
magick small_promo.png -resize 440x280! small_promo_resized.png

# Marquee promo (2800x1120 → 1400x560)
magick marquee_promo.png -resize 1400x560! marquee_promo_resized.png
```

## 📝 Suggested Filenames

Save your assets with descriptive names:

**For Capture (before resize - save in screenshots/ folder):**
- `screenshots/1.png`, `screenshots/2.png`, `screenshots/3.png`, `screenshots/4.png` (screenshots)
- `screenshots/small_promo.png` (small promotional tile)
- `screenshots/marquee_promo.png` (marquee promotional tile)

**After Resize (for Chrome Web Store upload):**
1. `1_resized.png` → `radio-crestin-main-player.png`
2. `2_resized.png` → `radio-crestin-favorites.png`
3. `3_resized.png` → `radio-crestin-all-stations.png`
4. `4_resized.png` → `radio-crestin-streaming.png`
5. `small_promo_resized.png` → `radio-crestin-promo-small.png`
6. `marquee_promo_resized.png` → `radio-crestin-promo-marquee.png`

## ✅ Chrome Web Store Upload

When uploading to Chrome Web Store:

1. **Go to** [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. **Navigate to** your extension listing
3. **Click** "Store Listing" tab

### Screenshots Section:
4. **Scroll to** "Screenshots" section
5. **Upload** all 4 screenshots
6. **Add captions** (optional but recommended):
   - "Stream Christian radio with easy controls"
   - "Manage your favorite stations"
   - "Browse all available Christian radio stations"
   - "High-quality audio streaming"

### Promotional Images Section:
7. **Scroll to** "Promotional images" section
8. **Upload Small promo tile** (440x280): `radio-crestin-promo-small.png`
9. **Upload Marquee promo tile** (1400x560): `radio-crestin-promo-marquee.png`
10. These promotional images help your extension get featured and improve visibility in the Chrome Web Store

## 🎨 Screenshot Features Highlighted

✅ **Professional UI**: Clean, modern dark theme  
✅ **Brand Consistency**: Matches your extension's actual design  
✅ **Feature Showcase**: All major functionality visible  
✅ **User Flow**: Logical progression through the app  
✅ **Visual Appeal**: Attractive gradients and realistic mockups  
✅ **Proper Sizing**: Exact Chrome Web Store requirements  

## 📐 Technical Specifications Met

- **Resolution**: 1280x800 pixels
- **Aspect Ratio**: 16:10 (Chrome Web Store standard)
- **File Format**: PNG (lossless quality)
- **Color Profile**: sRGB (web standard)
- **Content**: Family-friendly Christian radio content
- **UI Elements**: All functional components visible

## 🔍 Quality Check

Before uploading, verify each screenshot:

- [ ] **Size is exactly 1280x800 pixels**
- [ ] **No blur or compression artifacts**
- [ ] **All text is readable**
- [ ] **Colors match your extension**
- [ ] **No personal information visible**
- [ ] **Professional appearance**

Your screenshots are now ready for Chrome Web Store submission! They showcase all the key features of your Radio Crestin extension in a professional, appealing way.

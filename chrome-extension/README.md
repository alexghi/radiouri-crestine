# Radio Crestin Chrome Extension

A compact Chrome extension based on the Radio Crestin player, featuring favorite stations for quick access to Christian radio stations.

## Features

- 🎵 **Compact Player**: Clean, minimized interface perfect for a browser extension
- ❤️ **Favorites System**: Add stations to favorites for quick access
- 🎛️ **Full Controls**: Play/pause, station navigation, volume control, and mute
- 📻 **Station List**: Browse all available stations
- 🔄 **Seamless Streaming**: Supports multiple audio formats including HLS and MP3
- 💾 **Persistent Storage**: Favorites are saved using Chrome's sync storage

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build-extension
   ```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

### Available Scripts

- `npm run dev` - Development build with watch mode
- `npm run build` - Production build
- `npm run build-extension` - Complete extension build (includes copying manifest and icons)

## Project Structure

```
chrome-extension/
├── src/
│   ├── components/          # React components
│   │   ├── ExtensionPlayer.tsx  # Main player component
│   │   ├── StationControls.tsx  # Play/pause and navigation
│   │   ├── StationDisplay.tsx   # Station info display
│   │   └── VolumeControl.tsx    # Volume slider and mute
│   ├── hooks/              # Custom React hooks
│   │   ├── useAudioPlayer.ts    # Audio playback logic
│   │   ├── useFavorites.ts      # Favorites management
│   │   └── useStations.ts       # Station data fetching
│   ├── types.ts            # TypeScript types
│   ├── popup.tsx           # Extension popup entry point
│   ├── popup.html          # HTML template
│   ├── popup.css           # Styles with Tailwind
│   └── background.ts       # Service worker
├── icons/                  # Extension icons
├── manifest.json          # Chrome extension manifest
└── dist/                  # Built extension files
```

## Extension Permissions

- `storage` - For saving favorite stations
- `activeTab` - For accessing the current tab (if needed)
- `host_permissions` - For accessing Radio Crestin API

## API Integration

The extension connects to the Radio Crestin API at `https://radiocrestin.ro/api` to fetch:
- Station list
- Current playing information
- Stream URLs

## Audio Support

- **HLS Streams**: Primary format using hls.js
- **MP3 Streams**: Fallback for direct audio streams
- **Multiple Sources**: Automatic fallback between different stream URLs
- **Cross-Origin**: Handles CORS for various streaming sources

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Build Configuration

- **Vite**: Build tool with React and TypeScript support
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety and better development experience
- **Chrome Extension Manifest V3**: Latest extension format

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test the extension
5. Submit a pull request

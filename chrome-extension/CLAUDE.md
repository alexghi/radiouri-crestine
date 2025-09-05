# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Development build with watch mode for active development
- `npm run build` - Production build using Vite
- `npm run build-extension` - Complete Chrome extension build (includes copying manifest.json and icons to dist/)

## Architecture Overview

This is a Chrome Extension (Manifest V3) that provides a compact radio player for Christian radio stations. The extension fetches station data from the Radio Crestin API and streams audio using HLS.js and native HTML5 audio.

### Key Components Structure

**Main Player Component**: `src/components/ExtensionPlayer.tsx` - The primary UI component that orchestrates the entire player experience

**Audio Management**: `src/hooks/useAudioPlayer.ts` - Handles all audio playback logic, HLS streaming, and audio state management

**Station Data**: `src/hooks/useStations.ts` - Manages fetching and caching station data from the Radio Crestin API

**Favorites System**: `src/hooks/useFavorites.ts` - Manages favorite stations using Chrome's sync storage

### Core Architecture Patterns

The codebase follows a React hooks-based architecture where:

1. **ExtensionPlayer.tsx** acts as the main orchestrator, combining all hooks and sub-components
2. **Custom hooks** encapsulate specific domain logic (audio, stations, favorites)  
3. **Sub-components** handle specific UI concerns (controls, display, volume)
4. **Chrome Extensions API** is used for storage and background processing

### Audio Streaming Strategy

The audio player implements a multi-format streaming approach:

1. **Primary**: HLS streams using hls.js library
2. **Fallback**: Direct MP3/audio streams using HTML5 audio
3. **Multiple sources**: Tries different stream URLs from station data automatically
4. **Background service worker**: Manages persistence across browser sessions

### API Integration

- **Base API**: `https://radiocrestin.ro/api/stations` for station list
- **Streaming**: Uses `hls_stream_url` and `stream_url` from station data
- **CORS handling**: Extension permissions allow cross-origin requests to Radio Crestin domains

### Storage and State

- **Chrome Sync Storage**: For persisting favorite stations across devices
- **Local React State**: For UI state and current playback status
- **Service Worker**: For background audio management (see `src/background.ts`)

### Build Process

The build uses Vite with specific Chrome Extension optimizations:
- Disables minification for easier debugging
- Generates separate bundles for popup and background scripts
- Copies static assets (manifest.json, icons) to dist folder
- Uses custom build script (`build-extension.sh`) for complete extension packaging

### TypeScript Configuration

Uses modern TypeScript with strict mode, Chrome types, and path aliases (@/* maps to src/*).
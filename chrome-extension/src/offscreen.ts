// Offscreen document for background audio playback
// @ts-ignore
import Hls from 'hls.js';

interface Station {
  id: string;
  title: string;
  stream_url: string;
  proxy_stream_url?: string;
  hls_stream_url?: string;
  station_streams?: Array<{
    order: number;
    type: string;
    stream_url: string;
  }>;
}

interface StreamSource {
  url: string;
  type: 'mp3' | 'hls' | 'other';
}

interface AudioState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentStation: Station | null;
  error: string | null;
  isLoading: boolean;
}

class BackgroundAudioManager {
  private audioElement: HTMLAudioElement;
  private hls: any = null;
  private playPromise: Promise<void> | null = null;
  private isTransitioning = false;
  private state: AudioState = {
    isPlaying: false,
    volume: 0.5,
    isMuted: false,
    currentStation: null,
    error: null,
    isLoading: false
  };

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'none';
    this.audioElement.crossOrigin = 'anonymous';
    this.setupAudioEventListeners();
  }

  private setupAudioEventListeners() {
    this.audioElement.addEventListener('play', () => {
      console.log('Audio play event fired');
      this.updateState({ isPlaying: true, error: null });
    });

    this.audioElement.addEventListener('pause', () => {
      console.log('Audio pause event fired');
      this.updateState({ isPlaying: false });
    });

    this.audioElement.addEventListener('playing', () => {
      console.log('Audio playing event fired');
      this.updateState({ isPlaying: true, error: null, isLoading: false });
    });

    this.audioElement.addEventListener('waiting', () => {
      console.log('Audio waiting event fired (buffering)');
      this.updateState({ isLoading: true });
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.playPromise = null; // Clear any pending play promise
      this.isTransitioning = false;
      this.updateState({ 
        isPlaying: false, 
        error: 'Audio playback failed',
        isLoading: false 
      });
    });

    this.audioElement.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true, error: null });
    });

    this.audioElement.addEventListener('canplay', () => {
      this.updateState({ isLoading: false, error: null });
    });

    this.audioElement.addEventListener('ended', () => {
      console.log('Audio ended event fired');
      this.updateState({ isPlaying: false });
    });

    this.audioElement.addEventListener('abort', () => {
      console.log('Audio abort event fired');
      this.playPromise = null;
      this.isTransitioning = false;
    });
  }

  private updateState(updates: Partial<AudioState>) {
    this.state = { ...this.state, ...updates };
    
    // Notify background script of state changes
    chrome.runtime.sendMessage({
      type: 'AUDIO_STATE_CHANGED',
      state: this.state
    });
  }

  private detectStreamType(url: string): 'mp3' | 'hls' | 'other' {
    if (url.includes('.m3u8') || url.includes('hls')) {
      return 'hls';
    }
    if (url.includes('.mp3') || url.includes('icecast') || url.includes('shoutcast')) {
      return 'mp3';
    }
    return 'other';
  }

  private getStreamSources(station: Station): StreamSource[] {
    const sources: StreamSource[] = [];
    
    // First, try direct MP3/audio streams (more reliable than HLS)
    if (station.stream_url) {
      const type = this.detectStreamType(station.stream_url);
      if (type === 'mp3' || type === 'other') {
        sources.push({
          url: station.stream_url,
          type: type
        });
      }
    }
    
    // Try proxy URL (usually more reliable)
    if (station.proxy_stream_url) {
      const type = this.detectStreamType(station.proxy_stream_url);
      if (type === 'mp3' || type === 'other') {
        sources.push({
          url: station.proxy_stream_url,
          type: type
        });
      }
    }
    
    // Try additional stream sources (prioritize non-HLS)
    if (station.station_streams) {
      const nonHlsStreams = station.station_streams
        .filter(stream => !stream.stream_url.includes('.m3u8'))
        .sort((a, b) => a.order - b.order);
      
      nonHlsStreams.forEach(stream => {
        sources.push({
          url: stream.stream_url,
          type: this.detectStreamType(stream.stream_url)
        });
      });
    }
    
    // Try HLS streams last (due to CORS issues)
    if (station.hls_stream_url) {
      sources.push({
        url: station.hls_stream_url,
        type: 'hls'
      });
    }
    
    // Add any remaining HLS streams from station_streams
    if (station.station_streams) {
      const hlsStreams = station.station_streams
        .filter(stream => stream.stream_url.includes('.m3u8'))
        .sort((a, b) => a.order - b.order);
      
      hlsStreams.forEach(stream => {
        sources.push({
          url: stream.stream_url,
          type: 'hls'
        });
      });
    }
    
    // Remove duplicates
    const uniqueSources = sources.filter((source, index, arr) => 
      arr.findIndex(s => s.url === source.url) === index
    );
    
    return uniqueSources;
  }

  private cleanupHls() {
    if (this.hls) {
      try {
        this.hls.destroy();
      } catch (error) {
        console.warn('Error destroying HLS instance:', error);
      }
      this.hls = null;
    }
  }

  private async setupHlsStream(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!Hls.isSupported()) {
        // Fallback for browsers that support HLS natively (like Safari)
        if (this.audioElement.canPlayType('application/vnd.apple.mpegurl')) {
          this.audioElement.crossOrigin = 'anonymous';
          this.audioElement.src = url;
          this.audioElement.load();
          resolve();
        } else {
          reject(new Error('HLS not supported'));
        }
        return;
      }

      this.cleanupHls();
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false, // Disable low latency for better compatibility
        backBufferLength: 30,
        maxBufferLength: 60,
        xhrSetup: (xhr: XMLHttpRequest) => {
          // Try to handle CORS
          xhr.withCredentials = false;
        },
        fetchSetup: (context: any, initParams: any) => {
          // Configure fetch for CORS
          initParams.mode = 'cors';
          initParams.credentials = 'omit';
          return new Request(context.url, initParams);
        }
      });
      
      this.hls = hls;

      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error('HLS loading timeout'));
        }
      }, 20000); // 20 second timeout for HLS

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve();
        }
      });

      hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
        console.error('HLS Error:', data);
        if (data.fatal && !resolved) {
          resolved = true;
          clearTimeout(timeout);
          let errorMsg = `HLS error: ${data.type}`;
          if (data.details) errorMsg += ` - ${data.details}`;
          if (data.response?.code) errorMsg += ` (HTTP ${data.response.code})`;
          reject(new Error(errorMsg));
        }
      });

      // Set crossOrigin before HLS attachment
      this.audioElement.crossOrigin = 'anonymous';
      
      hls.loadSource(url);
      hls.attachMedia(this.audioElement);
    });
  }

  private async setupAudioStream(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let resolved = false;
      
      const cleanup = () => {
        this.audioElement.removeEventListener('error', onError);
        this.audioElement.removeEventListener('canplay', onCanPlay);
        this.audioElement.removeEventListener('loadeddata', onLoadedData);
      };
      
      const onError = (e: any) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        const errorMsg = e.target?.error ? `Audio error: ${e.target.error.message}` : 'Audio failed to load';
        reject(new Error(errorMsg));
      };
      
      const onCanPlay = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve();
      };

      const onLoadedData = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve();
      };
      
      // Set timeout for loading
      const timeout = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        cleanup();
        reject(new Error('Audio loading timeout'));
      }, 15000); // 15 second timeout
      
      this.audioElement.addEventListener('error', onError);
      this.audioElement.addEventListener('canplay', onCanPlay);
      this.audioElement.addEventListener('loadeddata', onLoadedData);
      
      // Set crossOrigin to anonymous to help with CORS
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.preload = 'none';
      
      this.audioElement.src = url;
      this.audioElement.load();
      
      // Clear timeout on resolve/reject
      Promise.resolve().then(() => {
        if (resolved) clearTimeout(timeout);
      });
    });
  }

  private async tryLoadSource(source: StreamSource): Promise<boolean> {
    try {
      this.updateState({ isLoading: true });
      
      if (source.type === 'hls') {
        await this.setupHlsStream(source.url);
      } else {
        await this.setupAudioStream(source.url);
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to load ${source.type} stream:`, source.url, error);
      return false;
    } finally {
      this.updateState({ isLoading: false });
    }
  }

  async loadStation(station: Station): Promise<void> {
    const sources = this.getStreamSources(station);
    
    if (sources.length === 0) {
      const errorMessage = 'No audio sources available for this station';
      this.updateState({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }

    // Remember if we were playing before the station change
    const wasPlaying = this.state.isPlaying;

    this.updateState({ 
      error: null, 
      currentStation: station, 
      isLoading: true,
      isPlaying: false 
    });

    // Clean up previous stream before loading new one
    this.isTransitioning = true;
    
    // Wait for any ongoing play promise to complete
    if (this.playPromise) {
      try {
        await this.playPromise;
      } catch (error) {
        // Ignore play errors during station change
      }
      this.playPromise = null;
    }

    this.cleanupHls();
    this.audioElement.pause();
    this.audioElement.src = '';
    
    // Add a small delay to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.isTransitioning = false;
    
    // Try each source in order
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      console.log(`Trying source ${i + 1}/${sources.length}: ${source.type} - ${source.url}`);
      
      try {
        const success = await this.tryLoadSource(source);
        if (success) {
          // Ensure volume and mute state are properly set
          this.audioElement.volume = this.state.volume;
          this.audioElement.muted = this.state.isMuted;
          
          this.updateState({ isLoading: false, error: null });
          
          // If we were playing before, try to resume
          if (wasPlaying) {
            try {
              await this.audioElement.play();
            } catch (playError) {
              console.warn('Could not auto-resume playback:', playError);
              // Don't throw error, just leave it paused
            }
          }
          
          console.log('Successfully loaded station:', station.title);
          return;
        }
      } catch (error) {
        console.error(`Source ${i + 1} failed:`, error);
        // Continue to next source
      }
    }

    // If all sources failed
    const errorMessage = `Failed to load any audio stream for "${station.title}". All ${sources.length} sources failed.`;
    this.updateState({ error: errorMessage, isLoading: false, isPlaying: false });
    throw new Error(errorMessage);
  }

  async play() {
    if (!this.state.currentStation) {
      throw new Error('No station selected');
    }

    if (this.isTransitioning) {
      console.log('Audio is transitioning, skipping play request');
      return;
    }

    try {
      // If there's already a play promise, wait for it to complete or fail
      if (this.playPromise) {
        try {
          await this.playPromise;
        } catch (error) {
          // Ignore previous play errors
        }
      }

      this.isTransitioning = true;
      this.playPromise = this.audioElement.play();
      await this.playPromise;
      
      // Play succeeded
      this.playPromise = null;
      this.isTransitioning = false;
    } catch (error: any) {
      this.playPromise = null;
      this.isTransitioning = false;
      
      console.error('Error playing audio:', error);
      
      // Don't treat AbortError as a real error - it's just a play interruption
      if (error.name === 'AbortError') {
        console.log('Play was interrupted (AbortError), but this is normal behavior');
        return;
      }
      
      this.updateState({ 
        isPlaying: false, 
        error: `Failed to start audio playback: ${error.message}` 
      });
      throw error;
    }
  }

  async pause() {
    if (this.isTransitioning) {
      console.log('Audio is transitioning, waiting before pause');
      // Wait a bit for any ongoing transition to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // If there's a play promise, wait for it to resolve/reject before pausing
    if (this.playPromise) {
      try {
        await this.playPromise;
      } catch (error) {
        // Ignore play errors, we're pausing anyway
      }
      this.playPromise = null;
    }

    this.audioElement.pause();
  }

  setVolume(volume: number) {
    this.audioElement.volume = volume;
    this.updateState({ volume });
  }

  setMuted(muted: boolean) {
    this.audioElement.muted = muted;
    this.updateState({ isMuted: muted });
  }

  getState(): AudioState {
    return { ...this.state };
  }

  destroy() {
    this.audioElement.pause();
    this.audioElement.src = '';
    this.cleanupHls();
  }
}

// Create global audio manager instance
const audioManager = new BackgroundAudioManager();

// Handle messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Offscreen received message:', message);

  // Only handle messages with our message types
  if (!message.type || !message.type.startsWith('AUDIO_')) {
    return;
  }

  const respondToBackground = (response: any) => {
    if (message.messageId) {
      // Send response back through background script
      chrome.runtime.sendMessage({
        type: 'OFFSCREEN_RESPONSE',
        messageId: message.messageId,
        response: response
      });
    } else {
      // Direct response
      sendResponse(response);
    }
  };

  switch (message.type) {
    case 'AUDIO_LOAD_STATION':
      audioManager.loadStation(message.station)
        .then(() => respondToBackground({ success: true }))
        .catch(error => respondToBackground({ success: false, error: error.message }));
      break;

    case 'AUDIO_PLAY':
      audioManager.play()
        .then(() => respondToBackground({ success: true }))
        .catch(error => respondToBackground({ success: false, error: error.message }));
      break;

    case 'AUDIO_PAUSE':
      audioManager.pause();
      respondToBackground({ success: true });
      break;

    case 'AUDIO_SET_VOLUME':
      audioManager.setVolume(message.volume);
      respondToBackground({ success: true });
      break;

    case 'AUDIO_SET_MUTED':
      audioManager.setMuted(message.muted);
      respondToBackground({ success: true });
      break;

    case 'AUDIO_GET_STATE':
      respondToBackground({ success: true, state: audioManager.getState() });
      break;

    default:
      console.warn('Unknown message type:', message.type);
      respondToBackground({ success: false, error: 'Unknown message type' });
  }
});

// Notify background that offscreen is ready
chrome.runtime.sendMessage({
  type: 'OFFSCREEN_READY',
  state: audioManager.getState()
});

console.log('Offscreen audio manager initialized');
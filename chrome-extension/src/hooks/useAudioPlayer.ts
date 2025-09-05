import { useEffect, useRef, useState } from 'react';
import { Station } from '../types';
// @ts-ignore
import Hls from 'hls.js';

interface StreamSource {
  url: string;
  type: 'mp3' | 'hls' | 'other';
}

export function useAudioPlayer(currentStation: Station | undefined) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<any>(null);
  const currentSourceRef = useRef<string | null>(null);

  // Detect stream type from URL
  const detectStreamType = (url: string): 'mp3' | 'hls' | 'other' => {
    if (url.includes('.m3u8') || url.includes('hls')) {
      return 'hls';
    }
    if (url.includes('.mp3') || url.includes('icecast') || url.includes('shoutcast')) {
      return 'mp3';
    }
    return 'other';
  };

  // Get available stream sources in priority order
  const getStreamSources = (station: Station): StreamSource[] => {
    const sources: StreamSource[] = [];
    
    // Try HLS first if available
    if (station.hls_stream_url) {
      sources.push({
        url: station.hls_stream_url,
        type: 'hls'
      });
    }
    
    // Try additional stream sources
    if (station.station_streams) {
      station.station_streams.forEach(stream => {
        sources.push({
          url: stream.stream_url,
          type: detectStreamType(stream.stream_url)
        });
      });
    }
    
    // Try proxy URL
    if (station.proxy_stream_url) {
      sources.push({
        url: station.proxy_stream_url,
        type: detectStreamType(station.proxy_stream_url)
      });
    }
    
    // Try direct stream URL
    if (station.stream_url) {
      sources.push({
        url: station.stream_url,
        type: detectStreamType(station.stream_url)
      });
    }
    
    return sources;
  };

  // Clean up HLS instances
  const cleanupHls = () => {
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch (error) {
        console.warn('Error destroying HLS instance:', error);
      }
      hlsRef.current = null;
    }
  };

  // Setup HLS stream
  const setupHlsStream = (url: string, audioElement: HTMLAudioElement): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!Hls.isSupported()) {
        // Fallback for browsers that support HLS natively (like Safari)
        if (audioElement.canPlayType('application/vnd.apple.mpegurl')) {
          audioElement.src = url;
          resolve();
        } else {
          reject(new Error('HLS not supported'));
        }
        return;
      }

      cleanupHls();
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        resolve();
      });

      hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
        if (data.fatal) {
          reject(new Error(`HLS fatal error: ${data.type} - ${data.details}`));
        }
      });

      hls.loadSource(url);
      hls.attachMedia(audioElement);
    });
  };

  // Setup regular MP3/audio stream
  const setupAudioStream = (url: string, audioElement: HTMLAudioElement): Promise<void> => {
    return new Promise((resolve, reject) => {
      const onError = () => {
        audioElement.removeEventListener('error', onError);
        audioElement.removeEventListener('canplay', onCanPlay);
        reject(new Error('Audio failed to load'));
      };
      
      const onCanPlay = () => {
        audioElement.removeEventListener('error', onError);
        audioElement.removeEventListener('canplay', onCanPlay);
        resolve();
      };
      
      audioElement.addEventListener('error', onError, { once: true });
      audioElement.addEventListener('canplay', onCanPlay, { once: true });
      
      audioElement.src = url;
      audioElement.load();
    });
  };

  // Try to load a stream source
  const tryLoadSource = async (source: StreamSource, audioElement: HTMLAudioElement): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (source.type === 'hls') {
        await setupHlsStream(source.url, audioElement);
      } else {
        await setupAudioStream(source.url, audioElement);
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to load ${source.type} stream:`, source.url, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load station
  const loadStation = async (station: Station): Promise<void> => {
    const sources = getStreamSources(station);
    
    if (sources.length === 0) {
      const errorMessage = 'No audio sources available for this station';
      setAudioError(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    setAudioError(null);

    if (!audioRef.current) {
      console.error('Audio element not available');
      return Promise.reject(new Error('Audio element not available'));
    }

    // Clean up previous stream before loading new one
    cleanupHls();
    
    // Try each source in order
    for (const source of sources) {
      const success = await tryLoadSource(source, audioRef.current);
      if (success) {
        // Ensure volume and mute state are properly set
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
        currentSourceRef.current = source.url;
        return Promise.resolve(); // Successfully loaded
      }
    }

    // If all sources failed
    const errorMessage = 'Failed to load any audio stream for this station';
    setAudioError(errorMessage);
    return Promise.reject(new Error(errorMessage));
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'none';
      audioRef.current.crossOrigin = 'anonymous';
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      cleanupHls();
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (!currentStation) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioError(null);
      setIsLoading(false);
      cleanupHls();
      currentSourceRef.current = null;
      return;
    }

    // Remember if we were playing before the station change
    const wasPlaying = isPlaying;
    
    // Stop current audio during station change
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    loadStation(currentStation).then(() => {
      // If we were playing before, automatically start the new station
      if (wasPlaying && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error("Error auto-playing new station:", error);
          setIsPlaying(false);
          if (error instanceof DOMException && error.name === 'NotAllowedError') {
            setAudioError('Please click play to start audio. Browser autoplay is disabled.');
          }
        });
      }
    }).catch((error) => {
      console.error("Error loading new station:", error);
      setIsPlaying(false);
    });
  }, [currentStation]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current || !currentStation) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setAudioError(null);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          setAudioError('Please click play to start audio. Browser autoplay is disabled.');
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    audioRef,
    isPlaying,
    volume,
    isMuted,
    audioError,
    isLoading,
    setVolume,
    togglePlay,
    toggleMute,
    setAudioError
  };
}

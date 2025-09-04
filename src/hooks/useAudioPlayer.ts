import { useEffect, useRef, useState } from 'react';
import { Station } from '../types';
import { trackAudioError } from '../lib/analytics';
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
  
  // Dual audio element system for seamless transitions
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef2 = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<'audio1' | 'audio2'>('audio1');
  
  const hlsRef = useRef<any>(null);
  const hlsRef2 = useRef<any>(null);
  const currentSourceRef = useRef<string | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const retryAttemptRef = useRef(0);
  const maxRetries = 3;
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper functions for dual audio system
  const getActiveAudio = (): HTMLAudioElement | null => {
    return activeAudioRef.current === 'audio1' ? audioRef.current : audioRef2.current;
  };

  const getInactiveAudio = (): HTMLAudioElement | null => {
    return activeAudioRef.current === 'audio1' ? audioRef2.current : audioRef.current;
  };

  const getActiveHls = () => {
    return activeAudioRef.current === 'audio1' ? hlsRef.current : hlsRef2.current;
  };

  const getInactiveHls = () => {
    return activeAudioRef.current === 'audio1' ? hlsRef2.current : hlsRef.current;
  };

  const setActiveHls = (hls: any) => {
    if (activeAudioRef.current === 'audio1') {
      hlsRef.current = hls;
    } else {
      hlsRef2.current = hls;
    }
  };

  const setInactiveHls = (hls: any) => {
    if (activeAudioRef.current === 'audio1') {
      hlsRef2.current = hls;
    } else {
      hlsRef.current = hls;
    }
  };

  const switchActiveAudio = () => {
    activeAudioRef.current = activeAudioRef.current === 'audio1' ? 'audio2' : 'audio1';
  };

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
  const cleanupHls = (instance?: 'active' | 'inactive' | 'all') => {
    const cleanup = (hls: any, name: string) => {
      if (hls) {
        try {
          hls.destroy();
        } catch (error) {
          console.warn(`Error destroying ${name} HLS instance:`, error);
        }
      }
    };

    if (!instance || instance === 'all') {
      cleanup(hlsRef.current, 'primary');
      cleanup(hlsRef2.current, 'secondary');
      hlsRef.current = null;
      hlsRef2.current = null;
    } else if (instance === 'active') {
      const activeHls = getActiveHls();
      cleanup(activeHls, 'active');
      setActiveHls(null);
    } else if (instance === 'inactive') {
      const inactiveHls = getInactiveHls();
      cleanup(inactiveHls, 'inactive');
      setInactiveHls(null);
    }
  };

  // Setup HLS stream
  const setupHlsStream = (url: string, audioElement: HTMLAudioElement, isInactive = false): Promise<void> => {
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

      // Clean up existing HLS for this audio element
      if (isInactive) {
        cleanupHls('inactive');
      } else {
        cleanupHls('active');
      }
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      // Set the HLS instance to the correct ref
      if (isInactive) {
        setInactiveHls(hls);
      } else {
        setActiveHls(hls);
      }

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('HLS manifest parsed successfully');
        resolve();
      });

      hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
        if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.error('HLS error:', data);
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
        if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.error('Audio stream setup failed for URL:', url);
        audioElement.removeEventListener('error', onError);
        audioElement.removeEventListener('canplay', onCanPlay);
        
        // Try without CORS if it failed with CORS
        if (audioElement.crossOrigin) {
          if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Retrying without CORS...');
          audioElement.crossOrigin = null;
          audioElement.src = url;
          audioElement.load();
          
          const onErrorNoCors = () => {
            audioElement.removeEventListener('error', onErrorNoCors);
            audioElement.removeEventListener('canplay', onCanPlayNoCors);
            reject(new Error('Audio failed to load with and without CORS'));
          };
          
          const onCanPlayNoCors = () => {
            audioElement.removeEventListener('error', onErrorNoCors);
            audioElement.removeEventListener('canplay', onCanPlayNoCors);
            resolve();
          };
          
          audioElement.addEventListener('error', onErrorNoCors, { once: true });
          audioElement.addEventListener('canplay', onCanPlayNoCors, { once: true });
        } else {
          reject(new Error('Audio failed to load'));
        }
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

  // Crossfade between audio elements
  const crossfade = async (fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement, duration = 500) => {
    if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Starting crossfade...');
    
    // Clear any existing crossfade
    if (crossfadeTimeoutRef.current) {
      clearTimeout(crossfadeTimeoutRef.current);
      crossfadeTimeoutRef.current = null;
    }

    const steps = 20;
    const stepDuration = duration / steps;

    // Start the new audio at 0 volume
    toAudio.volume = 0;
    
    try {
      await safePlay(toAudio);
    } catch (error) {
      console.error('Error starting new audio during crossfade:', error);
      return false;
    }

    // Crossfade
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => {
        crossfadeTimeoutRef.current = setTimeout(() => {
          const fadeOutVolume = volume * (1 - i / steps);
          const fadeInVolume = volume * (i / steps);
          
          fromAudio.volume = Math.max(0, fadeOutVolume);
          toAudio.volume = Math.min(volume, fadeInVolume);
          
          resolve(void 0);
        }, i * stepDuration);
      });
    }

    // Pause the old audio and reset its volume
    try {
      await safePause(fromAudio);
      fromAudio.volume = volume;
    } catch (error) {
      console.warn('Error pausing old audio after crossfade:', error);
    }

    if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Crossfade completed');
    return true;
  };

  // Safe play function that handles promise interruptions
  const safePlay = async (audioElement: HTMLAudioElement): Promise<boolean> => {
    try {
      // Wait for any existing play promise to resolve before starting a new one
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch {
          // Ignore errors from previous play attempts
        }
      }

      // Check if audio element is ready
      if (audioElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Audio not ready, ready state:', audioElement.readyState);
        return false;
      }

      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Calling audioElement.play()...');
      const playPromise = audioElement.play();
      playPromiseRef.current = playPromise;
      
      await playPromise;
      playPromiseRef.current = null;
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Play promise resolved successfully');
      return true;
    } catch (error) {
      playPromiseRef.current = null;
      console.error('Play promise rejected:', error);
      
      // Check for autoplay policy violations
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          console.error('Autoplay blocked by browser policy. User interaction required.');
          setAudioError('Please click play to start audio. Browser autoplay is disabled.');
        } else if (error.name === 'AbortError') {
          console.error('Play request was aborted');
        } else if (error.name === 'NotSupportedError') {
          console.error('Audio format not supported');
          setAudioError('Audio format not supported by your browser.');
        }
      }
      
      throw error;
    }
  };

  // Safe pause function
  const safePause = async (audioElement: HTMLAudioElement): Promise<void> => {
    try {
      // Wait for any existing play promise to resolve before pausing
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch {
          // Ignore errors from previous play attempts
        }
        playPromiseRef.current = null;
      }
      audioElement.pause();
    } catch (error) {
      console.warn('Error during pause:', error);
    }
  };

  // Try to load a stream source
  const tryLoadSource = async (source: StreamSource, audioElement: HTMLAudioElement, isInactive = false): Promise<boolean> => {
    try {
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log(`Trying to load ${source.type} stream:`, source.url);
      if (!isInactive) setIsLoading(true);
      
      if (source.type === 'hls') {
        await setupHlsStream(source.url, audioElement, isInactive);
      } else {
        await setupAudioStream(source.url, audioElement);
      }
      
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Stream source loaded successfully:', source.url);
      return true;
    } catch (error) {
      console.error(`Failed to load ${source.type} stream:`, source.url, error);
      return false;
    } finally {
      if (!isInactive) setIsLoading(false);
    }
  };

  // Keep track of event listeners for cleanup
  const eventListenersRef = useRef<{
    audio1: Array<{ event: string; handler: EventListener }>;
    audio2: Array<{ event: string; handler: EventListener }>;
  }>({ audio1: [], audio2: [] });

  // Setup audio event listeners for debugging
  const setupAudioEventListeners = (audioElement: HTMLAudioElement, name: string) => {
    // Check if debug mode is enabled
    const isDebugEnabled = import.meta.env.VITE_AUDIO_DEBUG === 'true';
    
    const events = [
      'loadstart', 'loadeddata', 'loadedmetadata', 'canplay', 'canplaythrough',
      'playing', 'waiting', 'seeking', 'seeked', 'ended', 'error', 'stalled',
      'suspend', 'abort', 'emptied', 'progress', 'volumechange'
    ];
    
    // Clear existing listeners for this audio element
    const listenersArray = name === 'audio1' ? eventListenersRef.current.audio1 : eventListenersRef.current.audio2;
    listenersArray.forEach(({ event, handler }) => {
      audioElement.removeEventListener(event, handler);
    });
    listenersArray.length = 0; // Clear the array
    
    events.forEach(eventType => {
      const handler = () => {
        // Only log detailed events in debug mode
        if (isDebugEnabled) {
          console.log(`[${name}] Audio event:`, eventType, {
            readyState: audioElement.readyState,
            paused: audioElement.paused,
            volume: audioElement.volume,
            muted: audioElement.muted,
            src: audioElement.src,
            currentTime: audioElement.currentTime,
            duration: audioElement.duration,
            error: audioElement.error
          });
        }
        
        // Always handle error events (but log details only in debug mode)
        if (eventType === 'error' && audioElement.error) {
          const error = audioElement.error;
          
          if (isDebugEnabled) {
            console.error(`[${name}] Media error:`, {
              code: error.code,
              message: error.message,
              MEDIA_ERR_ABORTED: error.MEDIA_ERR_ABORTED,
              MEDIA_ERR_NETWORK: error.MEDIA_ERR_NETWORK,
              MEDIA_ERR_DECODE: error.MEDIA_ERR_DECODE,
              MEDIA_ERR_SRC_NOT_SUPPORTED: error.MEDIA_ERR_SRC_NOT_SUPPORTED
            });
          }
          
          let errorMessage = 'Unknown audio error';
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = 'Audio loading was aborted';
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error while loading audio';
              break;
            case error.MEDIA_ERR_DECODE:
              errorMessage = 'Error decoding audio data';
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Audio format not supported';
              break;
          }
          setAudioError(errorMessage);
        }
        
        // Check for silent audio issues (only in debug mode)
        if (eventType === 'playing' && isDebugEnabled) {
          setTimeout(() => {
            if (!audioElement.paused && audioElement.volume > 0 && !audioElement.muted) {
              console.log(`[${name}] Audio should be playing:`, {
                paused: audioElement.paused,
                volume: audioElement.volume,
                muted: audioElement.muted,
                readyState: audioElement.readyState
              });
            }
          }, 1000);
        }
      };
      
      // Add the event listener
      audioElement.addEventListener(eventType, handler);
      // Store the handler for cleanup
      listenersArray.push({ event: eventType, handler });
    });
  };

  // Clean up event listeners
  const cleanupEventListeners = () => {
    [audioRef.current, audioRef2.current].forEach((audio, index) => {
      if (audio) {
        const listenersArray = index === 0 ? eventListenersRef.current.audio1 : eventListenersRef.current.audio2;
        listenersArray.forEach(({ event, handler }) => {
          audio.removeEventListener(event, handler);
        });
        listenersArray.length = 0;
      }
    });
  };

  // Load station with seamless crossfading
  const loadStation = async (station: Station, isStationChange = false) => {
    const sources = getStreamSources(station);
    
    if (sources.length === 0) {
      const errorMessage = 'No audio sources available for this station';
      setAudioError(errorMessage);
      trackAudioError(errorMessage, station.title);
      return;
    }

    retryAttemptRef.current = 0;
    setAudioError(null);

    const targetAudio = isStationChange ? getInactiveAudio() : getActiveAudio();
    
    if (!targetAudio) {
      console.error('Target audio element not available');
      return;
    }

    // Try each source in order
    for (const source of sources) {
      if (retryAttemptRef.current >= maxRetries) {
        break; // Prevent infinite retry loops
      }
      const success = await tryLoadSource(source, targetAudio, isStationChange);
      if (success) {
        // Wait for the audio to be ready with better ready state check
        await new Promise<void>((resolve) => {
          // Wait for HAVE_ENOUGH_DATA instead of just HAVE_CURRENT_DATA
          if (targetAudio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
            if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Audio ready immediately');
            resolve();
          } else {
            const onCanPlayThrough = () => {
              if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Audio can play through');
              targetAudio.removeEventListener('canplaythrough', onCanPlayThrough);
              resolve();
            };
            const onCanPlay = () => {
              if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Audio can play (fallback)');
              targetAudio.removeEventListener('canplay', onCanPlay);
              // Wait a bit longer for buffer
              setTimeout(resolve, 100);
            };
            
            targetAudio.addEventListener('canplaythrough', onCanPlayThrough);
            targetAudio.addEventListener('canplay', onCanPlay);
            
            // Timeout fallback
            setTimeout(() => {
              targetAudio.removeEventListener('canplaythrough', onCanPlayThrough);
              targetAudio.removeEventListener('canplay', onCanPlay);
              if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Audio ready timeout - proceeding anyway');
              resolve();
            }, 5000);
          }
        });

        // Ensure volume and mute state are properly set
        targetAudio.volume = volume;
        targetAudio.muted = isMuted;
        if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Set audio volume to:', volume, 'muted:', targetAudio.muted);

        if (isStationChange && isPlaying) {
          // Perform seamless crossfade
          const activeAudio = getActiveAudio();
          if (activeAudio) {
            const crossfadeSuccess = await crossfade(activeAudio, targetAudio, 300);
            if (crossfadeSuccess) {
              switchActiveAudio();
              currentSourceRef.current = source.url;
            }
          }
        } else if (!isStationChange && isPlaying) {
          // Initial load - just play if needed
          try {
            await safePlay(targetAudio);
          } catch (error) {
            console.error('Error playing initial audio:', error);
            setIsPlaying(false);
          }
        }
        
        if (!isStationChange) {
          currentSourceRef.current = source.url;
        }
        return; // Successfully loaded
      }
    }

    // If all sources failed
    const errorMessage = 'Failed to load any audio stream for this station';
    setAudioError(errorMessage);
    trackAudioError(errorMessage, station.title);
  };

  // Add cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Clean up crossfade timeout
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = null;
      }
      
      // Clean up event listeners
      cleanupEventListeners();
      
      // Clean up audio elements
      const activeAudio = getActiveAudio();
      const inactiveAudio = getInactiveAudio();
      
      if (activeAudio) {
        safePause(activeAudio).then(() => {
          activeAudio.src = '';
        }).catch(() => {/* ignore */});
      }
      
      if (inactiveAudio) {
        safePause(inactiveAudio).then(() => {
          inactiveAudio.src = '';
        }).catch(() => {/* ignore */});
      }
      
      // Clean up HLS instances
      cleanupHls();
      
      // Reset refs
      currentSourceRef.current = null;
      playPromiseRef.current = null;
      retryAttemptRef.current = 0;
    };
  }, []); // Empty dependency array - only run on mount/unmount

  useEffect(() => {
    if (!audioRef.current || !audioRef2.current) {
      return;
    }

    if (!currentStation) {
      // When station is set to null (player closed), stop audio and cleanup
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') {
        console.log('Station set to null - stopping audio and cleaning up');
      }
      
      const activeAudio = getActiveAudio();
      const inactiveAudio = getInactiveAudio();
      
      if (activeAudio) {
        if (import.meta.env.VITE_AUDIO_DEBUG === 'true') {
          console.log('Pausing active audio element');
        }
        safePause(activeAudio).then(() => {
          activeAudio.src = '';
        }).catch(() => {/* ignore errors during cleanup */});
      }
      
      if (inactiveAudio) {
        if (import.meta.env.VITE_AUDIO_DEBUG === 'true') {
          console.log('Pausing inactive audio element');
        }
        safePause(inactiveAudio).then(() => {
          inactiveAudio.src = '';
        }).catch(() => {/* ignore errors during cleanup */});
      }
      
      // Clear any ongoing crossfade
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = null;
      }
      
      // Reset state
      setIsPlaying(false);
      setAudioError(null);
      setIsLoading(false);
      
      // Clean up HLS and refs
      cleanupHls();
      currentSourceRef.current = null;
      retryAttemptRef.current = 0;
      playPromiseRef.current = null;
      
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') {
        console.log('Audio cleanup completed');
      }
      
      return;
    }

    // Setup event listeners for debugging (only once)
    if (!audioRef.current.hasAttribute('data-listeners-setup')) {
      setupAudioEventListeners(audioRef.current, 'audio1');
      audioRef.current.setAttribute('data-listeners-setup', 'true');
    }
    if (!audioRef2.current.hasAttribute('data-listeners-setup')) {
      setupAudioEventListeners(audioRef2.current, 'audio2');
      audioRef2.current.setAttribute('data-listeners-setup', 'true');
    }

    // Check if this is a station change (we had a different station before)
    const isStationChange = currentSourceRef.current !== null;

    // Load the station with seamless transition
    loadStation(currentStation, isStationChange);

    // Cleanup on station change (not on unmount)
    return () => {
      // Clean up crossfade timeout when switching stations
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
        crossfadeTimeoutRef.current = null;
      }
    };
  }, [currentStation]);

  useEffect(() => {
    // Update volume and mute state for both audio elements
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
    if (audioRef2.current) {
      audioRef2.current.volume = volume;
      audioRef2.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const activeAudio = getActiveAudio();
    
    if (!activeAudio || !currentStation) {
      console.log('togglePlay: Missing activeAudio or currentStation');
      return;
    }

    if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('togglePlay: isPlaying =', isPlaying, 'station =', currentStation.title);

    if (isPlaying) {
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Pausing audio...');
      await safePause(activeAudio);
      setIsPlaying(false);
    } else {
      setAudioError(null);
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Starting to play audio...');
      if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Audio details:', {
        src: activeAudio.src,
        readyState: activeAudio.readyState,
        paused: activeAudio.paused,
        volume: activeAudio.volume,
        muted: activeAudio.muted,
        duration: activeAudio.duration,
        currentTime: activeAudio.currentTime,
        error: activeAudio.error
      });
      
      // Ensure volume and mute state are properly set before playing
      activeAudio.volume = volume;
      activeAudio.muted = isMuted;
      
      try {
        const success = await safePlay(activeAudio);
        if (success) {
          if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Setting isPlaying to true');
          setIsPlaying(true);
          
          // Additional check after a delay to verify audio is actually playing
          setTimeout(() => {
            if (!activeAudio.paused && activeAudio.volume > 0 && !activeAudio.muted) {
              if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('Audio confirmed playing with sound');
            } else {
              if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.warn('Audio may be playing but could be silent:', {
                paused: activeAudio.paused,
                volume: activeAudio.volume,
                muted: activeAudio.muted
              });
            }
          }, 1000);
        } else {
          if (import.meta.env.VITE_AUDIO_DEBUG === 'true') console.log('safePlay returned false - audio not ready, will retry when ready');
          setIsPlaying(true); // Set to true, will play when canplay event fires
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    audioRef,
    audioRef2,
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
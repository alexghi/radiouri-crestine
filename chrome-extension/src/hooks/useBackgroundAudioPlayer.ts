import { useEffect, useState, useCallback, useRef } from 'react';
import { Station } from '../types';

interface AudioState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentStation: Station | null;
  error: string | null;
  isLoading: boolean;
}

export function useBackgroundAudioPlayer(
  currentStation: Station | undefined, 
  onStationFailed?: (station: Station) => void,
  onInitialSyncComplete?: () => void
) {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    volume: 0.5,
    isMuted: false,
    currentStation: null,
    error: null,
    isLoading: false
  });

  const togglePlayDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isToggling = useRef(false);

  // Send message to background script
  const sendBackgroundMessage = useCallback(async (message: any): Promise<any> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message to background:', chrome.runtime.lastError);
          resolve({ success: false, error: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: true });
        }
      });
    });
  }, []);

  // Get current audio state from background
  const syncAudioState = useCallback(async () => {
    console.log('Syncing audio state from background...');
    const response = await sendBackgroundMessage({ type: 'AUDIO_GET_STATE' });
    if (response.success && response.state) {
      console.log('Audio state synced successfully:', response.state);
      setAudioState(response.state);
      return response.state;
    } else {
      console.log('No audio state found or sync failed:', response);
    }
    return null;
  }, [sendBackgroundMessage]);

  // Listen for state changes from background
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === 'BACKGROUND_AUDIO_STATE_CHANGED') {
        console.log('Popup received audio state change:', message.state);
        setAudioState(message.state);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Sync state when popup opens with a small delay to ensure offscreen is ready
    const syncWithDelay = async () => {
      // Wait a bit for offscreen to fully initialize
      await new Promise(resolve => setTimeout(resolve, 300));
      await syncAudioState();
      // Notify that initial sync is complete
      if (onInitialSyncComplete) {
        onInitialSyncComplete();
      }
    };
    
    syncWithDelay();

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [syncAudioState]);

  // Handle station changes
  useEffect(() => {
    if (!currentStation) {
      // Clear current station if none selected
      return;
    }

    // Don't reload if it's the same station
    if (audioState.currentStation?.id === currentStation.id) {
      return;
    }

    const loadNewStation = async () => {
      console.log('Loading new station:', currentStation.title);
      
      // Set loading state immediately for better UX
      setAudioState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await sendBackgroundMessage({
          type: 'AUDIO_LOAD_STATION',
          station: currentStation
        });

        if (!response.success) {
          console.error('Failed to load station:', response.error);
          setAudioState(prev => ({ 
            ...prev, 
            error: response.error || 'Failed to load station',
            isLoading: false 
          }));
          
          // Notify parent component that this station failed
          if (onStationFailed) {
            onStationFailed(currentStation);
          }
        }
      } catch (error) {
        console.error('Error loading station:', error);
        setAudioState(prev => ({ 
          ...prev, 
          error: 'Failed to communicate with background audio',
          isLoading: false 
        }));
        
        // Notify parent component that this station failed
        if (onStationFailed) {
          onStationFailed(currentStation);
        }
      }
    };

    loadNewStation();
  }, [currentStation, audioState.currentStation?.id, sendBackgroundMessage]);

  const togglePlay = useCallback(async () => {
    if (!audioState.currentStation) {
      console.warn('No station selected');
      return;
    }

    // Prevent rapid toggle requests
    if (isToggling.current) {
      console.log('Toggle already in progress, ignoring request');
      return;
    }

    // Clear any existing debounce timeout
    if (togglePlayDebounceRef.current) {
      clearTimeout(togglePlayDebounceRef.current);
    }

    // Debounce rapid clicks
    togglePlayDebounceRef.current = setTimeout(async () => {
      if (isToggling.current) return;

      isToggling.current = true;
      
      try {
        const messageType = audioState.isPlaying ? 'AUDIO_PAUSE' : 'AUDIO_PLAY';
        const response = await sendBackgroundMessage({ type: messageType });
        
        if (!response.success) {
          console.error('Failed to toggle play:', response.error);
          // Only show error if it's not an AbortError (play interruption)
          if (!response.error?.includes('AbortError') && !response.error?.includes('interrupted')) {
            setAudioState(prev => ({ 
              ...prev, 
              error: response.error || 'Failed to control playback' 
            }));
          }
        }
      } catch (error) {
        console.error('Error in togglePlay:', error);
      } finally {
        isToggling.current = false;
      }
    }, 200); // 200ms debounce
  }, [audioState.isPlaying, audioState.currentStation, sendBackgroundMessage]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (togglePlayDebounceRef.current) {
        clearTimeout(togglePlayDebounceRef.current);
      }
    };
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    const response = await sendBackgroundMessage({
      type: 'AUDIO_SET_VOLUME',
      volume
    });

    if (!response.success) {
      console.error('Failed to set volume:', response.error);
    }
  }, [sendBackgroundMessage]);

  const toggleMute = useCallback(async () => {
    const newMutedState = !audioState.isMuted;
    const response = await sendBackgroundMessage({
      type: 'AUDIO_SET_MUTED',
      muted: newMutedState
    });

    if (!response.success) {
      console.error('Failed to toggle mute:', response.error);
    }
  }, [audioState.isMuted, sendBackgroundMessage]);

  const setAudioError = useCallback((error: string | null) => {
    setAudioState(prev => ({ ...prev, error }));
  }, []);

  return {
    audioRef: null, // Not needed for background audio
    isPlaying: audioState.isPlaying,
    volume: audioState.volume,
    isMuted: audioState.isMuted,
    audioError: audioState.error,
    isLoading: audioState.isLoading,
    currentBackgroundStation: audioState.currentStation,
    setVolume,
    togglePlay,
    toggleMute,
    setAudioError,
    syncAudioState
  };
}
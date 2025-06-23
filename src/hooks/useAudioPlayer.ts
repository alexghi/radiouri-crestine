import { useEffect, useRef, useState } from 'react';
import { Station } from '../types';
import { trackAudioError } from '../lib/analytics';

export function useAudioPlayer(currentStation: Station | undefined) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSourceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!audioRef.current || !currentStation) return;

    const audioElement = audioRef.current;
    const newSource = currentStation.proxy_stream_url || currentStation.stream_url;

    if (!newSource) {
      const errorMessage = 'No audio source available for this station';
      setAudioError(errorMessage);
      trackAudioError(errorMessage, currentStation.title);
      return;
    }

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      const errorMessage = 'Failed to load audio stream. Please try again later.';
      setAudioError(errorMessage);
      setIsPlaying(false);
      trackAudioError(errorMessage, currentStation.title);
    };

    const handleCanPlay = () => {
      setAudioError(null);
      if (isPlaying) {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
            const errorMessage = 'Failed to play audio stream. Please try again.';
            setAudioError(errorMessage);
            trackAudioError(errorMessage, currentStation.title);
          });
        }
      }
    };

    if (currentSourceRef.current !== newSource) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = newSource;
      audioElement.load();
      currentSourceRef.current = newSource;
    }

    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('canplay', handleCanPlay);

    return () => {
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.pause();
      audioElement.src = '';
      currentSourceRef.current = null;
    };
  }, [currentStation, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || !currentStation) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setAudioError(null);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
            const errorMessage = 'Failed to play audio stream. Please try again.';
            setAudioError(errorMessage);
            trackAudioError(errorMessage, currentStation.title);
          });
      }
    }
  };

  return {
    audioRef,
    isPlaying,
    volume,
    audioError,
    setVolume,
    togglePlay,
    setAudioError
  };
}
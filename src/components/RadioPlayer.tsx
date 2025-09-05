import { useState, useEffect, useRef } from 'react';
import { Station } from '../types';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingDisplay } from './LoadingDisplay';
import { StationGrid } from './StationGrid';
import { FloatingPlayer } from './FloatingPlayer';
import { AudioDebugger } from './AudioDebugger';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useStations } from '../hooks/useStations';
import { 
  trackStationSelect, 
  trackStationChange, 
  trackStationPlay, 
  trackStationPause,
  trackPlayerMinimize,
  trackPlayerClose,
  trackVolumeChange
} from '../lib/analytics';

export function RadioPlayer() {
  const { stations, loading, error } = useStations();
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  // Keep track of volume change timeout for cleanup
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
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
  } = useAudioPlayer(selectedStation || undefined);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setIsMinimized(false);
    setSessionStartTime(new Date());
    
    // Track station selection with specific function
    trackStationSelect(station.title, station.id);
  };

  const handleChangeStation = (direction: 'next' | 'prev') => {
    if (!stations.length || !selectedStation) return;
    
    const currentIndex = stations.findIndex(s => s.id === selectedStation.id);
    if (currentIndex === -1) return;
    
    setAudioError(null);
    
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % stations.length
      : (currentIndex - 1 + stations.length) % stations.length;
    
    const newStation = stations[newIndex];
    setSelectedStation(newStation);
    // Track station change with specific function
    trackStationChange(direction, newStation.title, newStation.id);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    
    // Track volume changes (throttled to avoid too many events)
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    volumeTimeoutRef.current = setTimeout(() => {
      trackVolumeChange(newVolume);
      volumeTimeoutRef.current = null;
    }, 500);
  };

  const handleToggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    trackPlayerMinimize(newMinimizedState);
  };

  const handleClosePlayer = () => {
    setSelectedStation(null);
    trackPlayerClose();
  };

  // Track play/pause events with specific functions
  useEffect(() => {
    if (selectedStation) {
      // Calculate session duration for potential future use
      // const _sessionDuration = sessionStartTime 
      //   ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
      //   : undefined;
        
      if (isPlaying) {
        trackStationPlay(selectedStation.title, selectedStation.id);
      } else {
        trackStationPause(selectedStation.title, selectedStation.id);
      }
    }
  }, [isPlaying, selectedStation, sessionStartTime]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Clean up volume change timeout
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
        volumeTimeoutRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay message={`Unable to connect to Radio Crestin: ${error}`} />;
  }

  if (!stations.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">No stations available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      {/* Hidden SEOHeader for semantic HTML structure - not visually displayed */}
      <div className="sr-only">
        <h1>Radio Creștin Online - Posturi Radio Creștine Live 24/7</h1>
        <p>Descoperă cele mai bune radiouri creștine din România și din întreaga lume. Ascultă posturi radio creștine cu muzică creștină, predici inspiraționale și emisiuni spirituale.</p>
      </div>
      <StationGrid
        stations={stations}
        onSelectStation={handleStationSelect}
        selectedStation={selectedStation}
      />

      {selectedStation && (
        <FloatingPlayer
          station={selectedStation}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          audioError={audioError}
          isLoading={isLoading}
          isMinimized={isMinimized}
          onTogglePlay={togglePlay}
          onChangeStation={handleChangeStation}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleMinimize={handleToggleMinimize}
          onClose={handleClosePlayer}
        />
      )}

      <audio
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous"
        playsInline
        controls={false}
      />
      <audio
        ref={audioRef2}
        preload="none"
        crossOrigin="anonymous"
        playsInline
        controls={false}
      />

      <AudioDebugger
        audioRef={audioRef}
        audioRef2={audioRef2}
        currentStation={selectedStation || undefined}
        isPlaying={isPlaying}
        volume={volume}
        audioError={audioError}
      />
    </div>
  );
}
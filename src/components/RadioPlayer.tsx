import { useQuery } from 'urql';
import { useState, useEffect } from 'react';
import { Station } from '../types';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingDisplay } from './LoadingDisplay';
import { StationGrid } from './StationGrid';
import { FloatingPlayer } from './FloatingPlayer';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { event } from '../lib/analytics';

const GET_STATIONS = `
  query GetStations {
    stations(order_by: {order: asc}) {
      id
      order
      title
      stream_url
      proxy_stream_url
      thumbnail_url
      description
      uptime {
        is_up
        latency_ms
      }
      now_playing {
        song {
          name
          thumbnail_url
          artist {
            name
          }
        }
      }
      total_listeners
    }
  }
`;

export function RadioPlayer() {
  const [result] = useQuery<{ stations: Station[] }>({ 
    query: GET_STATIONS,
    requestPolicy: 'network-only'
  });
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const { data, fetching, error } = result;
  const stations = data?.stations || [];

  const {
    audioRef,
    isPlaying,
    volume,
    audioError,
    setVolume,
    togglePlay,
    setAudioError
  } = useAudioPlayer(selectedStation);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setIsMinimized(false);
    // Track station selection
    event({
      action: 'select_station',
      category: 'Station',
      label: station.title,
    });
  };

  const handleChangeStation = (direction: 'next' | 'prev') => {
    if (!stations.length || !selectedStation) return;
    
    const currentIndex = stations.findIndex(s => s.id === selectedStation.id);
    if (currentIndex === -1) return;
    
    setAudioError(null);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % stations.length
      : (currentIndex - 1 + stations.length) % stations.length;
    
    setSelectedStation(stations[newIndex]);
    // Track station change
    event({
      action: `change_station_${direction}`,
      category: 'Station',
      label: stations[newIndex].title,
    });
  };

  // Track play/pause events
  useEffect(() => {
    if (selectedStation) {
      event({
        action: isPlaying ? 'play_station' : 'pause_station',
        category: 'Playback',
        label: selectedStation.title,
      });
    }
  }, [isPlaying, selectedStation]);

  if (fetching) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay message={`Unable to connect to Radio Crestin: ${error.message}`} />;
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
          audioError={audioError}
          isMinimized={isMinimized}
          onTogglePlay={togglePlay}
          onChangeStation={handleChangeStation}
          onVolumeChange={setVolume}
          onToggleMinimize={() => setIsMinimized(!isMinimized)}
          onClose={() => setSelectedStation(null)}
        />
      )}

      <audio
        ref={audioRef}
        preload="none"
      />
    </div>
  );
}
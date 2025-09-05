import { useState, useEffect } from 'react';
import { Heart, List, Loader2, AlertCircle, Info, User, MapPin, Globe, ArrowLeft } from 'lucide-react';
import { Station } from '../types';
import { useStations } from '../hooks/useStations';
import { useFavorites } from '../hooks/useFavorites';
import { useBackgroundAudioPlayer } from '../hooks/useBackgroundAudioPlayer';
import { StationDisplay } from './StationDisplay';
import { StationControls } from './StationControls';
import { VolumeControl } from './VolumeControl';
import { DebugInfo } from './DebugInfo';

type View = 'player' | 'favorites' | 'all-stations' | 'about';

export function ExtensionPlayer() {
  const [currentView, setCurrentView] = useState<View>('player');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [skipMessage, setSkipMessage] = useState<string | null>(null);
  const [failedStations, setFailedStations] = useState<Set<string>>(new Set());
  const [resumeMessage, setResumeMessage] = useState<string | null>(null);
  
  const { stations, loading: stationsLoading, error: stationsError } = useStations();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Reset failed stations when station list changes
  useEffect(() => {
    setFailedStations(new Set());
  }, [stations, favorites]);

  // Handle automatic station skipping
  const handleStationFailed = (failedStation: Station) => {
    const currentList = currentView === 'favorites' ? favorites : stations;
    if (currentList.length <= 1) {
      // No other stations to skip to
      return;
    }

    // Mark this station as failed
    setFailedStations(prev => new Set(prev).add(failedStation.id));

    // Check if all stations have failed
    if (failedStations.size >= currentList.length - 1) {
      setSkipMessage('All stations appear to be offline. Please try again later.');
      setTimeout(() => setSkipMessage(null), 5000);
      return;
    }

    // Find next station that hasn't failed
    let currentIndex = currentList.findIndex(s => s.id === failedStation.id);
    let attempts = 0;
    let nextIndex = currentIndex;
    
    do {
      nextIndex = (nextIndex + 1) % currentList.length;
      attempts++;
    } while (failedStations.has(currentList[nextIndex].id) && attempts < currentList.length);

    if (attempts >= currentList.length) {
      // All stations have failed
      setSkipMessage('All stations appear to be offline. Please try again later.');
      setTimeout(() => setSkipMessage(null), 5000);
      return;
    }

    // Show skip message
    setSkipMessage(`Skipping "${failedStation.title}" - trying next station...`);
    setTimeout(() => setSkipMessage(null), 3000);

    // Auto-skip to next working station
    setTimeout(() => {
      setSelectedStation(currentList[nextIndex]);
      setCurrentStationIndex(nextIndex);
    }, 1000);
  };

  const {
    isPlaying,
    volume,
    isMuted,
    audioError,
    isLoading: audioLoading,
    currentBackgroundStation,
    setVolume,
    togglePlay,
    toggleMute,
    syncAudioState,
  } = useBackgroundAudioPlayer(selectedStation || undefined, handleStationFailed);

  // Initialize with saved station from background or first station/favorite
  useEffect(() => {
    const initializeStation = async () => {
      if (!selectedStation) {
        // First check if there's a station saved in background
        if (currentBackgroundStation) {
          console.log('Restoring station from background:', currentBackgroundStation.title);
          setSelectedStation(currentBackgroundStation);
          
          // Show resume message
          setResumeMessage(`Restored "${currentBackgroundStation.title}" from your last session`);
          setTimeout(() => setResumeMessage(null), 4000);
          
          // Find and set the correct index for the restored station
          const currentList = currentView === 'favorites' ? favorites : stations;
          const stationIndex = currentList.findIndex(s => s.id === currentBackgroundStation.id);
          if (stationIndex !== -1) {
            setCurrentStationIndex(stationIndex);
          }
        } else {
          // Fallback to first favorite or first station
          if (favorites.length > 0) {
            setSelectedStation(favorites[0]);
            setCurrentStationIndex(0);
          } else if (stations.length > 0) {
            setSelectedStation(stations[0]);
            setCurrentStationIndex(0);
          }
        }
      }
    };

    initializeStation();
  }, [stations, favorites, selectedStation, currentBackgroundStation, currentView]);

  const handleStationChange = (direction: 'next' | 'prev') => {
    const currentList = currentView === 'favorites' ? favorites : stations;
    if (currentList.length === 0) return;

    let currentIndex = currentList.findIndex(s => s.id === selectedStation?.id);
    if (currentIndex === -1) currentIndex = 0;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % currentList.length;
    } else {
      newIndex = currentIndex === 0 ? currentList.length - 1 : currentIndex - 1;
    }

    setSelectedStation(currentList[newIndex]);
    setCurrentStationIndex(newIndex);
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    const currentList = currentView === 'favorites' ? favorites : stations;
    setCurrentStationIndex(currentList.findIndex(s => s.id === station.id));
  };

  const renderStationList = (stationList: Station[], title: string) => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-white font-bold">{title}</h2>
        <button
          onClick={() => setCurrentView('player')}
          className="text-white/70 hover:text-purple-400 transition-colors"
        >
          Back to Player
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {stationList.length === 0 ? (
          <div className="text-center text-white/50 mt-8">
            <Heart size={48} className="mx-auto mb-4 opacity-50" />
            <p>{title === 'Favorites' ? 'No favorite stations yet' : 'No stations available'}</p>
            {title === 'Favorites' && (
              <p className="text-sm mt-2">Add stations to favorites by clicking the heart icon</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {stationList.map((station) => (
              <div
                key={station.id}
                onClick={() => handleStationSelect(station)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStation?.id === station.id
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <StationDisplay station={station} compact />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      isFavorite(station.id)
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-white/50 hover:text-red-400'
                    }`}
                  >
                    <Heart size={16} fill={isFavorite(station.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (stationsLoading) {
    return (
      <div className="h-full bg-spotify-base flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading stations...</p>
        </div>
      </div>
    );
  }

  if (stationsError) {
    return (
      <div className="h-full bg-spotify-base flex items-center justify-center p-4">
        <div className="text-center text-white">
          <AlertCircle size={32} className="mx-auto mb-4 text-red-400" />
          <p className="text-red-400 mb-2">Failed to load stations</p>
          <p className="text-white/70 text-sm mb-4">{stationsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
          <p className="text-white/50 text-xs mt-3">
            Make sure the extension has permission to access radiocrestin.ro
          </p>
        </div>
      </div>
    );
  }

  if (currentView === 'about') {
    return (
      <div className="h-full bg-spotify-base flex flex-col">
        {/* Simple Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-bold">About</h2>
          <button
            onClick={() => setCurrentView('player')}
            className="text-white/70 hover:text-purple-400 transition-colors"
          >
            Back to Player
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Central Content with Flowing Layout */}
          <div className="max-w-sm mx-auto space-y-8">
            
            {/* App Icon & Title */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <Heart size={32} className="text-white" fill="currentColor" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Radio Crestin</h3>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-6"></div>
            </div>

            {/* Author Section */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <User size={18} className="text-purple-400" />
                <span className="text-white font-medium">Author: Alex Ghiurau</span>
              </div>
            </div>

            {/* Location Section */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MapPin size={18} className="text-red-400" />
                <span className="text-white">Made with ❤️ in Transylvania</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10"></div>
              <Heart size={12} className="text-purple-400" fill="currentColor" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10"></div>
            </div>

            {/* Special Thanks */}
            <div className="text-center">
              <p className="text-white/80 text-sm mb-2">Special thanks to</p>
              <p className="text-purple-300 font-semibold text-lg">Iosif & Elisei Nicolae</p>
            </div>

            {/* Another Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10"></div>
              <Globe size={12} className="text-blue-400" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10"></div>
            </div>

            {/* Websites */}
            <div className="text-center space-y-4">
              <p className="text-white/80 text-sm">Visit our websites</p>
              <div className="space-y-3">
                <a
                  href="https://radiouri-crestine.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 transition-all duration-200 hover:scale-105"
                >
                  <Globe size={16} className="opacity-60" />
                  <span className="font-medium">radiouri-crestine.ro</span>
                  <div className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </a>
                <a
                  href="https://radio-crestin.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 transition-all duration-200 hover:scale-105"
                >
                  <Globe size={16} className="opacity-60" />
                  <span className="font-medium">radio-crestin.ro</span>
                  <div className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'favorites') {
    return (
      <div className="h-full bg-spotify-base">
        {renderStationList(favorites, 'Favorites')}
      </div>
    );
  }

  if (currentView === 'all-stations') {
    return (
      <div className="h-full bg-spotify-base">
        {renderStationList(stations, 'All Stations')}
      </div>
    );
  }

  // Player view
  return (
    <div className="h-full bg-spotify-base flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('about')}
            className="text-white/50 hover:text-purple-400 transition-colors p-1"
            title="About"
          >
            <Info size={16} />
          </button>
          <h1 className="text-white font-bold">Radio Crestin</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('favorites')}
            className="flex items-center gap-1 text-white/70 hover:text-purple-400 transition-colors p-1"
            title="Favorites"
          >
            <Heart size={16} />
            {favorites.length > 0 && (
              <span className="text-xs text-purple-400">({favorites.length})</span>
            )}
          </button>
          <button
            onClick={() => setCurrentView('all-stations')}
            className="flex items-center text-white/70 hover:text-purple-400 transition-colors p-1"
            title="All Stations"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Player Content */}
      <div className="flex-1 p-4 flex flex-col">
        {selectedStation ? (
          <>
            <StationDisplay station={selectedStation} />
            
            {resumeMessage && (
              <div className="bg-green-500/20 text-green-200 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <div className="text-green-400">
                  <Info size={16} />
                </div>
                {resumeMessage}
              </div>
            )}

            {skipMessage && (
              <div className="bg-yellow-500/20 text-yellow-200 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <div className="animate-spin">
                  <Loader2 size={16} />
                </div>
                {skipMessage}
              </div>
            )}

            {audioError && !skipMessage && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">
                {audioError}
              </div>
            )}

            {audioLoading && (
              <div className="bg-purple-500/20 text-purple-200 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Loading stream...
              </div>
            )}

            <div className="mt-auto space-y-4">
              <StationControls
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onChangeStation={handleStationChange}
                onSkipStation={() => handleStationFailed(selectedStation)}
                hasError={!!audioError && !skipMessage}
              />

              <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={setVolume}
                onToggleMute={toggleMute}
              />

              <div className="flex items-center justify-center">
                <button
                  onClick={() => toggleFavorite(selectedStation)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isFavorite(selectedStation.id)
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-red-400'
                  }`}
                >
                  <Heart size={16} fill={isFavorite(selectedStation.id) ? 'currentColor' : 'none'} />
                  {isFavorite(selectedStation.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/50">
            <div className="text-center">
              <AlertCircle size={32} className="mx-auto mb-4" />
              <p>No station selected</p>
            </div>
          </div>
        )}
      </div>
      <DebugInfo error={stationsError} stations={stations} />
    </div>
  );
}

import { Station } from '../types';
import { StationCard } from './StationCard';
import { FavoriteStations } from './FavoriteStations';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { trackSearch } from '../lib/analytics';

interface StationGridProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  selectedStation: Station | null;
}

export function StationGrid({ stations, onSelectStation, selectedStation }: StationGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filteredStations = stations.filter(station => 
    station.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Track search events with debouncing
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        trackSearch(searchQuery, filteredStations.length);
      }, 500); // Debounce search tracking by 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, filteredStations.length]);

  return (
    <div>
      {/* Sticky Header Section for Large Displays */}
      <div className="lg:sticky lg:top-0 lg:z-10 bg-gradient-to-br from-purple-900/80 via-gray-900/80 to-black/80 lg:backdrop-blur-lg lg:border-b lg:border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Radiouri Creștine Online</h1>
              <p className="text-white/70">Ascultă muzică creștină și adaugă la favorite stațiile preferate</p>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Caută stații radio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-white/40 rounded-full py-2 pl-10 pr-4 outline-none focus:ring-2 ring-purple-500 focus:bg-white/15 transition-all"
                aria-label="Caută stații radio"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pt-8 pb-8">
        <FavoriteStations 
          favorites={favorites}
          onSelectStation={onSelectStation}
          selectedStationId={selectedStation?.id}
          onRemoveFavorite={toggleFavorite}
        />
        
        {filteredStations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">Nu s-au găsit stații pentru "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onSelect={onSelectStation}
                isSelected={selectedStation?.id === station.id}
                isFavorite={isFavorite(station.id)}
                onToggleFavorite={toggleFavorite}
                maxFavoritesReached={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
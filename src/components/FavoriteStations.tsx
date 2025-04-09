import { Heart, X } from 'lucide-react';
import { Station } from '../types';

interface FavoriteStationsProps {
  favorites: Station[];
  onSelectStation: (station: Station) => void;
  selectedStationId?: string;
  onRemoveFavorite?: (station: Station) => void;
}

export function FavoriteStations({ 
  favorites, 
  onSelectStation, 
  selectedStationId,
  onRemoveFavorite 
}: FavoriteStationsProps) {
  if (favorites.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, station: Station) => {
    e.stopPropagation();
    onRemoveFavorite?.(station);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={16} className="text-purple-400" />
        <h2 className="text-white font-medium">Favorite</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {favorites.map(station => (
          <button
            key={station.id}
            onClick={() => onSelectStation(station)}
            className={`group relative flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg p-2 transition-all ${
              selectedStationId === station.id ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleRemove(e, station)}
                className="bg-black/40 hover:bg-red-500 text-white/70 hover:text-white rounded-full p-1 backdrop-blur-sm transition-all"
                title="Remove from favorites"
              >
                <X size={14} />
              </button>
            </div>
            <img
              src={station.thumbnail_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800"}
              alt={station.title}
              className="w-10 h-10 rounded-md object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-white truncate max-w-[120px]">{station.title}</p>
              {station.now_playing?.song && (
                <p className="text-xs text-white/50 truncate max-w-[120px]">
                  {station.now_playing.song.name}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
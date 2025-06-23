import { Headphones, Heart } from 'lucide-react';
import { Station } from '../types';
import { trackFavoriteToggle } from '../lib/analytics';

interface StationCardProps {
  station: Station;
  onSelect: (station: Station) => void;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: (station: Station) => void;
  maxFavoritesReached: boolean;
}

export function StationCard({ 
  station, 
  onSelect, 
  isSelected,
  isFavorite,
  onToggleFavorite
}: StationCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(station);
    // Track favorite toggle
    trackFavoriteToggle(isFavorite ? 'remove' : 'add', station.title, station.id);
  };

  return (
    <div 
      className={`relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer transition-all hover:bg-white/10 ${
        isSelected ? 'ring-2 ring-purple-500' : ''
      }`}
      onClick={() => onSelect(station)}
    >
      <div className="aspect-square relative">
        <img
          src={station.now_playing?.song?.thumbnail_url || station.thumbnail_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800"}
          alt={station.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold text-white mb-1 truncate">{station.title}</h3>
          {station.now_playing?.song && (
            <p className="text-sm text-white/70 truncate">
              {station.now_playing.song.name} - {station.now_playing.song.artist?.name}
            </p>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col h-[140px]">
        <p className="text-sm text-white/60 line-clamp-3 leading-relaxed mb-auto">{station.description}</p>
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-purple-400">
            <Headphones size={16} />
            <span className="text-sm">{station.total_listeners || 0}</span>
          </div>
          <button 
            onClick={handleFavoriteClick}
            className={`text-white/70 hover:text-purple-400 transition-colors ${
              isFavorite ? 'text-purple-400' : ''
            }`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
import { Station } from '../types';

interface StationDisplayProps {
  station: Station;
  compact?: boolean;
}

export function StationDisplay({ station, compact = false }: StationDisplayProps) {
  const thumbnailUrl = station.now_playing?.song?.thumbnail_url || 
                      station.thumbnail_url || 
                      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800";

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={thumbnailUrl}
          alt={station.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-medium text-sm truncate">{station.title}</h3>
          {station.now_playing?.song && (
            <p className="text-white/70 text-xs truncate">
              {station.now_playing.song.name}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-6">
      <img
        src={thumbnailUrl}
        alt={station.title}
        className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-lg"
      />
      
      <h2 className="text-white text-xl font-bold mb-2">{station.title}</h2>
      
      {station.now_playing?.song && (
        <div className="space-y-1">
          <p className="text-purple-200 font-medium">
            {station.now_playing.song.name}
          </p>
          {station.now_playing.song.artist && (
            <p className="text-white/70 text-sm">
              {station.now_playing.song.artist.name}
            </p>
          )}
        </div>
      )}
      
      {station.total_listeners && (
        <p className="text-white/50 text-sm mt-2">
          {station.total_listeners} listeners
        </p>
      )}
    </div>
  );
}

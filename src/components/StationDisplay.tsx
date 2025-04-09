import { Wifi, WifiOff } from 'lucide-react';
import { Station } from '../types';

interface StationDisplayProps {
  station: Station;
}

export function StationDisplay({ station }: StationDisplayProps) {
  return (
    <div className="relative aspect-video mb-6 rounded-xl overflow-hidden group">
      <img
        src={station.now_playing?.song?.thumbnail_url || station.thumbnail_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800"}
        alt={station.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold tracking-tight">{station.title}</h2>
          {station.uptime?.is_up ? (
            <Wifi size={16} className="text-spotify-highlight" />
          ) : (
            <WifiOff size={16} className="text-red-400" />
          )}
        </div>
        {station.now_playing?.song && (
          <p className="text-sm text-white/70 font-medium">
            {station.now_playing.song.name}
            {station.now_playing.song.artist?.name && (
              <span className="text-white/50"> • {station.now_playing.song.artist.name}</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
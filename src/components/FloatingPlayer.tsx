import { useState } from 'react';
import { Minimize2, Maximize2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Station } from '../types';
import { StationDisplay } from './StationDisplay';
import { StationControls } from './StationControls';
import { VolumeControl } from './VolumeControl';

interface FloatingPlayerProps {
  station: Station;
  isPlaying: boolean;
  volume: number;
  audioError: string | null;
  isMinimized: boolean;
  onTogglePlay: () => void;
  onChangeStation: (direction: 'next' | 'prev') => void;
  onVolumeChange: (value: number) => void;
  onToggleMinimize: () => void;
  onClose: () => void;
}

export function FloatingPlayer({
  station,
  isPlaying,
  volume,
  audioError,
  isMinimized,
  onTogglePlay,
  onChangeStation,
  onVolumeChange,
  onToggleMinimize,
  onClose,
}: FloatingPlayerProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-spotify-base backdrop-blur-lg rounded-full shadow-2xl flex items-center overflow-hidden group hover:bg-spotify-hover transition-colors">
        <img
          src={station.now_playing?.song?.thumbnail_url || station.thumbnail_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800"}
          alt={station.title}
          className="w-12 h-12 object-cover"
        />
        <div className="px-4 flex items-center gap-3">
          <div className="hidden group-hover:block">
            <p className="text-white font-medium truncate max-w-[150px]">{station.title}</p>
            {station.now_playing?.song && (
              <p className="text-xs text-white/70 truncate max-w-[150px]">
                {station.now_playing.song.name}
              </p>
            )}
          </div>
          <StationControls
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
            onChangeStation={onChangeStation}
            minimized={true}
          />
          <div className="h-8 w-[1px] bg-white/10 mx-1" />
          <button
            onClick={onToggleMinimize}
            className="text-white/70 hover:text-purple-400 transition-colors"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 bg-spotify-base backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
      style={{ width: 'min(60vw, 450px)', maxHeight: '80vh' }}
    >
      <div className="flex flex-col h-full max-h-[700px]">
        <div className="flex justify-end gap-2 p-4">
          <button
            onClick={onToggleMinimize}
            className="text-white/70 hover:text-purple-400 transition-colors"
          >
            <Minimize2 size={20} />
          </button>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-purple-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 overflow-y-auto scrollbar-hide">
          <StationDisplay station={station} />

          {audioError && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm">
              {audioError}
            </div>
          )}

          <div className="relative mb-6">
            <p 
              className={`text-white/70 text-sm leading-relaxed ${
                isDescriptionExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {station.description}
            </p>
            {station.description.length > 100 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-purple-100 hover:text-purple-400 text-sm flex items-center gap-1 mt-2 font-medium"
              >
                {isDescriptionExpanded ? (
                  <>Show less <ChevronUp size={16} /></>
                ) : (
                  <>Show more <ChevronDown size={16} /></>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="p-6 pt-4 bg-gradient-to-t from-black/40 to-transparent border-t border-white/5">
          <StationControls
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
            onChangeStation={onChangeStation}
            minimized={false}
          />

          <VolumeControl
            volume={volume}
            onVolumeChange={onVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}
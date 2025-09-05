import { Play, Pause, SkipForward, SkipBack, FastForward } from 'lucide-react';

interface StationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onChangeStation: (direction: 'next' | 'prev') => void;
  onSkipStation?: () => void;
  hasError?: boolean;
  minimized?: boolean;
}

export function StationControls({
  isPlaying,
  onTogglePlay,
  onChangeStation,
  onSkipStation,
  hasError = false,
  minimized = false,
}: StationControlsProps) {
  const iconSize = minimized ? 16 : 24;
  const buttonClass = minimized 
    ? "text-white/70 hover:text-purple-400 transition-colors"
    : "text-white hover:text-purple-400 transition-colors p-2 rounded-full hover:bg-white/10";

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onChangeStation('prev')}
        className={buttonClass}
        title="Previous station"
      >
        <SkipBack size={iconSize} />
      </button>
      
      <button
        onClick={onTogglePlay}
        className={`${buttonClass} ${minimized ? '' : 'bg-purple-600 hover:bg-purple-700 p-3'}`}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
      </button>
      
      <button
        onClick={() => onChangeStation('next')}
        className={buttonClass}
        title="Next station"
      >
        <SkipForward size={iconSize} />
      </button>
      
      {hasError && onSkipStation && !minimized && (
        <button
          onClick={onSkipStation}
          className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 rounded-full hover:bg-yellow-400/10 border border-yellow-400/30"
          title="Skip to working station"
        >
          <FastForward size={iconSize} />
        </button>
      )}
    </div>
  );
}

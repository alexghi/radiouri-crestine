import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface StationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onChangeStation: (direction: 'next' | 'prev') => void;
  minimized?: boolean;
}

export function StationControls({ 
  isPlaying, 
  onTogglePlay, 
  onChangeStation,
  minimized = false 
}: StationControlsProps) {
  if (minimized) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChangeStation('prev')}
          className="text-white/70 hover:text-purple-400 transition-colors"
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={onTogglePlay}
          className="text-white/70 hover:text-purple-400 transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={() => onChangeStation('next')}
          className="text-white/70 hover:text-purple-400 transition-colors"
        >
          <SkipForward size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-6 mb-6">
      <button
        onClick={() => onChangeStation('prev')}
        className="text-purple-200/70 hover:text-purple-400 transition-colors"
      >
        <SkipBack size={28} />
      </button>

      <button
        onClick={onTogglePlay}
        className="bg-purple-500 hover:bg-purple-500/90 text-purple-200 rounded-full p-4 transition-all hover:scale-105"
      >
        {isPlaying ? <Pause size={32} /> : <Play size={32} className="relative left-[2px]" />}
      </button>

      <button
        onClick={() => onChangeStation('next')}
        className="text-purple-200/70 hover:text-purple-400 transition-colors"
      >
        <SkipForward size={28} />
      </button>
    </div>
  );
}
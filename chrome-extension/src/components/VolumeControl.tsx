import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted?: boolean;
  onVolumeChange: (value: number) => void;
  onToggleMute?: () => void;
}

export function VolumeControl({
  volume,
  isMuted = false,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  // Calculate volume slider background
  const fillPercent = (isMuted ? 0 : volume) * 100;
  const volumeSliderStyle = {
    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${fillPercent}%, rgba(255,255,255,0.2) ${fillPercent}%, rgba(255,255,255,0.2) 100%)`
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="text-white/70 hover:text-purple-400 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => {
          const newVolume = parseFloat(e.target.value);
          if (onToggleMute) {
            if (newVolume === 0 && !isMuted) {
              onToggleMute();
            } else if (newVolume > 0 && isMuted) {
              onToggleMute();
            }
          }
          onVolumeChange(newVolume);
        }}
        className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer transition-all hover:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-purple-300"
        style={volumeSliderStyle}
      />
    </div>
  );
}

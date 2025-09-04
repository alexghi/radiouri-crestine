import React from 'react';

interface AudioDebuggerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  audioRef2: React.RefObject<HTMLAudioElement>;
  currentStation?: { title: string; id: string };
  isPlaying: boolean;
  volume: number;
  audioError: string | null;
}

export function AudioDebugger({ 
  audioRef, 
  audioRef2, 
  currentStation, 
  isPlaying, 
  volume, 
  audioError 
}: AudioDebuggerProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Only show if AUDIO_DEBUG environment variable is set
  const isDebugEnabled = import.meta.env.VITE_AUDIO_DEBUG === 'true';
  
  if (!isDebugEnabled) {
    return null;
  }
  
  const getAudioInfo = (audio: HTMLAudioElement | null, name: string) => {
    if (!audio) return { name, status: 'Not available' };
    
    return {
      name,
      src: audio.src,
      readyState: audio.readyState,
      readyStateText: [
        'HAVE_NOTHING',
        'HAVE_METADATA', 
        'HAVE_CURRENT_DATA',
        'HAVE_FUTURE_DATA',
        'HAVE_ENOUGH_DATA'
      ][audio.readyState] || 'Unknown',
      paused: audio.paused,
      volume: audio.volume,
      muted: audio.muted,
      currentTime: audio.currentTime,
      duration: audio.duration,
      error: audio.error ? {
        code: audio.error.code,
        message: audio.error.message
      } : null,
      networkState: audio.networkState,
      buffered: audio.buffered.length > 0 ? `${audio.buffered.start(0)}-${audio.buffered.end(0)}` : 'None'
    };
  };

  const testAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    console.log('=== AUDIO TEST START ===');
    console.log('Current station:', currentStation);
    console.log('Audio details:', getAudioInfo(audio, 'Test Audio'));
    
    // Test basic audio functionality
    audio.volume = 0.1; // Low volume for test
    audio.muted = false;
    
    try {
      console.log('Attempting to play...');
      await audio.play();
      console.log('Play successful');
      
      setTimeout(() => {
        console.log('Audio status after 2 seconds:', {
          paused: audio.paused,
          currentTime: audio.currentTime,
          volume: audio.volume,
          muted: audio.muted
        });
        audio.pause();
      }, 2000);
    } catch (error) {
      console.error('Play failed:', error);
    }
    console.log('=== AUDIO TEST END ===');
  };

  if (!isVisible) {
    return (
      <div className="fixed top-4 left-4 z-[10000]">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          🐛 Debug Audio
        </button>
      </div>
    );
  }

  const audio1Info = getAudioInfo(audioRef.current, 'Audio 1');
  const audio2Info = getAudioInfo(audioRef2.current, 'Audio 2');

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-y-auto z-[10000]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Audio Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <strong>Station:</strong> {currentStation?.title || 'None'}
        </div>
        <div>
          <strong>Playing:</strong> {isPlaying ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Volume:</strong> {volume}
        </div>
        <div>
          <strong>Error:</strong> {audioError || 'None'}
        </div>

        <button
          onClick={testAudio}
          className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
        >
          Test Audio
        </button>

        <div className="border-t border-gray-600 pt-2">
          <strong>Audio Element 1:</strong>
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(audio1Info, null, 2)}
          </pre>
        </div>

        <div className="border-t border-gray-600 pt-2">
          <strong>Audio Element 2:</strong>
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(audio2Info, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

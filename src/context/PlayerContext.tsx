import { createContext, useContext, useState, ReactNode } from 'react';
import { Station } from '../types';

interface PlayerContextType {
  selectedStation: Station | null;
  setSelectedStation: (station: Station | null) => void;
  selectAndPlayStation: (station: Station) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const selectAndPlayStation = (station: Station) => {
    setSelectedStation(station);
  };

  return (
    <PlayerContext.Provider value={{
      selectedStation,
      setSelectedStation,
      selectAndPlayStation
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

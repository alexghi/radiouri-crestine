import { useState, useEffect } from 'react';
import { Station } from '../types';

const FAVORITES_KEY = 'radio-crestin-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);

  useEffect(() => {
    // Load favorites from Chrome storage
    chrome.storage.sync.get([FAVORITES_KEY], (result) => {
      if (result[FAVORITES_KEY]) {
        setFavorites(result[FAVORITES_KEY]);
      }
    });
  }, []);

  useEffect(() => {
    // Save favorites to Chrome storage
    chrome.storage.sync.set({ [FAVORITES_KEY]: favorites });
  }, [favorites]);

  const toggleFavorite = (station: Station) => {
    setFavorites(current => {
      const exists = current.some(fav => fav.id === station.id);
      if (exists) {
        return current.filter(fav => fav.id !== station.id);
      }
      return [...current, station];
    });
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(fav => fav.id === stationId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    maxReached: false
  };
}

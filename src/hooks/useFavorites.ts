import { useState, useEffect } from 'react';
import { Station } from '../types';

const FAVORITES_KEY = 'radio-crestin-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
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
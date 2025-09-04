import { useState, useEffect } from 'react';

// Define types for search results
export interface SearchResult {
  id: number;
  type: 'artist' | 'song' | 'station';
  label: string;
  value: string;
  thumbnail_url?: string;
  artist_name?: string;
  artist_id?: number;
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // For now, disable search functionality since we switched to REST API for stations
  // This can be implemented with a REST search endpoint later
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 2) {
      setIsSearching(true);
      setSearchError(null);
      
      // Simulate search (empty results for now)
      setTimeout(() => {
        setSearchResults([]);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
    }
  }, [debouncedQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    clearSearch,
    hasResults: searchResults.length > 0,
  };
}

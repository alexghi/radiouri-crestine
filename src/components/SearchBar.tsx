import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { SearchResult } from '../types';

interface SearchBarProps {
  onSelectResult?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSelectResult, 
  placeholder = "Search songs, artists, stations...",
  className = ""
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    clearSearch,
    hasResults,
  } = useSearch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isExpanded && e.target.value) {
      setIsExpanded(true);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult?.(result);
    setIsExpanded(false);
    clearSearch();
  };

  const handleClear = () => {
    clearSearch();
    setIsExpanded(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery && setIsExpanded(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isExpanded && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {isSearching && (
            <div className="p-3 text-gray-400 text-center">
              Searching...
            </div>
          )}
          
          {searchError && (
            <div className="p-3 text-red-400 text-center">
              Search failed. Please try again.
            </div>
          )}
          
          {!isSearching && !searchError && !hasResults && searchQuery.length >= 2 && (
            <div className="p-3 text-gray-400 text-center">
              No results found
            </div>
          )}
          
          {hasResults && searchResults.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelectResult(result)}
              className="w-full text-left p-3 hover:bg-gray-700 flex items-center space-x-3 border-b border-gray-700 last:border-b-0"
            >
              {result.thumbnail_url ? (
                <img
                  src={result.thumbnail_url}
                  alt=""
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    {result.type === 'song' ? '♪' : result.type === 'artist' ? '♫' : '📻'}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">
                  {result.value}
                </div>
                {result.artist_name && (
                  <div className="text-gray-400 text-sm truncate">
                    by {result.artist_name}
                  </div>
                )}
                <div className="text-gray-500 text-xs capitalize">
                  {result.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

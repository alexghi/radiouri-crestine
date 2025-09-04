import { useState, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { useStations } from '../hooks/useStations';
import { Station } from '../types';

interface StationDropdownProps {
  onSelectStation?: (station: Station) => void;
  className?: string;
}

export function StationDropdown({ 
  onSelectStation, 
  className = ""
}: StationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { stations, loading, error } = useStations();

  // Filter stations based on search query
  const filteredStations = stations.filter(station => 
    station.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStation = (station: Station) => {
    setSelectedStation(station);
    setIsOpen(false);
    setSearchQuery('');
    onSelectStation?.(station);
  };

  const handleClear = () => {
    setSelectedStation(null);
    setSearchQuery('');
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-station-dropdown]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} data-station-dropdown>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="truncate text-left">
              {selectedStation ? selectedStation.title : 'Caută stații radio...'}
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {selectedStation && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="text-gray-400 hover:text-white cursor-pointer p-1 -m-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClear();
                  }
                }}
              >
                <X className="h-4 w-4" />
              </div>
            )}
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search input inside dropdown */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrează stațiile..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {loading && (
              <div className="p-3 text-gray-400 text-center">
                Se încarcă stațiile...
              </div>
            )}
            
            {error && (
              <div className="p-3 text-red-400 text-center text-sm">
                Eroare la încărcarea stațiilor
              </div>
            )}
            
            {!loading && !error && filteredStations.length === 0 && (
              <div className="p-3 text-gray-400 text-center text-sm">
                Nicio stație găsită
              </div>
            )}
            
            {!loading && !error && filteredStations.map((station) => (
              <button
                key={station.id}
                onClick={() => handleSelectStation(station)}
                className="w-full text-left p-3 hover:bg-gray-700 flex items-center space-x-3 border-b border-gray-700 last:border-b-0 transition-colors"
              >
                {station.thumbnail_url ? (
                  <img
                    src={station.thumbnail_url}
                    alt=""
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-400">📻</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {station.title}
                  </div>
                  {station.description && (
                    <div className="text-gray-400 text-sm truncate">
                      {station.description.substring(0, 100)}
                      {station.description.length > 100 ? '...' : ''}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    {station.uptime?.is_up && (
                      <span className="text-green-400 text-xs">● Live</span>
                    )}
                    {station.total_listeners && (
                      <span className="text-gray-500 text-xs">
                        {station.total_listeners} ascultători
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

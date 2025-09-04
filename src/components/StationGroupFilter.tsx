import { useState } from 'react';
import { useStationGroups } from '../hooks/useStationGroups';
import { ChevronDown } from 'lucide-react';

interface StationGroupFilterProps {
  selectedGroupId?: number;
  onGroupChange: (groupId: number | undefined) => void;
  className?: string;
}

export function StationGroupFilter({ 
  selectedGroupId, 
  onGroupChange, 
  className = "" 
}: StationGroupFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { stationGroups, isLoading, error } = useStationGroups();

  if (isLoading || error || !stationGroups.length) {
    return null;
  }

  const selectedGroup = stationGroups.find(group => group.id === selectedGroupId);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
      >
        <span className="truncate">
          {selectedGroup ? selectedGroup.name : 'All Stations'}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-40 max-h-64 overflow-y-auto">
          <button
            onClick={() => {
              onGroupChange(undefined);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-2 hover:bg-gray-700 border-b border-gray-700 ${
              !selectedGroupId ? 'bg-purple-600/30 text-purple-300' : 'text-white'
            }`}
          >
            All Stations
          </button>
          
          {stationGroups
            .filter(group => group.slug !== 'radio') // Filter out "Toate" which is usually the default
            .sort((a, b) => a.order - b.order)
            .map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  onGroupChange(group.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-700 border-b border-gray-700 last:border-b-0 ${
                  selectedGroupId === group.id ? 'bg-purple-600/30 text-purple-300' : 'text-white'
                }`}
              >
                {group.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

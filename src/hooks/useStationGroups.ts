import { useState, useEffect } from 'react';

export interface StationGroup {
  id: number;
  name: string;
  slug: string;
  order: number;
  station_to_station_groups: Array<{
    id: number;
  }>;
}

export function useStationGroups() {
  const [stationGroups, setStationGroups] = useState<StationGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStationGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Round timestamp to nearest 10 seconds
      const timestamp = Math.floor(Date.now() / 1000 / 10) * 10;
      
      const response = await fetch(`https://api.radiocrestin.ro/api/v1/stations?timestamp=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract station groups from the response
      const groups: StationGroup[] = data.data?.station_groups || [];
      
      // Sort by order
      groups.sort((a, b) => a.order - b.order);
      
      setStationGroups(groups);
    } catch (err) {
      console.error('Failed to fetch station groups:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch station groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStationGroups();
  }, []);

  return {
    stationGroups,
    isLoading,
    error,
  };
}

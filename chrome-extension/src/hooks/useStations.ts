import { useState, useEffect } from 'react';
import { Station } from '../types';

interface ApiStation {
  __typename?: string;
  id: number;
  slug: string;
  order: number;
  title: string;
  website?: string;
  email?: string;
  stream_url: string;
  proxy_stream_url?: string;
  hls_stream_url?: string;
  thumbnail_url?: string;
  total_listeners?: number;
  radio_crestin_listeners?: number;
  description: string;
  description_action_title?: string;
  description_link?: string;
  feature_latest_post?: boolean;
  facebook_page_id?: string;
  station_streams?: Array<{
    __typename?: string;
    order: number;
    type: string;
    stream_url: string;
  }>;
  posts?: Array<{
    __typename?: string;
    id: number;
    title: string;
    description?: string;
    link: string;
    published: string;
  }>;
  uptime?: {
    __typename?: string;
    is_up: boolean;
    latency_ms: number;
    timestamp?: string;
  };
  now_playing?: {
    __typename?: string;
    id?: number;
    timestamp?: string;
    song?: {
      __typename?: string;
      id?: number;
      name: string;
      thumbnail_url?: string;
      artist?: {
        __typename?: string;
        id?: number;
        name: string;
        thumbnail_url?: string;
      };
    } | null;
  };
  reviews?: Array<any>;
}

interface StationsApiResponse {
  data: {
    __typename?: string;
    stations: ApiStation[];
    station_groups: Array<{
      __typename?: string;
      id: number;
      name: string;
      slug: string;
      order: number;
      station_to_station_groups: Array<{
        __typename?: string;
        station_id: number;
        order: number;
      }>;
    }>;
  };
}

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Round timestamp to nearest 10 seconds
      const timestamp = Math.floor(Date.now() / 1000 / 10) * 10;
      
      const response = await fetch(`https://api.radiocrestin.ro/api/v1/stations?timestamp=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: StationsApiResponse = await response.json();
      
      // Check if data structure is valid
      if (!data.data || !data.data.stations) {
        throw new Error('Invalid API response structure');
      }
      
      // Transform the data to match our Station interface
      const transformedStations: Station[] = data.data.stations.map(station => ({
        id: station.id.toString(),
        order: station.order,
        title: station.title,
        stream_url: station.stream_url,
        proxy_stream_url: station.proxy_stream_url,
        thumbnail_url: station.thumbnail_url,
        description: station.description,
        uptime: station.uptime ? {
          is_up: station.uptime.is_up,
          latency_ms: station.uptime.latency_ms
        } : undefined,
        now_playing: station.now_playing ? {
          song: station.now_playing.song ? {
            name: station.now_playing.song.name,
            thumbnail_url: station.now_playing.song.thumbnail_url,
            artist: station.now_playing.song.artist ? {
              name: station.now_playing.song.artist.name
            } : undefined
          } : undefined
        } : undefined,
        total_listeners: station.total_listeners,
        // Additional fields from REST API
        slug: station.slug,
        website: station.website,
        email: station.email,
        hls_stream_url: station.hls_stream_url,
        radio_crestin_listeners: station.radio_crestin_listeners,
        description_action_title: station.description_action_title,
        description_link: station.description_link,
        feature_latest_post: station.feature_latest_post,
        facebook_page_id: station.facebook_page_id,
        station_streams: station.station_streams,
        posts: station.posts,
        reviews: station.reviews
      }));
      
      // Sort by order field
      transformedStations.sort((a, b) => a.order - b.order);
      
      setStations(transformedStations);
    } catch (err) {
      console.error('Failed to fetch stations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const refetch = () => {
    fetchStations();
  };

  return {
    stations,
    loading,
    error,
    refetch
  };
}

export interface Artist {
  name: string;
}

export interface Song {
  name: string;
  thumbnail_url?: string;
  artist?: Artist;
}

export interface NowPlaying {
  song?: Song;
}

export interface Uptime {
  is_up: boolean;
  latency_ms: number;
}

export interface Station {
  id: string;
  order: number;
  title: string;
  stream_url: string;
  proxy_stream_url?: string;
  thumbnail_url?: string;
  description: string;
  uptime?: Uptime;
  now_playing?: NowPlaying;
  total_listeners?: number;
  // Additional fields from REST API
  slug?: string;
  website?: string;
  email?: string;
  hls_stream_url?: string;
  radio_crestin_listeners?: number;
  description_action_title?: string;
  description_link?: string;
  feature_latest_post?: boolean;
  facebook_page_id?: string;
  station_streams?: Array<{
    order: number;
    type: string;
    stream_url: string;
  }>;
  posts?: Array<{
    id: number;
    title: string;
    description?: string;
    link: string;
    published: string;
  }>;
  reviews?: Array<any>;
}

export interface PlayerState {
  isMinimized: boolean;
  selectedStation: Station | null;
}

export interface StationGroup {
  id: number;
  name: string;
  slug: string;
  order: number;
  station_to_station_groups: Array<{
    id: number;
  }>;
}

export interface SearchResult {
  id: number;
  type: 'artist' | 'song' | 'station';
  label: string;
  value: string;
  thumbnail_url?: string;
  artist_name?: string;
  artist_id?: number;
}

export interface Post {
  id: number;
  title: string;
  description?: string;
  link: string;
  published: string;
  station_id: number;
}
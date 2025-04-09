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
}

export interface PlayerState {
  isMinimized: boolean;
  selectedStation: Station | null;
}
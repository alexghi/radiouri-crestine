// Google Analytics 4 implementation
export const GA_TRACKING_ID = 'G-DJSDBYJ2RB'

// Initialize GA4
export const initGA = () => {
  // Prevent multiple initializations
  if (typeof window.gtag !== 'undefined') {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href
  });
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Generic event tracking
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for radio station events
export const trackStationSelect = (stationName: string, stationId: string) => {
  event({
    action: 'select_station',
    category: 'Radio Station',
    label: stationName,
    value: parseInt(stationId) || undefined
  });
};

export const trackStationPlay = (stationName: string, stationId: string) => {
  event({
    action: 'play_station',
    category: 'Playback',
    label: stationName,
    value: parseInt(stationId) || undefined
  });
};

export const trackStationPause = (stationName: string, stationId: string) => {
  event({
    action: 'pause_station',
    category: 'Playback',
    label: stationName,
    value: parseInt(stationId) || undefined
  });
};

export const trackStationChange = (direction: 'next' | 'prev', stationName: string, stationId: string) => {
  event({
    action: `change_station_${direction}`,
    category: 'Navigation',
    label: stationName,
    value: parseInt(stationId) || undefined
  });
};

export const trackFavoriteToggle = (action: 'add' | 'remove', stationName: string, stationId: string) => {
  event({
    action: `${action}_favorite`,
    category: 'Favorites',
    label: stationName,
    value: parseInt(stationId) || undefined
  });
};

export const trackVolumeChange = (newVolume: number) => {
  event({
    action: 'volume_change',
    category: 'Playback',
    label: `Volume: ${Math.round(newVolume * 100)}%`,
    value: Math.round(newVolume * 100)
  });
};

export const trackSearch = (searchQuery: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchQuery,
    value: resultsCount
  });
};

export const trackPlayerMinimize = (isMinimized: boolean) => {
  event({
    action: isMinimized ? 'minimize_player' : 'maximize_player',
    category: 'UI Interaction',
    label: 'Player Window'
  });
};

export const trackPlayerClose = () => {
  event({
    action: 'close_player',
    category: 'UI Interaction',
    label: 'Player Window'
  });
};

export const trackNewsletterSubscribe = (success: boolean, email?: string) => {
  event({
    action: success ? 'newsletter_subscribe_success' : 'newsletter_subscribe_failed',
    category: 'Newsletter',
    label: email ? 'Email provided' : 'No email'
  });
};

export const trackAudioError = (errorMessage: string, stationName?: string) => {
  event({
    action: 'audio_error',
    category: 'Error',
    label: `${stationName || 'Unknown'}: ${errorMessage}`
  });
};
export interface VideoSource {
  id: string;
  label: string; // e.g. "سيرفر رئيسي 1080p", "سيرفر بديل 720p"
  quality: '4K' | '1080p' | '720p' | '480p' | 'auto';
  url: string;
  type: 'hls' | 'mp4';
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  year: number;
  genres: string[];
  quality: '4K' | 'HD' | 'FHD' | 'CAM';
  rating: number; // e.g. 8.9
  duration: number; // in minutes
  language: string;
  country: string;
  cast: string[];
  director?: string;
  sources: VideoSource[];
  isFeatured?: boolean;
  isTrending?: boolean;
  viewsCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number; // in minutes
  sources: VideoSource[];
  viewsCount: number;
  published: boolean;
  createdAt: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodesCount: number;
}

export interface Series {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  startYear: number;
  endYear?: number | null;
  genres: string[];
  quality: '4K' | 'HD' | 'FHD';
  rating: number;
  seasonsCount: number;
  seasonsLabel: string; // e.g. "8 مواسم", "المواسم كاملة"
  language: string;
  country: string;
  cast: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  viewsCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  logoUrl: string;
  category: 'sports' | 'entertainment' | 'news' | 'kids' | 'movies';
  categoryAr: string;
  streamUrl: string;
  streamType: 'hls' | 'mp4';
  isLive: boolean;
  quality: '4K' | 'HD' | 'FHD';
  country?: string;
  language?: string;
  isFeaturedOnHome?: boolean;
  lastTestStatus?: 'working' | 'failed' | 'untested';
  lastTestTimestamp?: string;
  viewsCount: number;
  order: number;
}

export type MatchStatus = 'upcoming' | 'live' | 'halftime' | 'completed' | 'postponed' | 'cancelled';

export interface FootballMatch {
  id: string;
  homeTeam: {
    name: string;
    nameAr: string;
    logoUrl: string;
  };
  awayTeam: {
    name: string;
    nameAr: string;
    logoUrl: string;
  };
  league: {
    id: string;
    name: string;
    nameAr: string;
    logoUrl: string;
  };
  kickoffTime: string; // ISO string
  displayTime: string; // e.g. "21:00"
  status: MatchStatus;
  currentMinute?: string; // e.g. "67'"
  homeScore?: number;
  awayScore?: number;
  channelName?: string;
  commentator?: string;
  streamUrl?: string;
  streamType?: 'hls' | 'mp4';
  stadium?: string;
  isFeatured?: boolean;
  round?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  watchlist: string[]; // item IDs
  history: {
    id: string;
    itemType: 'movie' | 'series' | 'episode' | 'channel' | 'match';
    title: string;
    posterUrl: string;
    progressPercent: number;
    currentTime: number;
    updatedAt: string;
  }[];
}

export interface SiteSettings {
  siteName: string;
  siteNameAr: string;
  logoText: string;
  tagline: string;
  accentColor: string;
  contactEmail: string;
  telegramLink?: string;
  twitterLink?: string;
  footerAbout: string;
  seoTitle: string;
  seoDescription: string;
  enableUserRegistration: boolean;
  enableLiveChat: boolean;
}

export interface AdminAuditLog {
  id: string;
  actorEmail: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'settings_change' | 'user_status';
  entityType: 'movie' | 'series' | 'episode' | 'channel' | 'match' | 'settings' | 'user';
  entityId: string;
  entityTitle: string;
  timestamp: string;
  details?: string;
}

export interface PlaybackErrorLog {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: 'movie' | 'series' | 'episode' | 'channel' | 'match';
  streamUrl: string;
  errorMessage: string;
  browser: string;
  timestamp: string;
}

export interface ViewEvent {
  id: string;
  contentId: string;
  contentType: 'movie' | 'series' | 'episode' | 'channel' | 'match';
  contentTitle: string;
  timestamp: string;
  dateString: string; // YYYY-MM-DD
  durationWatchedSeconds: number;
}

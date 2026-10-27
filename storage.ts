import {
  Movie,
  Series,
  Episode,
  Channel,
  FootballMatch,
  SiteSettings,
  AdminAuditLog,
  ViewEvent,
  PlaybackErrorLog,
  UserProfile,
} from '../types';
import {
  INITIAL_MOVIES,
  INITIAL_SERIES,
  INITIAL_EPISODES,
  INITIAL_CHANNELS,
  INITIAL_MATCHES,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from '../data/initialData';

const STORAGE_KEYS = {
  MOVIES: 'watchnow_movies_v1',
  SERIES: 'watchnow_series_v1',
  EPISODES: 'watchnow_episodes_v1',
  CHANNELS: 'watchnow_channels_v1',
  MATCHES: 'watchnow_matches_v1',
  SETTINGS: 'watchnow_settings_v1',
  AUDIT_LOGS: 'watchnow_audit_logs_v1',
  VIEW_EVENTS: 'watchnow_view_events_v1',
  PLAYBACK_ERRORS: 'watchnow_playback_errors_v1',
  USER: 'watchnow_current_user_v1',
  FIREBASE_CONFIG: 'watchnow_custom_firebase_config_v1',
};

class StorageService {
  private isBrowser = typeof window !== 'undefined';

  private load<T>(key: string, fallback: T): T {
    if (!this.isBrowser) return fallback;
    try {
      const saved = localStorage.getItem(key);
      if (!saved) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(saved);
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Local storage write limit exceeded', e);
    }
  }

  // --- MOVIES ---
  getMovies(): Movie[] {
    return this.load<Movie[]>(STORAGE_KEYS.MOVIES, INITIAL_MOVIES);
  }

  getMovieById(id: string): Movie | undefined {
    return this.getMovies().find((m) => m.id === id || m.slug === id);
  }

  saveMovie(movie: Movie): Movie {
    const list = this.getMovies();
    const index = list.findIndex((m) => m.id === movie.id);
    if (index >= 0) {
      list[index] = { ...movie, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...movie, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.save(STORAGE_KEYS.MOVIES, list);
    this.logAudit({
      action: index >= 0 ? 'update' : 'create',
      entityType: 'movie',
      entityId: movie.id,
      entityTitle: movie.title,
      details: index >= 0 ? 'تحديث بيانات الفيلم' : 'إضافة فيلم جديد للمنصة',
    });
    return movie;
  }

  deleteMovie(id: string): boolean {
    const list = this.getMovies();
    const movie = list.find((m) => m.id === id);
    const filtered = list.filter((m) => m.id !== id);
    this.save(STORAGE_KEYS.MOVIES, filtered);
    if (movie) {
      this.logAudit({
        action: 'delete',
        entityType: 'movie',
        entityId: id,
        entityTitle: movie.title,
        details: 'حذف الفيلم نهائياً من قاعدة البيانات',
      });
    }
    return true;
  }

  // --- SERIES ---
  getSeries(): Series[] {
    return this.load<Series[]>(STORAGE_KEYS.SERIES, INITIAL_SERIES);
  }

  getSeriesById(id: string): Series | undefined {
    return this.getSeries().find((s) => s.id === id || s.slug === id);
  }

  saveSeries(series: Series): Series {
    const list = this.getSeries();
    const index = list.findIndex((s) => s.id === series.id);
    if (index >= 0) {
      list[index] = { ...series, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...series, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.save(STORAGE_KEYS.SERIES, list);
    this.logAudit({
      action: index >= 0 ? 'update' : 'create',
      entityType: 'series',
      entityId: series.id,
      entityTitle: series.title,
      details: index >= 0 ? 'تحديث بيانات المسلسل' : 'إضافة مسلسل جديد للمنصة',
    });
    return series;
  }

  deleteSeries(id: string): boolean {
    const list = this.getSeries();
    const series = list.find((s) => s.id === id);
    const filtered = list.filter((s) => s.id !== id);
    this.save(STORAGE_KEYS.SERIES, filtered);
    // Delete orphan episodes
    const eps = this.getEpisodes().filter((e) => e.seriesId !== id);
    this.save(STORAGE_KEYS.EPISODES, eps);
    if (series) {
      this.logAudit({
        action: 'delete',
        entityType: 'series',
        entityId: id,
        entityTitle: series.title,
        details: 'حذف المسلسل وجميع حلقاته المترابطة',
      });
    }
    return true;
  }

  // --- EPISODES ---
  getEpisodes(): Episode[] {
    return this.load<Episode[]>(STORAGE_KEYS.EPISODES, INITIAL_EPISODES);
  }

  getEpisodesBySeries(seriesId: string, seasonNumber?: number): Episode[] {
    return this.getEpisodes()
      .filter((e) => e.seriesId === seriesId && (seasonNumber === undefined || e.seasonNumber === seasonNumber))
      .sort((a, b) => a.episodeNumber - b.episodeNumber);
  }

  saveEpisode(episode: Episode): Episode {
    const list = this.getEpisodes();
    const index = list.findIndex((e) => e.id === episode.id);
    if (index >= 0) {
      list[index] = episode;
    } else {
      list.push({ ...episode, createdAt: new Date().toISOString() });
    }
    this.save(STORAGE_KEYS.EPISODES, list);
    this.logAudit({
      action: index >= 0 ? 'update' : 'create',
      entityType: 'episode',
      entityId: episode.id,
      entityTitle: episode.title,
      details: `حلقة ${episode.episodeNumber} - موسم ${episode.seasonNumber}`,
    });
    return episode;
  }

  deleteEpisode(id: string): boolean {
    const list = this.getEpisodes();
    const ep = list.find((e) => e.id === id);
    const filtered = list.filter((e) => e.id !== id);
    this.save(STORAGE_KEYS.EPISODES, filtered);
    if (ep) {
      this.logAudit({
        action: 'delete',
        entityType: 'episode',
        entityId: id,
        entityTitle: ep.title,
        details: 'حذف الحلقة من المسلسل',
      });
    }
    return true;
  }

  // --- CHANNELS ---
  getChannels(): Channel[] {
    return this.load<Channel[]>(STORAGE_KEYS.CHANNELS, INITIAL_CHANNELS);
  }

  saveChannel(channel: Channel): Channel {
    const list = this.getChannels();
    const index = list.findIndex((c) => c.id === channel.id);
    if (index >= 0) {
      list[index] = channel;
    } else {
      list.push(channel);
    }
    this.save(STORAGE_KEYS.CHANNELS, list);
    this.logAudit({
      action: index >= 0 ? 'update' : 'create',
      entityType: 'channel',
      entityId: channel.id,
      entityTitle: channel.name,
      details: `تحديث إعدادات القناة ورابط البث (${channel.categoryAr})`,
    });
    return channel;
  }

  deleteChannel(id: string): boolean {
    const list = this.getChannels();
    const ch = list.find((c) => c.id === id);
    const filtered = list.filter((c) => c.id !== id);
    this.save(STORAGE_KEYS.CHANNELS, filtered);
    if (ch) {
      this.logAudit({
        action: 'delete',
        entityType: 'channel',
        entityId: id,
        entityTitle: ch.name,
        details: 'حذف القناة الفضائية',
      });
    }
    return true;
  }

  // --- MATCHES ---
  getMatches(): FootballMatch[] {
    return this.load<FootballMatch[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  }

  saveMatch(match: FootballMatch): FootballMatch {
    const list = this.getMatches();
    const index = list.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      list[index] = match;
    } else {
      list.unshift(match);
    }
    this.save(STORAGE_KEYS.MATCHES, list);
    this.logAudit({
      action: index >= 0 ? 'update' : 'create',
      entityType: 'match',
      entityId: match.id,
      entityTitle: `${match.homeTeam.nameAr} vs ${match.awayTeam.nameAr}`,
      details: `تحديث حالة المباراة (${match.status}) - النتيجة: ${match.homeScore ?? 0} - ${match.awayScore ?? 0}`,
    });
    return match;
  }

  deleteMatch(id: string): boolean {
    const list = this.getMatches();
    const match = list.find((m) => m.id === id);
    const filtered = list.filter((m) => m.id !== id);
    this.save(STORAGE_KEYS.MATCHES, filtered);
    if (match) {
      this.logAudit({
        action: 'delete',
        entityType: 'match',
        entityId: id,
        entityTitle: `${match.homeTeam.nameAr} vs ${match.awayTeam.nameAr}`,
        details: 'حذف المباراة من جدول البث',
      });
    }
    return true;
  }

  // --- SETTINGS ---
  getSettings(): SiteSettings {
    return this.load<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  saveSettings(settings: SiteSettings): SiteSettings {
    this.save(STORAGE_KEYS.SETTINGS, settings);
    this.logAudit({
      action: 'settings_change',
      entityType: 'settings',
      entityId: 'global-settings',
      entityTitle: 'إعدادات الموقع العامة',
      details: 'تحديث هوية الموقع وشعار المنصة وإعدادات المحتوى',
    });
    return settings;
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): AdminAuditLog[] {
    return this.load<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  logAudit(log: Omit<AdminAuditLog, 'id' | 'timestamp' | 'actorEmail'>): void {
    const list = this.getAuditLogs();
    const newEntry: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      actorEmail: this.getCurrentUser()?.email || 'admin@watchnow.tv',
      timestamp: new Date().toISOString(),
      ...log,
    };
    list.unshift(newEntry);
    this.save(STORAGE_KEYS.AUDIT_LOGS, list.slice(0, 100)); // retain last 100
  }

  // --- ANALYTICS / VIEW EVENTS ---
  getViewEvents(): ViewEvent[] {
    return this.load<ViewEvent[]>(STORAGE_KEYS.VIEW_EVENTS, [
      {
        id: 'view-init-1',
        contentId: 'john-wick-4',
        contentType: 'movie',
        contentTitle: 'John Wick: Chapter 4',
        timestamp: new Date().toISOString(),
        dateString: new Date().toISOString().split('T')[0],
        durationWatchedSeconds: 120,
      },
    ]);
  }

  recordView(contentId: string, contentType: ViewEvent['contentType'], contentTitle: string, durationWatchedSeconds: number = 30): void {
    const list = this.getViewEvents();
    const today = new Date().toISOString().split('T')[0];
    const event: ViewEvent = {
      id: `v-${Date.now()}`,
      contentId,
      contentType,
      contentTitle,
      timestamp: new Date().toISOString(),
      dateString: today,
      durationWatchedSeconds,
    };
    list.unshift(event);
    this.save(STORAGE_KEYS.VIEW_EVENTS, list.slice(0, 500));

    // Also increment views count on the entity
    if (contentType === 'movie') {
      const movies = this.getMovies();
      const movie = movies.find((m) => m.id === contentId);
      if (movie) {
        movie.viewsCount = (movie.viewsCount || 0) + 1;
        this.save(STORAGE_KEYS.MOVIES, movies);
      }
    } else if (contentType === 'series') {
      const seriesList = this.getSeries();
      const s = seriesList.find((item) => item.id === contentId);
      if (s) {
        s.viewsCount = (s.viewsCount || 0) + 1;
        this.save(STORAGE_KEYS.SERIES, seriesList);
      }
    } else if (contentType === 'channel') {
      const channels = this.getChannels();
      const ch = channels.find((c) => c.id === contentId);
      if (ch) {
        ch.viewsCount = (ch.viewsCount || 0) + 1;
        this.save(STORAGE_KEYS.CHANNELS, channels);
      }
    }
  }

  // --- PLAYBACK ERRORS ---
  getPlaybackErrors(): PlaybackErrorLog[] {
    return this.load<PlaybackErrorLog[]>(STORAGE_KEYS.PLAYBACK_ERRORS, []);
  }

  recordPlaybackError(error: Omit<PlaybackErrorLog, 'id' | 'timestamp' | 'browser'>): void {
    const list = this.getPlaybackErrors();
    const newLog: PlaybackErrorLog = {
      id: `err-${Date.now()}`,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Browser',
      timestamp: new Date().toISOString(),
      ...error,
    };
    list.unshift(newLog);
    this.save(STORAGE_KEYS.PLAYBACK_ERRORS, list.slice(0, 100));
  }

  // --- USER PROFILE & WATCHLIST ---
  getCurrentUser(): UserProfile | null {
    return this.load<UserProfile | null>(STORAGE_KEYS.USER, {
      id: 'admin-super',
      email: 'admin@watchnow.tv',
      displayName: 'المشرف العام (Admin)',
      role: 'admin',
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: new Date().toISOString(),
      watchlist: ['john-wick-4', 'game-of-thrones', 'bein-sports-1'],
      history: [
        {
          id: 'john-wick-4',
          itemType: 'movie',
          title: 'John Wick: Chapter 4',
          posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
          progressPercent: 45,
          currentTime: 4200,
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  }

  saveCurrentUser(user: UserProfile | null): void {
    this.save(STORAGE_KEYS.USER, user);
  }

  toggleWatchlist(itemId: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const exists = user.watchlist.includes(itemId);
    if (exists) {
      user.watchlist = user.watchlist.filter((id) => id !== itemId);
    } else {
      user.watchlist.push(itemId);
    }
    this.saveCurrentUser(user);
    return !exists;
  }

  isInWatchlist(itemId: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.watchlist.includes(itemId) : false;
  }

  // Reset to default
  resetToDefaults(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEYS.MOVIES);
    localStorage.removeItem(STORAGE_KEYS.SERIES);
    localStorage.removeItem(STORAGE_KEYS.EPISODES);
    localStorage.removeItem(STORAGE_KEYS.CHANNELS);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.VIEW_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.PLAYBACK_ERRORS);
    window.location.reload();
  }
}

export const storage = new StorageService();

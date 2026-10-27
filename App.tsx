/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { HeroBanner } from './HeroBanner';
import { CategoryFilters } from './CategoryFilters';
import { MovieRow } from './MovieRow';
import { SeriesRow } from './SeriesRow';
import { ChannelRow } from './ChannelRow';
import { RightSidebar } from './RightSidebar';
import { VideoPlayerModal } from './VideoPlayerModal';
import { MovieDetailsModal } from './MovieDetailsModal';
import { SeriesDetailsModal } from './SeriesDetailsModal';
import { MatchDetailsModal } from './MatchDetailsModal';
import { ChannelDetailsModal } from './ChannelDetailsModal';
import { SearchModal } from './SearchModal';
import { UserModal } from './UserModal';
import { MoviesView } from './MoviesView';
import { SeriesView } from './SeriesView';
import { LiveChannelsView } from './LiveChannelsView';
import { SportsView } from './SportsView';
import { Footer } from './Footer';
import { AdminDashboard } from './AdminDashboard';
import { storage } from './storage';
import { Movie, Series, Channel, FootballMatch, SiteSettings, UserProfile, VideoSource, Episode } from './index';
import { Bookmark, Play, Check } from 'lucide-react';

export default function App() {
  // Main Data States
  const [movies, setMovies] = useState<Movie[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [matches, setMatches] = useState<FootballMatch[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(storage.getSettings());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(storage.getCurrentUser());

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'series' | 'channels' | 'sports' | 'watchlist' | 'admin'>('home');
  const [selectedSportLeague, setSelectedSportLeague] = useState<string>('all');

  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // User Profile Modal
  const [userModalOpen, setUserModalOpen] = useState(false);

  // Active Modals & Player State
  const [activePlayer, setActivePlayer] = useState<{
    isOpen: boolean;
    title: string;
    sources: VideoSource[];
    contentId: string;
    contentType: 'movie' | 'series' | 'episode' | 'channel' | 'match';
    posterUrl?: string;
    isLive?: boolean;
  } | null>(null);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<FootballMatch | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // Initial Data Load
  const refreshData = () => {
    setMovies(storage.getMovies());
    setSeriesList(storage.getSeries());
    setChannels(storage.getChannels());
    setMatches(storage.getMatches());
    setSettings(storage.getSettings());
    setCurrentUser(storage.getCurrentUser());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Featured Content
  const heroMovie = movies.find((m) => m.id === 'john-wick-4') || movies[0];
  const featuredMovies = movies.filter((m) => m.isFeatured || m.id === 'john-wick-4');
  const latestMovies = movies.filter((m) => m.published);
  const latestSeries = seriesList.filter((s) => s.published);
  const liveFootballChannels = channels.filter((c) => c.category === 'sports');
  const featuredMatch = matches.find((m) => m.isFeatured || m.status === 'live') || matches[0];

  // Handlers
  const handlePlayMovie = (movie: Movie) => {
    setActivePlayer({
      isOpen: true,
      title: movie.title,
      sources: movie.sources,
      contentId: movie.id,
      contentType: 'movie',
      posterUrl: movie.backdropUrl || movie.posterUrl,
      isLive: false,
    });
  };

  const handlePlaySeries = (series: Series) => {
    const episodes = storage.getEpisodesBySeries(series.id);
    const firstEp = episodes[0];
    if (firstEp && firstEp.sources.length > 0) {
      setActivePlayer({
        isOpen: true,
        title: `${series.title} - ${firstEp.title}`,
        sources: firstEp.sources,
        contentId: firstEp.id,
        contentType: 'episode',
        posterUrl: firstEp.thumbnailUrl || series.backdropUrl,
        isLive: false,
      });
    } else {
      setSelectedSeries(series);
    }
  };

  const handlePlayEpisode = (series: Series, episode: Episode) => {
    setActivePlayer({
      isOpen: true,
      title: `${series.title} - ${episode.title}`,
      sources: episode.sources,
      contentId: episode.id,
      contentType: 'episode',
      posterUrl: episode.thumbnailUrl || series.backdropUrl,
      isLive: false,
    });
  };

  const handlePlayChannel = (channel: Channel) => {
    setActivePlayer({
      isOpen: true,
      title: channel.name,
      sources: [
        {
          id: channel.id,
          label: 'بث حي ومباشر',
          quality: channel.quality === '4K' ? '4K' : '1080p',
          url: channel.streamUrl,
          type: channel.streamType || 'hls',
        },
      ],
      contentId: channel.id,
      contentType: 'channel',
      posterUrl: channel.logoUrl,
      isLive: true,
    });
  };

  const handlePlayMatchStream = (match: FootballMatch) => {
    setActivePlayer({
      isOpen: true,
      title: `${match.homeTeam.nameAr} vs ${match.awayTeam.nameAr} (${match.league.nameAr})`,
      sources: [
        {
          id: match.id,
          label: `${match.channelName || 'سيرفر البث الرئيسي'} (HD)`,
          quality: '1080p',
          url: match.streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          type: 'hls',
        },
      ],
      contentId: match.id,
      contentType: 'match',
      posterUrl: match.homeTeam.logoUrl,
      isLive: match.status === 'live',
    });
  };

  const handleToggleWatchlist = (id: string) => {
    storage.toggleWatchlist(id);
    setCurrentUser(storage.getCurrentUser());
  };

  // Quick category router
  const handleSelectQuickCategory = (catId: string) => {
    if (catId === 'movies' || catId === 'new_movies' || catId === 'most_watched' || catId === 'high_quality') {
      setActiveTab('movies');
    } else if (catId === 'series') {
      setActiveTab('series');
    } else if (catId === 'channels') {
      setActiveTab('channels');
    } else if (catId === 'sports') {
      setActiveTab('sports');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLeague = (leagueId: string) => {
    setSelectedSportLeague(leagueId);
    setActiveTab('sports');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Dashboard view
  if (activeTab === 'admin') {
    return (
      <AdminDashboard
        onBackToSite={() => setActiveTab('home')}
        movies={movies}
        seriesList={seriesList}
        channels={channels}
        matches={matches}
        settings={settings}
        onRefreshData={refreshData}
      />
    );
  }

  // Watchlist Items
  const watchlistMovies = movies.filter((m) => currentUser?.watchlist.includes(m.id));
  const watchlistSeries = seriesList.filter((s) => currentUser?.watchlist.includes(s.id));

  return (
    <div className="min-h-screen bg-[#0b0e17] text-white flex flex-col font-['Cairo',sans-serif] selection:bg-red-600 selection:text-white">
      {/* Navbar */}
      <Navbar
        settings={settings}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUserModal={() => setUserModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: HOME PAGE (Matches Reference Image Exactly) */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left / Main Column (Desktop 9 of 12 cols, ~75%) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-8">
              {/* Featured Hero Banner */}
              {heroMovie && (
                <HeroBanner
                  movie={heroMovie}
                  featuredMovies={featuredMovies}
                  onPlay={handlePlayMovie}
                  onToggleWatchlist={handleToggleWatchlist}
                  isWatchlisted={storage.isInWatchlist(heroMovie.id)}
                />
              )}

              {/* Horizontal Category Cards */}
              <CategoryFilters onSelectCategory={handleSelectQuickCategory} />

              {/* Latest Movies Row */}
              <MovieRow
                title="أحدث الأفلام"
                movies={latestMovies}
                onSelectMovie={(m) => setSelectedMovie(m)}
                onPlayMovie={handlePlayMovie}
                onViewAll={() => setActiveTab('movies')}
              />

              {/* Latest Series Row (Wide cards) */}
              <SeriesRow
                title="أحدث المسلسلات"
                seriesList={latestSeries}
                onSelectSeries={(s) => setSelectedSeries(s)}
                onPlaySeries={handlePlaySeries}
                onViewAll={() => setActiveTab('series')}
              />

              {/* Live Sports Channels Row */}
              <ChannelRow
                title="قنوات البث المباشر (كرة القدم)"
                channels={liveFootballChannels}
                onSelectChannel={(c) => setSelectedChannel(c)}
                onViewAll={() => setActiveTab('channels')}
              />
            </div>

            {/* Right Column / Sidebar (Desktop 3-4 cols, ~25%) */}
            <div className="lg:col-span-4 xl:col-span-3">
              <RightSidebar
                featuredMatch={featuredMatch}
                channels={channels}
                onSelectMatch={(m) => setSelectedMatch(m)}
                onSelectChannel={(c) => setSelectedChannel(c)}
                onSelectLeague={handleSelectLeague}
                onOpenSports={() => setActiveTab('sports')}
              />
            </div>

          </div>
        )}

        {/* VIEW 2: MOVIES */}
        {activeTab === 'movies' && (
          <MoviesView
            movies={movies}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onPlayMovie={handlePlayMovie}
          />
        )}

        {/* VIEW 3: SERIES */}
        {activeTab === 'series' && (
          <SeriesView
            seriesList={seriesList}
            onSelectSeries={(s) => setSelectedSeries(s)}
            onPlaySeries={handlePlaySeries}
          />
        )}

        {/* VIEW 4: LIVE CHANNELS */}
        {activeTab === 'channels' && (
          <LiveChannelsView
            channels={channels}
            onSelectChannel={(c) => setSelectedChannel(c)}
            onPlayChannel={handlePlayChannel}
          />
        )}

        {/* VIEW 5: SPORTS */}
        {activeTab === 'sports' && (
          <SportsView
            matches={matches}
            onSelectMatch={(m) => setSelectedMatch(m)}
            onPlayMatchStream={handlePlayMatchStream}
            initialLeague={selectedSportLeague}
          />
        )}

        {/* VIEW 6: WATCHLIST */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            <div className="border-b border-white/6 pb-6">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="w-1.5 h-6 bg-[#e50914] rounded-full" />
                <h1 className="text-2xl sm:text-3xl font-black text-white">قائمة مفضلاتي</h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                الأفلام والمسلسلات التي قمت بحفظها لمشاهدتها في أي وقت
              </p>
            </div>

            {watchlistMovies.length === 0 && watchlistSeries.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <Bookmark className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <h3 className="text-base font-bold text-white mb-1">قائمة مفضلاتك فارغة حالياً</h3>
                <p className="text-xs text-gray-400 mb-4">
                  تصفح الأفلام والمسلسلات واضغط &quot;أضف إلى المفضلة&quot; لتجدها هنا دائماً.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  تصفح المحتوى الآن
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {watchlistMovies.length > 0 && (
                  <MovieRow
                    title="أفلام في المفضلة"
                    movies={watchlistMovies}
                    onSelectMovie={(m) => setSelectedMovie(m)}
                    onPlayMovie={handlePlayMovie}
                  />
                )}
                {watchlistSeries.length > 0 && (
                  <SeriesRow
                    title="مسلسلات في المفضلة"
                    seriesList={watchlistSeries}
                    onSelectSeries={(s) => setSelectedSeries(s)}
                    onPlaySeries={handlePlaySeries}
                  />
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setActiveTab('admin')}
        onSelectCategory={handleSelectQuickCategory}
      />

      {/* GLOBAL VIDEO PLAYER MODAL */}
      {activePlayer && activePlayer.isOpen && (
        <VideoPlayerModal
          title={activePlayer.title}
          sources={activePlayer.sources}
          contentId={activePlayer.contentId}
          contentType={activePlayer.contentType}
          posterUrl={activePlayer.posterUrl}
          isLive={activePlayer.isLive}
          onClose={() => setActivePlayer(null)}
        />
      )}

      {/* MOVIE DETAILS MODAL */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={(m) => {
            setSelectedMovie(null);
            handlePlayMovie(m);
          }}
          onToggleWatchlist={handleToggleWatchlist}
          isWatchlisted={storage.isInWatchlist(selectedMovie.id)}
        />
      )}

      {/* SERIES DETAILS MODAL */}
      {selectedSeries && (
        <SeriesDetailsModal
          series={selectedSeries}
          onClose={() => setSelectedSeries(null)}
          onPlayEpisode={(s, ep) => {
            setSelectedSeries(null);
            handlePlayEpisode(s, ep);
          }}
          onToggleWatchlist={handleToggleWatchlist}
          isWatchlisted={storage.isInWatchlist(selectedSeries.id)}
        />
      )}

      {/* MATCH DETAILS MODAL */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onPlayMatchStream={(m) => {
            setSelectedMatch(null);
            handlePlayMatchStream(m);
          }}
        />
      )}

      {/* CHANNEL DETAILS MODAL */}
      {selectedChannel && (
        <ChannelDetailsModal
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
          onPlayChannel={(c) => {
            setSelectedChannel(null);
            handlePlayChannel(c);
          }}
        />
      )}

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        movies={movies}
        seriesList={seriesList}
        channels={channels}
        matches={matches}
        onSelectMovie={(m) => setSelectedMovie(m)}
        onSelectSeries={(s) => setSelectedSeries(s)}
        onSelectChannel={(c) => setSelectedChannel(c)}
        onSelectMatch={(m) => setSelectedMatch(m)}
      />

      {/* USER PROFILE MODAL */}
      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(u) => setCurrentUser(u)}
        movies={movies}
        seriesList={seriesList}
        onSelectMovie={(m) => setSelectedMovie(m)}
        onSelectSeries={(s) => setSelectedSeries(s)}
        onOpenAdmin={() => setActiveTab('admin')}
      />
    </div>
  );
}

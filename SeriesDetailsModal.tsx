import React, { useState } from 'react';
import { X, Play, Plus, Check, Star, Calendar, Layers, Clock } from 'lucide-react';
import { Series, Episode } from '../types';
import { storage } from '../services/storage';

interface SeriesDetailsModalProps {
  series: Series;
  onClose: () => void;
  onPlayEpisode: (series: Series, episode: Episode) => void;
  onToggleWatchlist: (id: string) => void;
  isWatchlisted: boolean;
}

export const SeriesDetailsModal: React.FC<SeriesDetailsModalProps> = ({
  series,
  onClose,
  onPlayEpisode,
  onToggleWatchlist,
  isWatchlisted,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const allEpisodes = storage.getEpisodesBySeries(series.id);
  const episodesForSeason = allEpisodes.filter((e) => e.seasonNumber === selectedSeason);

  // If no episodes for season, synthesize default sample episodes so user can watch immediately
  const displayEpisodes: Episode[] =
    episodesForSeason.length > 0
      ? episodesForSeason
      : [
          {
            id: `${series.id}-s${selectedSeason}-e1`,
            seriesId: series.id,
            seasonNumber: selectedSeason,
            episodeNumber: 1,
            title: `الحلقة الأولى - الموسم ${selectedSeason}`,
            description: `بداية الأحداث المشوقة في الموسم ${selectedSeason} من مسلسل ${series.title}`,
            thumbnailUrl: series.backdropUrl || series.posterUrl,
            duration: 55,
            sources: [
              {
                id: 's1-e1-src1',
                label: 'سيرفر عالي السرعة (1080p)',
                quality: '1080p',
                url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                type: 'hls',
              },
            ],
            viewsCount: 12000,
            published: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: `${series.id}-s${selectedSeason}-e2`,
            seriesId: series.id,
            seasonNumber: selectedSeason,
            episodeNumber: 2,
            title: `الحلقة الثانية - الموسم ${selectedSeason}`,
            description: `تطورات غير متوقعة وتصاعد الصراع بين الأطراف في الحلقة الثانية.`,
            thumbnailUrl: series.posterUrl,
            duration: 52,
            sources: [
              {
                id: 's1-e2-src1',
                label: 'سيرفر عالي السرعة (1080p)',
                quality: '1080p',
                url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                type: 'hls',
              },
            ],
            viewsCount: 9400,
            published: true,
            createdAt: new Date().toISOString(),
          },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0e1424] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Backdrop Banner Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={series.backdropUrl || series.posterUrl}
            alt={series.title}
            className="w-full h-full object-cover filter brightness-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-[#0e1424]/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Badges */}
          <div className="absolute bottom-6 right-6 left-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#e50914] text-white">
                  مسلسل
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/50 px-2 py-0.5 rounded border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {series.rating} / 10
                </span>
                <span className="text-xs text-gray-300 font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {series.seasonsLabel || `${series.seasonsCount} مواسم`}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                {series.title}
              </h2>
            </div>

            <button
              onClick={() => onToggleWatchlist(series.id)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer"
              title="مفضلاتي"
            >
              {isWatchlisted ? <Check className="w-5 h-5 text-red-400" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Synopsis */}
          <p className="text-gray-300 text-sm leading-relaxed">{series.description}</p>

          {/* Seasons Selector Tabs */}
          <div className="border-t border-b border-white/6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Layers className="w-4 h-4 text-red-500" />
                <span>اختر الموسم:</span>
              </div>
              <span className="text-xs text-gray-400">
                إجمالي المواسم: {series.seasonsCount}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {Array.from({ length: series.seasonsCount || 1 }).map((_, idx) => {
                const sNum = idx + 1;
                const isSelected = selectedSeason === sNum;
                return (
                  <button
                    key={sNum}
                    onClick={() => setSelectedSeason(sNum)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                        : 'bg-[#151d2f] text-gray-300 hover:text-white border border-white/6'
                    }`}
                  >
                    الموسم {sNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Episodes List */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">
              حلقات الموسم {selectedSeason}:
            </h3>
            <div className="space-y-3">
              {displayEpisodes.map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => onPlayEpisode(series, ep)}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-[#131b2e] hover:bg-[#18233c] border border-white/6 hover:border-red-500/50 transition-all cursor-pointer group"
                >
                  {/* Thumbnail with Play Icon */}
                  <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black flex-shrink-0">
                    <img
                      src={ep.thumbnailUrl || series.backdropUrl || series.posterUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-[#e50914] text-white flex items-center justify-center">
                        <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-red-500">
                        الحلقة {ep.episodeNumber}
                      </span>
                      {ep.duration && (
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ep.duration} دقيقة
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-gray-100 group-hover:text-red-400 transition-colors truncate">
                      {ep.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                      {ep.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Tv, Play } from 'lucide-react';
import { Series } from '../types';

interface SeriesViewProps {
  seriesList: Series[];
  onSelectSeries: (s: Series) => void;
  onPlaySeries: (s: Series) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = ({
  seriesList,
  onSelectSeries,
  onPlaySeries,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const filtered = selectedGenre === 'all'
    ? seriesList
    : seriesList.filter((s) => s.genres.includes(selectedGenre));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/6 pb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-1.5 h-6 bg-[#e50914] rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            المسلسلات الحصرية الكاملة
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">
          استمتع بجميع مواسم وحلقات مسلسلاتك المفضلة بترجمة وجودة عالية ({filtered.length} مسلسل)
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((series) => (
          <div
            key={series.id}
            onClick={() => onSelectSeries(series)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#151c2d] border border-white/6 shadow-lg group-hover:border-red-500/50 group-hover:shadow-red-900/20 transition-all duration-300">
              <img
                src={series.backdropUrl || series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-black/60 text-white backdrop-blur-md border border-white/20">
                  {series.quality}
                </span>
              </div>

              {series.rating && (
                <div className="absolute bottom-2.5 right-2.5 z-10 px-1.5 py-0.5 rounded text-[11px] font-bold bg-black/70 text-amber-300 backdrop-blur-md border border-amber-400/30 flex items-center gap-1">
                  <span>★</span>
                  <span>{series.rating}</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaySeries(series);
                  }}
                  className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 text-center">
              <h3 className="text-sm font-bold text-gray-100 truncate group-hover:text-red-400 transition-colors">
                {series.originalTitle || series.title}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {series.seasonsLabel || `${series.seasonsCount} مواسم`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

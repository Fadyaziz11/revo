import React, { useState, useMemo } from 'react';
import { Film, Filter, Play, Star, ArrowUpDown } from 'lucide-react';
import { Movie } from '../types';

interface MoviesViewProps {
  movies: Movie[];
  onSelectMovie: (m: Movie) => void;
  onPlayMovie: (m: Movie) => void;
}

export const MoviesView: React.FC<MoviesViewProps> = ({
  movies,
  onSelectMovie,
  onPlayMovie,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'popularity'>('newest');

  const genres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return ['all', ...Array.from(set)];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (selectedGenre !== 'all') {
      result = result.filter((m) => m.genres.includes(selectedGenre));
    }

    if (selectedQuality !== 'all') {
      result = result.filter((m) => m.quality === selectedQuality);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => b.viewsCount - a.viewsCount);
    }

    return result;
  }, [movies, selectedGenre, selectedQuality, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/6 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-1.5 h-6 bg-[#e50914] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              مكتبة الأفلام العالمية والعربية
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            تصفح وشاهد أحدث أفلام هوليوود والسينما العربية بدقة فائقة وبدون إعلانات مزعجة ({filteredMovies.length} فيلم متاح)
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#141b2c] text-xs font-semibold text-white rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="newest">الأحدث إنتاجاً</option>
            <option value="rating">الأعلى تقييماً</option>
            <option value="popularity">الأكثر مشاهدة</option>
          </select>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 font-bold ml-2">التصنيف:</span>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedGenre === g
                ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                : 'bg-[#121826] text-gray-300 hover:text-white border border-white/6'
            }`}
          >
            {g === 'all' ? 'جميع التصنيفات' : g}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie(movie)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#151c2d] border border-white/6 shadow-lg group-hover:border-red-500/50 group-hover:shadow-red-900/20 transition-all duration-300">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Badges */}
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-black/60 text-white backdrop-blur-md border border-white/20">
                  {movie.quality}
                </span>
              </div>

              {movie.rating && (
                <div className="absolute bottom-2.5 right-2.5 z-10 px-1.5 py-0.5 rounded text-[11px] font-bold bg-black/70 text-amber-300 backdrop-blur-md border border-amber-400/30 flex items-center gap-1">
                  <span>★</span>
                  <span>{movie.rating}</span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayMovie(movie);
                  }}
                  className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 text-center">
              <h3 className="text-sm font-bold text-gray-100 truncate group-hover:text-red-400 transition-colors">
                {movie.originalTitle || movie.title}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {movie.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

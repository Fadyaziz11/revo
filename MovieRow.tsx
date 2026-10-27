import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Movie } from './index';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayMovie: (movie: Movie) => void;
  onViewAll?: () => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  onSelectMovie,
  onPlayMovie,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-[#e50914] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 hover:text-white font-medium transition-colors cursor-pointer group"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Row with Navigation */}
      <div className="relative group/row">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#121826]/90 border border-white/10 text-white flex items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-500 cursor-pointer"
          title="التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-[#121826]/90 border border-white/10 text-white flex items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-500 cursor-pointer"
          title="السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Cards Carousel */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[145px] sm:w-[165px] lg:w-[180px] group cursor-pointer"
              onClick={() => onSelectMovie(movie)}
            >
              {/* Poster Card */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#151c2d] border border-white/6 shadow-lg group-hover:border-red-500/50 group-hover:shadow-red-900/20 transition-all duration-300">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* HD Badge top right (matching screenshot) */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-black/60 text-white backdrop-blur-md border border-white/20">
                    HD
                  </span>
                </div>

                {/* Rating Badge */}
                {movie.rating && (
                  <div className="absolute bottom-2.5 right-2.5 z-10 px-1.5 py-0.5 rounded text-[11px] font-bold bg-black/70 text-amber-300 backdrop-blur-md border border-amber-400/30 flex items-center gap-1">
                    <span>★</span>
                    <span>{movie.rating}</span>
                  </div>
                )}

                {/* Hover Play Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayMovie(movie);
                    }}
                    className="w-12 h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110 transition-transform"
                    title="تشغيل"
                  >
                    <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
                  </button>
                </div>
              </div>

              {/* Title & Metadata (centered/aligned matching screenshot) */}
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
    </section>
  );
};

import React, { useState } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onToggleWatchlist: (id: string) => void;
  isWatchlisted: boolean;
  featuredMovies?: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onPlay,
  onToggleWatchlist,
  isWatchlisted,
  featuredMovies = [],
  onSelectMovie,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeMovie = featuredMovies.length > 0 ? featuredMovies[currentIdx] || movie : movie;

  return (
    <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-l from-[#0d1322] via-[#090d16] to-[#06080e] border border-white/8 shadow-2xl min-h-[380px] lg:min-h-[440px] flex items-center">
      {/* Background Cinematic Artwork with Neon Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeMovie.backdropUrl || activeMovie.posterUrl}
          alt={activeMovie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.1] scale-105 transition-all duration-700"
        />
        {/* Soft Radial and Directional Vignette matching screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e17] via-[#0b0e17]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-black/40" />
        {/* Neon blue/magenta subtle rim backlight */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Content Container (RTL text alignment) */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl flex flex-col justify-center">
        {/* Featured Pill Badge (exact match to red pill in screenshot) */}
        <div className="mb-3.5 inline-block self-start">
          <span className="bg-[#e50914] text-white text-xs font-bold px-3 py-1 rounded-md shadow-md shadow-red-600/40 tracking-wide">
            فيلم مميز
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-md font-['Cairo',sans-serif]">
          {activeMovie.originalTitle || activeMovie.title}
        </h1>

        {/* Genres & Meta Info */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-medium mb-4">
          {activeMovie.genres.map((genre, idx) => (
            <React.Fragment key={genre}>
              <span>{genre}</span>
              {idx < activeMovie.genres.length - 1 && <span className="text-gray-500">•</span>}
            </React.Fragment>
          ))}
          {activeMovie.year && (
            <>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">{activeMovie.year}</span>
            </>
          )}
          {activeMovie.quality && (
            <>
              <span className="text-gray-500">•</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-white/10 text-white border border-white/15">
                {activeMovie.quality}
              </span>
            </>
          )}
        </div>

        {/* Synopsis Arabic description */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-8 max-w-xl font-normal drop-shadow">
          {activeMovie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          {/* Watch Now Button (Red, Play Icon) */}
          <button
            onClick={() => onPlay(activeMovie)}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#e50914] hover:bg-[#ff0f1e] text-white text-sm sm:text-base font-bold transition-all shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
            <span>مشاهدة الآن</span>
          </button>

          {/* Add to Watchlist Button (Translucent dark, Plus icon) */}
          <button
            onClick={() => onToggleWatchlist(activeMovie.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base font-medium transition-all border cursor-pointer ${
              isWatchlisted
                ? 'bg-red-950/40 border-red-500/50 text-red-200'
                : 'bg-[#182030]/80 hover:bg-[#202b40] text-gray-200 border-white/10 hover:border-white/20'
            }`}
          >
            {isWatchlisted ? (
              <>
                <Check className="w-4 h-4 text-red-400" />
                <span>في مفضلتي</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>أضف إلى المفضلة +</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Carousel Dots at Bottom Center (5 dots, matching screenshot) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {[0, 1, 2, 3, 4].map((dotIdx) => {
          const isActive = currentIdx === dotIdx;
          return (
            <button
              key={dotIdx}
              onClick={() => {
                if (featuredMovies[dotIdx]) {
                  setCurrentIdx(dotIdx);
                  if (onSelectMovie) onSelectMovie(featuredMovies[dotIdx]);
                }
              }}
              className={`transition-all rounded-full cursor-pointer ${
                isActive ? 'w-5 h-2 bg-red-600 shadow-sm shadow-red-500' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              title={`الشريحة ${dotIdx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

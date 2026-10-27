import React from 'react';
import { X, Play, Plus, Check, Star, Clock, Calendar, Globe, User, Film } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onToggleWatchlist: (id: string) => void;
  isWatchlisted: boolean;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onPlay,
  onToggleWatchlist,
  isWatchlisted,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0e1424] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Backdrop Banner Header */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
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

          {/* Floating Action Header info */}
          <div className="absolute bottom-6 right-6 left-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#e50914] text-white">
                  {movie.quality}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/50 px-2 py-0.5 rounded border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {movie.rating} / 10
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                {movie.title}
              </h2>
              {movie.originalTitle && (
                <span className="text-xs text-gray-400 font-mono block mt-0.5">
                  {movie.originalTitle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onPlay(movie)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#ff0f1e] text-white font-bold text-sm shadow-lg shadow-red-600/40 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
                <span>تشغيل</span>
              </button>
              <button
                onClick={() => onToggleWatchlist(movie.id)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer"
                title="مفضلاتي"
              >
                {isWatchlisted ? <Check className="w-5 h-5 text-red-400" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Meta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#141b2e] border border-white/5 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-[10px] text-gray-400 block">سنة الإنتاج</span>
                <span className="text-xs font-bold text-gray-200">{movie.year}</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#141b2e] border border-white/5 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-[10px] text-gray-400 block">المدة</span>
                <span className="text-xs font-bold text-gray-200">{movie.duration} دقيقة</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#141b2e] border border-white/5 flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-[10px] text-gray-400 block">الدولة واللغة</span>
                <span className="text-xs font-bold text-gray-200">{movie.country || 'عالمي'}</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#141b2e] border border-white/5 flex items-center gap-2.5">
              <Film className="w-4 h-4 text-red-500" />
              <div>
                <span className="text-[10px] text-gray-400 block">المشاهدات</span>
                <span className="text-xs font-bold text-gray-200">{movie.viewsCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2">قصة الفيلم:</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{movie.description}</p>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2">التصنيفات:</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#162035] text-gray-200 border border-white/8"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 mb-2">طاقم التمثيل:</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-black/30 text-gray-300 border border-white/5"
                  >
                    <User className="w-3 h-3 text-red-400" />
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Available Video Servers */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2">سيرفرات المشاهدة المتاحة:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {movie.sources.map((src) => (
                <button
                  key={src.id}
                  onClick={() => onPlay(movie)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#131b2e] hover:bg-[#1a2540] border border-white/6 hover:border-red-500/50 transition-all text-right text-xs font-semibold text-gray-200 cursor-pointer"
                >
                  <span>{src.label}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                    {src.quality}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

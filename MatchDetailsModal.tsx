import React from 'react';
import { X, Play, Radio, Calendar, MapPin, Mic, Trophy } from 'lucide-react';
import { FootballMatch } from './index';

interface MatchDetailsModalProps {
  match: FootballMatch;
  onClose: () => void;
  onPlayMatchStream: (match: FootballMatch) => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({
  match,
  onClose,
  onPlayMatchStream,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e1424] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* League and Round Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {match.league.logoUrl && (
            <img src={match.league.logoUrl} alt={match.league.nameAr} className="w-6 h-6 object-contain" />
          )}
          <span className="text-xs sm:text-sm font-bold text-gray-300">
            {match.league.nameAr} • {match.round || 'مباراة مباشرة'}
          </span>
        </div>

        {/* Scoreboard Big Match Display */}
        <div className="bg-gradient-to-b from-[#141d33] to-[#101728] rounded-2xl p-6 border border-white/8 mb-6">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 p-3 flex items-center justify-center shadow-md">
                <img
                  src={match.homeTeam.logoUrl}
                  alt={match.homeTeam.nameAr}
                  className="max-h-full max-w-full object-contain filter drop-shadow"
                />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white text-center">
                {match.homeTeam.nameAr}
              </h3>
            </div>

            {/* Scores or Time */}
            <div className="flex flex-col items-center gap-2 px-4">
              {match.status === 'live' ? (
                <>
                  <div className="flex items-center gap-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    <span>{match.homeScore ?? 0}</span>
                    <span className="text-red-500">:</span>
                    <span>{match.awayScore ?? 0}</span>
                  </div>
                  <span className="bg-[#e50914] text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    مباشر {match.currentMinute || "68'"}
                  </span>
                </>
              ) : match.status === 'completed' ? (
                <>
                  <div className="flex items-center gap-3 text-3xl font-black text-gray-200 font-mono">
                    <span>{match.homeScore ?? 0}</span>
                    <span className="text-gray-500">:</span>
                    <span>{match.awayScore ?? 0}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    انتهت المباراة
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-white font-mono">
                    {match.displayTime}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    قادمة
                  </span>
                </>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 p-3 flex items-center justify-center shadow-md">
                <img
                  src={match.awayTeam.logoUrl}
                  alt={match.awayTeam.nameAr}
                  className="max-h-full max-w-full object-contain filter drop-shadow"
                />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white text-center">
                {match.awayTeam.nameAr}
              </h3>
            </div>
          </div>
        </div>

        {/* Match Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-gray-300">
          <div className="p-3 rounded-xl bg-[#131b2e] border border-white/5 flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-red-500" />
            <div>
              <span className="text-[10px] text-gray-400 block">القناة الناقلة</span>
              <span className="font-bold text-white">{match.channelName || 'beIN SPORTS 1 HD'}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#131b2e] border border-white/5 flex items-center gap-2.5">
            <Mic className="w-4 h-4 text-red-500" />
            <div>
              <span className="text-[10px] text-gray-400 block">المعلق الرياضي</span>
              <span className="font-bold text-white">{match.commentator || 'عصام الشوالي'}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#131b2e] border border-white/5 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-red-500" />
            <div>
              <span className="text-[10px] text-gray-400 block">الملعب</span>
              <span className="font-bold text-white">{match.stadium || 'سانتياغو برنابيو'}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#131b2e] border border-white/5 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-red-500" />
            <div>
              <span className="text-[10px] text-gray-400 block">التوقيت</span>
              <span className="font-bold text-white">{match.displayTime} بتوقيت مكة المكرمة</span>
            </div>
          </div>
        </div>

        {/* Watch Stream Action Button */}
        <button
          onClick={() => onPlayMatchStream(match)}
          className="w-full py-3.5 rounded-xl bg-[#e50914] hover:bg-[#ff0f1e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
          <span>مشاهدة البث المباشر للمباراة</span>
        </button>
      </div>
    </div>
  );
};

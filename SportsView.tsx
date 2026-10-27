import React, { useState } from 'react';
import { Trophy, Play, Radio, Calendar } from 'lucide-react';
import { FootballMatch } from '../types';

interface SportsViewProps {
  matches: FootballMatch[];
  onSelectMatch: (m: FootballMatch) => void;
  onPlayMatchStream: (m: FootballMatch) => void;
  initialLeague?: string;
}

export const SportsView: React.FC<SportsViewProps> = ({
  matches,
  onSelectMatch,
  onPlayMatchStream,
  initialLeague,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [selectedLeague, setSelectedLeague] = useState<string>(initialLeague || 'all');

  const filtered = matches.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (selectedLeague !== 'all' && m.league.id !== selectedLeague) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/6 pb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-1.5 h-6 bg-[#e50914] rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            جدول مباريات اليوم والبث المباشر
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">
          تغطية حية لنتائج وتفاصيل وأهداف أهم مباريات الدوريات والبطولات الأوروبية والعربية
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'جميع المباريات' },
            { id: 'live', label: 'مباشر الآن 🔴' },
            { id: 'upcoming', label: 'مباريات قادمة' },
            { id: 'completed', label: 'مباريات منتهية' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#121826] text-gray-400 hover:text-white border border-white/6'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* League Selector */}
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="bg-[#141b2c] text-xs font-semibold text-white rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="all">جميع الدوريات والبطولات</option>
          <option value="la-liga">الدوري الإسباني (La Liga)</option>
          <option value="premier-league">الدوري الإنجليزي (Premier League)</option>
          <option value="champions-league">دوري أبطال أوروبا (Champions League)</option>
          <option value="egyptian-league">الدوري المصري الممتاز</option>
        </select>
      </div>

      {/* Matches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((match) => (
          <div
            key={match.id}
            onClick={() => onSelectMatch(match)}
            className="p-5 rounded-2xl bg-[#0f1524] border border-white/8 hover:border-red-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            {/* League info header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                {match.league.logoUrl && (
                  <img src={match.league.logoUrl} alt={match.league.nameAr} className="w-5 h-5 object-contain" />
                )}
                <span className="text-xs font-bold text-gray-300">{match.league.nameAr}</span>
              </div>
              <span className="text-[11px] text-gray-400">{match.channelName || 'beIN SPORTS'}</span>
            </div>

            {/* Teams & Scores */}
            <div className="flex items-center justify-between my-2">
              {/* Home Team */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white/5 p-1.5 flex items-center justify-center flex-shrink-0">
                  <img src={match.homeTeam.logoUrl} alt={match.homeTeam.nameAr} className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-sm font-bold text-white truncate">{match.homeTeam.nameAr}</span>
              </div>

              {/* Score / Status Center */}
              <div className="px-4 text-center">
                {match.status === 'live' ? (
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-black text-white font-mono">
                      {match.homeScore ?? 0} - {match.awayScore ?? 0}
                    </div>
                    <span className="bg-[#e50914] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse mt-0.5">
                      مباشر {match.currentMinute || "68'"}
                    </span>
                  </div>
                ) : match.status === 'completed' ? (
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-black text-gray-300 font-mono">
                      {match.homeScore ?? 0} - {match.awayScore ?? 0}
                    </div>
                    <span className="text-[10px] text-gray-400">انتهت</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-white font-mono">{match.displayTime}</span>
                    <span className="text-[10px] text-gray-400">قادمة</span>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex items-center justify-end gap-3 flex-1 min-w-0 text-left">
                <span className="text-sm font-bold text-white truncate">{match.awayTeam.nameAr}</span>
                <div className="w-10 h-10 rounded-full bg-white/5 p-1.5 flex items-center justify-center flex-shrink-0">
                  <img src={match.awayTeam.logoUrl} alt={match.awayTeam.nameAr} className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-400">{match.commentator ? `المعلق: ${match.commentator}` : match.stadium}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayMatchStream(match);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>مشاهدة البث</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Search, X, Film, Tv, Radio, Trophy, Play } from 'lucide-react';
import { Movie, Series, Channel, FootballMatch } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  seriesList: Series[];
  channels: Channel[];
  matches: FootballMatch[];
  onSelectMovie: (m: Movie) => void;
  onSelectSeries: (s: Series) => void;
  onSelectChannel: (c: Channel) => void;
  onSelectMatch: (m: FootballMatch) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  movies,
  seriesList,
  channels,
  matches,
  onSelectMovie,
  onSelectSeries,
  onSelectChannel,
  onSelectMatch,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'movies' | 'series' | 'channels' | 'matches'>('all');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return { movies: [], series: [], channels: [], matches: [] };
    const q = query.toLowerCase().trim();

    return {
      movies: movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      ),
      series: seriesList.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.originalTitle && s.originalTitle.toLowerCase().includes(q)) ||
          s.genres.some((g) => g.toLowerCase().includes(q))
      ),
      channels: channels.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameAr.toLowerCase().includes(q) ||
          c.categoryAr.toLowerCase().includes(q)
      ),
      matches: matches.filter(
        (m) =>
          m.homeTeam.nameAr.toLowerCase().includes(q) ||
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.nameAr.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q) ||
          m.league.nameAr.toLowerCase().includes(q)
      ),
    };
  }, [query, movies, seriesList, channels, matches]);

  if (!isOpen) return null;

  const totalResults =
    filteredResults.movies.length +
    filteredResults.series.length +
    filteredResults.channels.length +
    filteredResults.matches.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0d1322] border border-white/10 rounded-3xl overflow-hidden shadow-2xl mt-12 p-6">
        
        {/* Search Header Input */}
        <div className="relative flex items-center mb-6">
          <input
            type="text"
            autoFocus
            placeholder="ابحث عن فيلم، مسلسل، قناة، أو مباراة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#141b2c] text-white text-base sm:text-lg rounded-2xl py-3.5 pr-12 pl-12 border border-white/10 focus:border-red-500 focus:outline-none transition-all shadow-inner"
          />
          <Search className="w-5 h-5 text-gray-400 absolute right-4 pointer-events-none" />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center absolute left-3 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-white/6 mb-4">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'movies', label: `أفلام (${filteredResults.movies.length})` },
            { id: 'series', label: `مسلسلات (${filteredResults.series.length})` },
            { id: 'channels', label: `قنوات (${filteredResults.channels.length})` },
            { id: 'matches', label: `مباريات (${filteredResults.matches.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#151c2d] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Body */}
        {query.trim() === '' ? (
          <div className="py-12 text-center text-gray-400">
            <Search className="w-10 h-10 mx-auto text-gray-600 mb-3" />
            <p className="text-sm font-semibold">اكتب اسم الفيلم أو المسلسل أو القناة للبدء في البحث</p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-gray-500">كلمات شائعة:</span>
              {['John Wick', 'The Batman', 'Game of Thrones', 'beIN SPORTS', 'الكلاسيكو'].map((kw) => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 border border-white/5"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">لم يتم العثور على نتائج مطابقة لـ &quot;{query}&quot;</p>
            <span className="text-xs text-gray-500 block mt-1">تأكد من صحة الكلمات أو جرب كلمات أخرى</span>
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {/* Movies Results */}
            {(filterType === 'all' || filterType === 'movies') && filteredResults.movies.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-red-500" />
                  <span>الأفلام</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredResults.movies.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        onSelectMovie(m);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#131b2e] hover:bg-[#18233c] border border-white/5 cursor-pointer group"
                    >
                      <img src={m.posterUrl} alt={m.title} className="w-12 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-white group-hover:text-red-400 truncate">
                          {m.title}
                        </h5>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          {m.year} • {m.quality} • {m.genres.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Series Results */}
            {(filterType === 'all' || filterType === 'series') && filteredResults.series.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-purple-400" />
                  <span>المسلسلات</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredResults.series.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        onSelectSeries(s);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#131b2e] hover:bg-[#18233c] border border-white/5 cursor-pointer group"
                    >
                      <img src={s.posterUrl} alt={s.title} className="w-12 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-white group-hover:text-purple-400 truncate">
                          {s.title}
                        </h5>
                        <span className="text-xs text-gray-400 block mt-0.5">
                          {s.seasonsLabel || `${s.seasonsCount} مواسم`} • {s.quality}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Channels Results */}
            {(filterType === 'all' || filterType === 'channels') && filteredResults.channels.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>القنوات التلفزيونية</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredResults.channels.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectChannel(c);
                        onClose();
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#131b2e] hover:bg-[#18233c] border border-white/5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-black/40 p-1 flex items-center justify-center">
                          <img src={c.logoUrl} alt={c.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white group-hover:text-emerald-400">
                            {c.name}
                          </h5>
                          <span className="text-xs text-gray-400">{c.categoryAr}</span>
                        </div>
                      </div>
                      <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        مباشر
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matches Results */}
            {(filterType === 'all' || filterType === 'matches') && filteredResults.matches.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-sky-400" />
                  <span>مباريات كرة القدم</span>
                </h4>
                <div className="space-y-2">
                  {filteredResults.matches.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        onSelectMatch(m);
                        onClose();
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#131b2e] hover:bg-[#18233c] border border-white/5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={m.homeTeam.logoUrl} alt={m.homeTeam.nameAr} className="w-7 h-7 object-contain" />
                        <span className="text-sm font-bold text-white">{m.homeTeam.nameAr}</span>
                        <span className="text-xs text-red-500 font-bold">vs</span>
                        <span className="text-sm font-bold text-white">{m.awayTeam.nameAr}</span>
                        <img src={m.awayTeam.logoUrl} alt={m.awayTeam.nameAr} className="w-7 h-7 object-contain" />
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">{m.displayTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

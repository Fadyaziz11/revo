import React from 'react';
import { Tv, Radio, ChevronLeft } from 'lucide-react';
import { FootballMatch, Channel } from '../types';

interface RightSidebarProps {
  featuredMatch?: FootballMatch;
  channels: Channel[];
  onSelectMatch: (match: FootballMatch) => void;
  onSelectChannel: (channel: Channel) => void;
  onSelectLeague: (leagueId: string) => void;
  onOpenSports: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  featuredMatch,
  channels,
  onSelectMatch,
  onSelectChannel,
  onSelectLeague,
  onOpenSports,
}) => {
  const leagues = [
    {
      id: 'champions-league',
      nameAr: 'دوري أبطال أوروبا',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/100px-UEFA_Champions_League_logo_2.svg.png',
      symbol: '⭐',
    },
    {
      id: 'premier-league',
      nameAr: 'الدوري الإنجليزي',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/100px-Premier_League_Logo.svg.png',
      symbol: '🦁',
    },
    {
      id: 'la-liga',
      nameAr: 'الدوري الإسباني',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/LaLiga_EA_Sports_2023_Vertical_Logo.svg/100px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png',
      symbol: '⚽',
    },
    {
      id: 'serie-a',
      nameAr: 'الدوري الإيطالي',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Serie_A_logo_2019.svg/100px-Serie_A_logo_2019.svg.png',
      symbol: '🛡️',
    },
    {
      id: 'egyptian-league',
      nameAr: 'الدوري المصري',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Egyptian_Premier_League_logo.png/100px-Egyptian_Premier_League_logo.png',
      symbol: '🇪🇬',
    },
    {
      id: 'other',
      nameAr: 'مباريات أخرى',
      symbol: '⚽',
    },
  ];

  // TV channels for the sidebar list
  const sidebarChannels = channels.slice(0, 6);

  return (
    <aside className="w-full space-y-5">
      {/* Container matching screenshot */}
      <div className="bg-[#0e1422] rounded-3xl border border-white/6 p-5 shadow-xl space-y-6">
        
        {/* TOP BLOCK: مباريات اليوم - بث مباشر */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <h3 className="text-base font-bold text-white tracking-tight">
                مباريات اليوم - بث مباشر
              </h3>
            </div>
            <button
              onClick={onOpenSports}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-0.5"
            >
              <span>الكل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Featured Match Card (Real Madrid vs Barcelona style) */}
          {featuredMatch ? (
            <div
              onClick={() => onSelectMatch(featuredMatch)}
              className="relative p-4 rounded-2xl bg-gradient-to-b from-[#141b2d] to-[#101626] border border-white/8 hover:border-red-500/50 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between">
                {/* Team 1 (Real Madrid) */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-14 h-14 rounded-full bg-white/5 p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <img
                      src={featuredMatch.homeTeam.logoUrl}
                      alt={featuredMatch.homeTeam.nameAr}
                      className="max-h-11 max-w-11 object-contain filter drop-shadow"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-100 text-center">
                    {featuredMatch.homeTeam.nameAr}
                  </span>
                </div>

                {/* VS & Status */}
                <div className="flex flex-col items-center gap-1.5 px-3">
                  <span className="text-sm font-black text-gray-400 tracking-wider">
                    VS
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">
                      مباشر
                    </span>
                    <span className="text-[11px] font-bold text-gray-300 mt-0.5">
                      {featuredMatch.displayTime || '21:00'}
                    </span>
                  </div>
                </div>

                {/* Team 2 (Barcelona) */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-14 h-14 rounded-full bg-white/5 p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <img
                      src={featuredMatch.awayTeam.logoUrl}
                      alt={featuredMatch.awayTeam.nameAr}
                      className="max-h-11 max-w-11 object-contain filter drop-shadow"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-100 text-center">
                    {featuredMatch.awayTeam.nameAr}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Competitions / Leagues Listing */}
          <div className="mt-4 space-y-1.5 border-t border-white/6 pt-3">
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => onSelectLeague(league.id)}
                className="w-full flex items-center justify-between p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{league.symbol}</span>
                  <span className="group-hover:translate-x-[-2px] transition-transform">
                    {league.nameAr}
                  </span>
                </div>
                {league.iconUrl ? (
                  <img
                    src={league.iconUrl}
                    alt={league.nameAr}
                    className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100"
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE BLOCK: القنوات التلفزيونية */}
        <div className="border-t border-white/6 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                القنوات التلفزيونية
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {sidebarChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className="flex items-center justify-between p-2 rounded-xl bg-[#121826]/60 hover:bg-[#162033] border border-white/4 hover:border-red-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center p-1 border border-white/5 flex-shrink-0">
                    {channel.logoUrl ? (
                      <img
                        src={channel.logoUrl}
                        alt={channel.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Radio className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-200 group-hover:text-red-400 transition-colors truncate">
                    {channel.name}
                  </span>
                </div>

                <span className="bg-[#e50914] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex-shrink-0">
                  مباشر
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM PROMO BANNER (Exact replica of the bottom match promo box) */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[220px] p-6 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-transparent">
        {/* Background artwork: soccer ball on stadium grass */}
        <img
          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80"
          alt="Stadium Grass Soccer Ball"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-transparent" />

        {/* Text Content */}
        <div className="relative z-10 text-right">
          <span className="text-xs text-gray-300 font-medium block mb-1">
            استمتع بمشاهدة
          </span>
          <h4 className="text-2xl font-black text-white tracking-tight mb-1 font-['Cairo',sans-serif]">
            أهم المباريات
          </h4>
          <p className="text-xs text-gray-300 font-normal mb-4">
            بجودة عالية وبدون تقطيع
          </p>

          <button
            onClick={onOpenSports}
            className="w-full py-2.5 rounded-xl bg-[#e50914] hover:bg-[#ff0f1e] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-red-600/40 hover:scale-[1.02] cursor-pointer"
          >
            مشاهدة الآن
          </button>
        </div>
      </div>
    </aside>
  );
};

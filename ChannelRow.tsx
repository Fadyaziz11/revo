import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Radio } from 'lucide-react';
import { Channel } from '../types';

interface ChannelRowProps {
  title: string;
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onViewAll?: () => void;
}

export const ChannelRow: React.FC<ChannelRowProps> = ({
  title,
  channels,
  onSelectChannel,
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

        {/* Channels Grid / Carousel */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
        >
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="flex-shrink-0 w-[150px] sm:w-[170px] lg:w-[190px] group cursor-pointer"
              onClick={() => onSelectChannel(channel)}
            >
              {/* Channel Card */}
              <div className="relative aspect-[16/10] rounded-2xl bg-[#111726] border border-white/8 shadow-md group-hover:border-red-500/60 group-hover:bg-[#151f33] transition-all duration-300 p-4 flex items-center justify-center overflow-hidden">
                {/* Red Live Pill Badge (matching screenshot) */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>مباشر</span>
                </div>

                {/* Logo representation */}
                <div className="w-full h-12 flex items-center justify-center px-2 group-hover:scale-105 transition-transform duration-300">
                  {channel.logoUrl ? (
                    <img
                      src={channel.logoUrl}
                      alt={channel.name}
                      className="max-h-10 max-w-full object-contain filter drop-shadow"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-500 font-black text-sm">
                      <Radio className="w-4 h-4" />
                      <span>{channel.name}</span>
                    </div>
                  )}
                </div>

                {/* Hover Play Glow */}
                <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-red-600/50">
                    <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
                  </div>
                </div>
              </div>

              {/* Channel Name */}
              <div className="mt-2 text-center">
                <h3 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-red-400 transition-colors truncate">
                  {channel.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

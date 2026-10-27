import React, { useState } from 'react';
import { Radio, Play, CheckCircle2, XCircle } from 'lucide-react';
import { Channel } from './index';

interface LiveChannelsViewProps {
  channels: Channel[];
  onSelectChannel: (c: Channel) => void;
  onPlayChannel: (c: Channel) => void;
}

export const LiveChannelsView: React.FC<LiveChannelsViewProps> = ({
  channels,
  onSelectChannel,
  onPlayChannel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'جميع القنوات' },
    { id: 'sports', label: 'قنوات رياضية' },
    { id: 'entertainment', label: 'قنوات ترفيهية' },
    { id: 'news', label: 'قنوات إخبارية' },
  ];

  const filtered = selectedCategory === 'all'
    ? channels
    : channels.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/6 pb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-1.5 h-6 bg-[#e50914] rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            دليل القنوات التلفزيونية والبث المباشر
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-400">
          بث حي ومباشر على مدار الساعة لجميع القنوات الرياضية والترفيهية بأحدث صيغ البث HLS (.m3u8)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                : 'bg-[#121826] text-gray-300 hover:text-white border border-white/6'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((channel) => (
          <div
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[16/10] rounded-2xl bg-[#111726] border border-white/8 shadow-md group-hover:border-red-500/60 group-hover:bg-[#151f33] transition-all duration-300 p-4 flex items-center justify-center overflow-hidden">
              <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>مباشر</span>
              </div>

              <div className="w-full h-12 flex items-center justify-center px-2 group-hover:scale-105 transition-transform duration-300">
                {channel.logoUrl ? (
                  <img
                    src={channel.logoUrl}
                    alt={channel.name}
                    className="max-h-10 max-w-full object-contain filter drop-shadow"
                  />
                ) : (
                  <Radio className="w-6 h-6 text-red-500" />
                )}
              </div>

              <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayChannel(channel);
                  }}
                  className="w-10 h-10 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110"
                >
                  <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
                </button>
              </div>
            </div>

            <div className="mt-2 text-center">
              <h3 className="text-xs sm:text-sm font-bold text-gray-200 group-hover:text-red-400 transition-colors truncate">
                {channel.name}
              </h3>
              <span className="text-[11px] text-gray-400">
                {channel.categoryAr} • {channel.quality}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

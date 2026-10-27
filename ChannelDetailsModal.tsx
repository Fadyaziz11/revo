import React from 'react';
import { X, Play, Radio, Globe, ShieldCheck, Activity } from 'lucide-react';
import { Channel } from './index';

interface ChannelDetailsModalProps {
  channel: Channel;
  onClose: () => void;
  onPlayChannel: (channel: Channel) => void;
}

export const ChannelDetailsModal: React.FC<ChannelDetailsModalProps> = ({
  channel,
  onClose,
  onPlayChannel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Channel Logo */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-[#141d33] border border-white/8 p-4 flex items-center justify-center shadow-xl mb-4">
          {channel.logoUrl ? (
            <img src={channel.logoUrl} alt={channel.name} className="max-h-full max-w-full object-contain filter drop-shadow" />
          ) : (
            <Radio className="w-10 h-10 text-red-500" />
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm animate-pulse">
            بث مباشر
          </span>
          <span className="bg-white/10 text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded">
            {channel.quality}
          </span>
          <span className="bg-white/5 text-gray-400 text-[10px] font-medium px-2 py-0.5 rounded">
            {channel.categoryAr}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">{channel.name}</h3>
        {channel.nameAr && <p className="text-xs text-gray-400 mb-6">{channel.nameAr}</p>}

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 text-right text-xs text-gray-300 mb-6 bg-[#131b2e] p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-500" />
            <div>
              <span className="text-[10px] text-gray-400 block">الدولة واللغة</span>
              <span className="font-bold text-white">{channel.country || 'عربي'} / {channel.language || 'العربية'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-gray-400 block">حالة البث</span>
              <span className="font-bold text-emerald-400">مستقر (1080p 60fps)</span>
            </div>
          </div>
        </div>

        {/* Watch Stream Button */}
        <button
          onClick={() => onPlayChannel(channel)}
          className="w-full py-3.5 rounded-xl bg-[#e50914] hover:bg-[#ff0f1e] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
          <span>تشغيل البث الحي للقناة</span>
        </button>
      </div>
    </div>
  );
};

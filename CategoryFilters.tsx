import React from 'react';
import { Film, Tv, Trophy, Star, Flame, Sparkles } from 'lucide-react';

interface CategoryFiltersProps {
  onSelectCategory: (cat: string) => void;
  activeCategory?: string;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  onSelectCategory,
  activeCategory,
}) => {
  const categories = [
    {
      id: 'movies',
      label: 'الأفلام',
      icon: <Film className="w-5 h-5 text-red-500" />,
      color: 'hover:border-red-500/50 hover:bg-red-500/10',
    },
    {
      id: 'series',
      label: 'المسلسلات',
      icon: <Tv className="w-5 h-5 text-purple-400" />,
      color: 'hover:border-purple-500/50 hover:bg-purple-500/10',
    },
    {
      id: 'channels',
      label: 'قنوات مباشرة',
      icon: (
        <span className="w-5 h-5 flex items-center justify-center text-emerald-400 font-bold text-lg">
          ⚽
        </span>
      ),
      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10',
    },
    {
      id: 'sports',
      label: 'رياضة',
      icon: <Trophy className="w-5 h-5 text-sky-400" />,
      color: 'hover:border-sky-500/50 hover:bg-sky-500/10',
    },
    {
      id: 'new_movies',
      label: 'أفلام جديدة',
      icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />,
      color: 'hover:border-amber-500/50 hover:bg-amber-500/10',
    },
    {
      id: 'most_watched',
      label: 'الأكثر مشاهدة',
      icon: <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />,
      color: 'hover:border-orange-500/50 hover:bg-orange-500/10',
    },
    {
      id: 'high_quality',
      label: 'جودة عالية',
      icon: (
        <div className="px-1.5 py-0.5 rounded text-[11px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
          HD
        </div>
      ),
      color: 'hover:border-cyan-500/50 hover:bg-cyan-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#111622] border transition-all cursor-pointer group shadow-sm ${
              isActive
                ? 'border-red-500 bg-red-600/10 text-white shadow-md shadow-red-600/20'
                : 'border-white/6 text-gray-300 hover:text-white ' + cat.color
            }`}
          >
            <div className="mb-2 p-1 group-hover:scale-110 transition-transform flex items-center justify-center">
              {cat.icon}
            </div>
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-center">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

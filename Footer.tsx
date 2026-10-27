import React from 'react';
import { Play, Shield, Heart } from 'lucide-react';
import { SiteSettings } from './index';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onSelectCategory,
}) => {
  return (
    <footer className="mt-20 border-t border-white/6 bg-[#070a12] text-gray-400 text-xs">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Bio */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#b20710] to-[#e50914] flex items-center justify-center shadow-lg shadow-red-600/30">
                <Play className="w-4 h-4 text-white fill-current translate-x-[-0.5px]" />
              </div>
              <span className="text-xl font-black text-white font-['Inter',sans-serif]">
                {settings.siteName}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {settings.footerAbout}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">أقسام الموقع</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('movies')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  أحدث الأفلام الأجنبية والعربية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('series')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  المسلسلات الحصرية الكاملة
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('channels')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  قنوات البث التلفزيوني المباشر
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('sports')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  جدول مباريات كرة القدم اليوم
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Leagues */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">البطولات المنقولة</h4>
            <ul className="space-y-2">
              <li>دوري أبطال أوروبا (UEFA Champions League)</li>
              <li>الدوري الإنجليزي الممتاز (Premier League)</li>
              <li>الدوري الإسباني الدرجة الأولى (La Liga)</li>
              <li>الدوري المصري الممتاز</li>
            </ul>
          </div>

          {/* Administration & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-3">الإدارة والحماية</h4>
            <p className="text-gray-400 text-xs">
              منصة محمية بقواعد أمان Firebase Security Rules متطورة ومصادقة مستخدمين مشفرة.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>دخول لوحة التحكم (Admin Area)</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} {settings.siteName}. البث للاستخدام التجريبي المصرح.
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span>صُمم بالكامل للغة العربية وبأعلى معايير الدقة والسرعة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

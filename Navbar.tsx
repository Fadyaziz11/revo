import React, { useState } from 'react';
import { Search, User, Moon, Shield, Bookmark, Play, X, Menu } from 'lucide-react';
import { SiteSettings, UserProfile } from './index';

interface NavbarProps {
  settings: SiteSettings;
  currentUser: UserProfile | null;
  activeTab: 'home' | 'movies' | 'series' | 'channels' | 'sports' | 'watchlist' | 'admin';
  setActiveTab: (tab: 'home' | 'movies' | 'series' | 'channels' | 'sports' | 'watchlist' | 'admin') => void;
  onOpenSearch: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenUserModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentUser,
  activeTab,
  setActiveTab,
  onOpenSearch,
  searchQuery,
  setSearchQuery,
  onOpenUserModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'movies', label: 'الأفلام' },
    { id: 'series', label: 'المسلسلات' },
    { id: 'channels', label: 'قنوات مباشرة' },
    { id: 'sports', label: 'رياضة' },
    { id: 'watchlist', label: 'مفضلاتي' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e17]/95 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left Section (in RTL: Brand & Search) */}
        <div className="flex items-center gap-6 flex-1 max-w-3xl">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group focus:outline-none flex-shrink-0"
            title={settings.siteName}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#b20710] to-[#e50914] flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 text-white fill-current translate-x-[-0.5px]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-['Inter',sans-serif]">
              {settings.siteName || 'WatchNow'}
            </span>
          </button>

          {/* Search Input Bar (matching screenshot pill shape) */}
          <div className="relative flex-1 hidden md:block max-w-md">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="ابحث عن فيلم أو مسلسل أو قناة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={onOpenSearch}
                onClick={onOpenSearch}
                className="w-full bg-[#121826] hover:bg-[#161e30] focus:bg-[#151c2d] text-sm text-gray-200 placeholder-gray-400/80 rounded-full py-2.5 pr-11 pl-4 border border-white/8 focus:border-red-500/60 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center / Right Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer rounded-lg ${
                  isActive ? 'text-white font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-10px] left-3 right-3 h-[3px] bg-[#e50914] rounded-full shadow-sm shadow-red-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section (Profile & Actions) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Admin Dashboard Quick Access Button */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-red-600/20 text-red-400 border-red-500/40 shadow-sm'
                : 'bg-[#151c2d] text-gray-300 border-white/10 hover:border-red-500/30 hover:text-white'
            }`}
            title="لوحة تحكم الإدارة"
          >
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span>لوحة التحكم</span>
          </button>

          {/* Watchlist Quick Icon on smaller viewports */}
          <button
            onClick={() => setActiveTab('watchlist')}
            className="xl:hidden p-2.5 rounded-full bg-[#151c2d] text-gray-300 hover:text-white hover:bg-white/10 border border-white/5 transition-colors"
            title="مفضلاتي"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Search Trigger for Mobile */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2.5 rounded-full bg-[#151c2d] text-gray-300 hover:text-white hover:bg-white/10 border border-white/5 transition-colors"
            title="بحث"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme/Night Mode Icon (matches screenshot moon icon) */}
          <button
            className="p-2.5 rounded-full bg-[#151c2d] text-gray-300 hover:text-white hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
            title="الوضع الليلي مفعّل"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* User Profile Avatar (matches screenshot avatar circle) */}
          <button
            onClick={onOpenUserModal}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-white/15 text-white hover:border-red-500 transition-all cursor-pointer overflow-hidden shadow-sm"
            title={currentUser?.displayName || 'حسابي'}
          >
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-gray-200" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#151c2d] text-gray-300 hover:text-white border border-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0d121f] border-b border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === link.id
                  ? 'bg-red-600/20 text-red-400 font-bold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setActiveTab('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-right px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600/10 text-red-400 border border-red-500/20 flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-red-500" />
            <span>لوحة تحكم الإدارة (Admin Dashboard)</span>
          </button>
        </div>
      )}
    </header>
  );
};

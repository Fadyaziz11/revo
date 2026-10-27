import React, { useState } from 'react';
import { X, User, Shield, LogOut, Check, Bookmark, Clock, Film } from 'lucide-react';
import { UserProfile, Movie, Series } from './index';
import { storage } from './storage';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpdateUser: (user: UserProfile | null) => void;
  movies: Movie[];
  seriesList: Series[];
  onSelectMovie: (m: Movie) => void;
  onSelectSeries: (s: Series) => void;
  onOpenAdmin: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  movies,
  seriesList,
  onSelectMovie,
  onSelectSeries,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'watchlist' | 'history'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'المشرف العام');
  const [email, setEmail] = useState(currentUser?.email || 'admin@watchnow.tv');

  if (!isOpen) return null;

  const handleSave = () => {
    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        displayName,
        email,
      };
      storage.saveCurrentUser(updated);
      onUpdateUser(updated);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    storage.saveCurrentUser(null);
    onUpdateUser(null);
    onClose();
  };

  const watchlistItems = (currentUser?.watchlist || []).map((id) => {
    const movie = movies.find((m) => m.id === id);
    if (movie) return { ...movie, type: 'movie' as const };
    const s = seriesList.find((item) => item.id === id);
    if (s) return { ...s, type: 'series' as const };
    return null;
  }).filter(Boolean);

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

        {/* User Card Top */}
        <div className="flex items-center gap-4 mb-6 border-b border-white/6 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/20 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white truncate">
                {currentUser?.displayName || 'مستخدم المنصة'}
              </h3>
              {currentUser?.role === 'admin' && (
                <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3 text-red-500" />
                  مدير النظام (Admin)
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              {currentUser?.email || 'user@watchnow.tv'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/6 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            الملف الشخصي
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'watchlist' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            قائمة مفضلاتي ({currentUser?.watchlist?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            سجل المشاهدة
          </button>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">اسم العرض:</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#141b2c] text-white text-sm rounded-xl px-3 py-2 border border-white/10"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141b2c] text-white text-sm rounded-xl px-3 py-2 border border-white/10"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#141b2e] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">حالة الحساب</span>
                    <span className="text-xs font-bold text-emerald-400">نشط ومفعّل بالكامل</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="p-3 rounded-xl bg-[#141b2e] border border-white/5">
                  <span className="text-[10px] text-gray-400 block">صلاحيات الإدارة</span>
                  <span className="text-xs font-bold text-white">
                    {currentUser?.role === 'admin' ? 'صلاحيات وصول كاملة للوحة التحكم الإدارية' : 'مستخدم عادي'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                  >
                    تعديل البيانات
                  </button>
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAdmin();
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>فتح لوحة تحكم الإدارة</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {watchlistItems.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                لم تقم بإضافة أي فيلم أو مسلسل إلى المفضلة بعد.
              </div>
            ) : (
              watchlistItems.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    if (item.type === 'movie') onSelectMovie(item);
                    else onSelectSeries(item);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#131b2e] hover:bg-[#18233c] border border-white/5 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.posterUrl} alt={item.title} className="w-10 h-14 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-red-400">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {item.type === 'movie' ? 'فيلم' : 'مسلسل'} • {item.quality}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      storage.toggleWatchlist(item.id);
                      if (currentUser) {
                        onUpdateUser(storage.getCurrentUser());
                      }
                    }}
                    className="text-gray-400 hover:text-red-400 p-1.5"
                    title="إزالة من المفضلة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {(!currentUser?.history || currentUser.history.length === 0) ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                سجل المشاهدة فارغ حالياً.
              </div>
            ) : (
              currentUser.history.map((hist) => (
                <div
                  key={hist.id}
                  className="p-3 rounded-xl bg-[#131b2e] border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={hist.posterUrl} alt={hist.title} className="w-9 h-12 rounded object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{hist.title}</h4>
                        <span className="text-[10px] text-gray-400">
                          تم التقدم بنسبة {hist.progressPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full"
                      style={{ width: `${hist.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

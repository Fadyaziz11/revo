import React, { useState } from 'react';
import {
  LayoutDashboard,
  Film,
  Tv,
  Radio,
  Trophy,
  Sliders,
  Users,
  BarChart3,
  FileText,
  Database,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Play,
  RotateCcw,
  Shield,
  Eye,
  Server,
} from 'lucide-react';
import {
  Movie,
  Series,
  Episode,
  Channel,
  FootballMatch,
  SiteSettings,
  AdminAuditLog,
  ViewEvent,
  PlaybackErrorLog,
  UserProfile,
} from '../types';
import { storage } from '../services/storage';
import { isFirebaseConfigured, testFirestoreConnection } from '../services/firebaseConfig';

interface AdminDashboardProps {
  onBackToSite: () => void;
  movies: Movie[];
  seriesList: Series[];
  channels: Channel[];
  matches: FootballMatch[];
  settings: SiteSettings;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToSite,
  movies,
  seriesList,
  channels,
  matches,
  settings,
  onRefreshData,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'overview'
    | 'movies'
    | 'series'
    | 'channels'
    | 'matches'
    | 'homepage'
    | 'users'
    | 'analytics'
    | 'logs'
    | 'firebase'
  >('overview');

  // Audit logs and analytics data
  const auditLogs = storage.getAuditLogs();
  const viewEvents = storage.getViewEvents();
  const playbackErrors = storage.getPlaybackErrors();
  const currentUser = storage.getCurrentUser();

  // Test Firebase state
  const [firebaseStatusMessage, setFirebaseStatusMessage] = useState<string | null>(null);
  const [isTestingFirebase, setIsTestingFirebase] = useState(false);

  const handleTestFirebase = async () => {
    setIsTestingFirebase(true);
    const res = await testFirestoreConnection();
    setFirebaseStatusMessage(res.message);
    setIsTestingFirebase(false);
  };

  // Movie Form State
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);

  // Series Form State
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);

  // Channel Form State
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

  // Match Form State
  const [editingMatch, setEditingMatch] = useState<FootballMatch | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Export Analytics CSV
  const handleExportCSV = () => {
    const events = storage.getViewEvents();
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Content ID,Title,Type,Date,DurationSeconds'].join(',') +
      '\n' +
      events.map((e) => `"${e.id}","${e.contentId}","${e.contentTitle}","${e.contentType}","${e.dateString}",${e.durationWatchedSeconds}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `watchnow_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems = [
    { id: 'overview', label: 'لوحة التحكم العامة', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'movies', label: `إدارة الأفلام (${movies.length})`, icon: <Film className="w-4 h-4" /> },
    { id: 'series', label: `إدارة المسلسلات (${seriesList.length})`, icon: <Tv className="w-4 h-4" /> },
    { id: 'channels', label: `إدارة القنوات (${channels.length})`, icon: <Radio className="w-4 h-4" /> },
    { id: 'matches', label: `مباريات كرة القدم (${matches.length})`, icon: <Trophy className="w-4 h-4" /> },
    { id: 'homepage', label: 'إعدادات المنصة والهوية', icon: <Sliders className="w-4 h-4" /> },
    { id: 'users', label: 'إدارة المستخدمين', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'الإحصائيات والتقارير', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'logs', label: `سجل العمليات (${auditLogs.length})`, icon: <FileText className="w-4 h-4" /> },
    { id: 'firebase', label: 'إعداد قاعدة البيانات', icon: <Database className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[#070a12] text-gray-200 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0f1c] border-b md:border-b-0 md:border-l border-white/8 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand & Back Button */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">إدارة WatchNow</span>
            </div>
            <button
              onClick={onBackToSite}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
              title="العودة للمنصة الرئيسية"
            >
              <span>الموقع</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Database Status Pill */}
          <div className="mb-4 p-2.5 rounded-xl bg-[#101728] border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">قاعدة البيانات:</span>
            {isFirebaseConfigured() ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Firebase سحابي
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                معاينة محلية (Local DB)
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer in Sidebar */}
        <div className="mt-8 pt-4 border-t border-white/6 text-[10px] text-gray-500">
          <span>المسؤول: {currentUser?.email || 'admin@watchnow.tv'}</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        
        {/* TAB 1: OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">نظرة عامة على المنصة</h1>
                <p className="text-xs text-gray-400 mt-1">
                  إحصائيات فورية حقيقية للمحتوى والمشاهدات وعمليات الإشراف
                </p>
              </div>
              <button
                onClick={onBackToSite}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>معاينة واجهة الزوار</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metrics Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/6">
                <span className="text-[11px] text-gray-400 block mb-1">إجمالي الأفلام</span>
                <span className="text-2xl font-black text-white">{movies.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/6">
                <span className="text-[11px] text-gray-400 block mb-1">إجمالي المسلسلات</span>
                <span className="text-2xl font-black text-white">{seriesList.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/6">
                <span className="text-[11px] text-gray-400 block mb-1">الحلقات المضافة</span>
                <span className="text-2xl font-black text-white">{storage.getEpisodes().length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/6">
                <span className="text-[11px] text-gray-400 block mb-1">القنوات التلفزيونية</span>
                <span className="text-2xl font-black text-white">{channels.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/6">
                <span className="text-[11px] text-gray-400 block mb-1">مباريات كرة القدم</span>
                <span className="text-2xl font-black text-white">{matches.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/6">
                <span className="text-[11px] text-gray-400 block mb-1">المشاهدات المسجلة</span>
                <span className="text-2xl font-black text-red-500">
                  {viewEvents.length + movies.reduce((acc, m) => acc + (m.viewsCount || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Audit Activities */}
              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500" />
                    <span>آخر العمليات الإدارية</span>
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('logs')}
                    className="text-xs text-red-400 hover:underline"
                  >
                    عرض السجل الكامل
                  </button>
                </div>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#121826] border border-white/4 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{log.entityTitle}</span>
                        <span className="text-gray-400 text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playback Errors & Health Status */}
              <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>أخطاء المشغل وسيرفرات البث</span>
                  </h3>
                  <span className="text-xs text-gray-400">
                    {playbackErrors.length} أخطاء مسجلة
                  </span>
                </div>
                {playbackErrors.length === 0 ? (
                  <div className="py-8 text-center text-xs text-emerald-400 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <span>جميع مصادر البث تعمل بكفاءة وبدون أخطاء تشغيل!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {playbackErrors.slice(0, 4).map((err) => (
                      <div
                        key={err.id}
                        className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-red-300"
                      >
                        <div className="font-bold">{err.contentTitle}</div>
                        <div className="text-[11px] text-gray-400 truncate">{err.errorMessage}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOVIES MANAGEMENT */}
        {activeAdminTab === 'movies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">إدارة مكتبة الأفلام</h1>
                <p className="text-xs text-gray-400">إضافة وتعديل وحذف سيرفرات وأفيشات الأفلام</p>
              </div>
              <button
                onClick={() => {
                  setEditingMovie({
                    id: `movie-${Date.now()}`,
                    title: '',
                    originalTitle: '',
                    slug: '',
                    description: '',
                    posterUrl: '',
                    backdropUrl: '',
                    year: new Date().getFullYear(),
                    genres: ['أكشن'],
                    quality: 'HD',
                    rating: 8.0,
                    duration: 120,
                    language: 'الإنجليزية (مترجم)',
                    country: 'الولايات المتحدة',
                    cast: [],
                    sources: [
                      {
                        id: `s-${Date.now()}`,
                        label: 'سيرفر رئيسي (1080p)',
                        quality: '1080p',
                        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                        type: 'hls',
                      },
                    ],
                    viewsCount: 0,
                    published: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                  setIsMovieModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة فيلم جديد</span>
              </button>
            </div>

            {/* Movies Table */}
            <div className="rounded-2xl bg-[#0d1322] border border-white/6 overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#121826] text-gray-400 font-bold border-b border-white/6">
                  <tr>
                    <th className="p-3.5">الملصق والعنوان</th>
                    <th className="p-3.5">السنة والجودة</th>
                    <th className="p-3.5">التقييم</th>
                    <th className="p-3.5">المشاهدات</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {movies.map((m) => (
                    <tr key={m.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={m.posterUrl} alt={m.title} className="w-9 h-12 rounded object-cover" />
                        <div>
                          <span className="font-bold text-white block">{m.title}</span>
                          <span className="text-[10px] text-gray-400">{m.originalTitle}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-gray-300">
                        {m.year} • <span className="text-white font-bold">{m.quality}</span>
                      </td>
                      <td className="p-3.5 text-amber-400 font-bold">★ {m.rating}</td>
                      <td className="p-3.5 text-gray-400">{m.viewsCount.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {m.published ? 'منشور' : 'مسودة'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingMovie({ ...m });
                              setIsMovieModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                            title="تعديل"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف فيلم "${m.title}"؟`)) {
                                storage.deleteMovie(m.id);
                                onRefreshData();
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SERIES MANAGEMENT */}
        {activeAdminTab === 'series' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">إدارة المسلسلات والحلقات</h1>
                <p className="text-xs text-gray-400">إنشاء المسلسلات وإضافة المواسم وروابط الحلقات</p>
              </div>
              <button
                onClick={() => {
                  setEditingSeries({
                    id: `series-${Date.now()}`,
                    title: '',
                    originalTitle: '',
                    slug: '',
                    description: '',
                    posterUrl: '',
                    backdropUrl: '',
                    startYear: new Date().getFullYear(),
                    genres: ['دراما'],
                    quality: 'HD',
                    rating: 8.5,
                    seasonsCount: 1,
                    seasonsLabel: '1 موسم',
                    language: 'الإنجليزية (مترجم)',
                    country: 'الولايات المتحدة',
                    cast: [],
                    viewsCount: 0,
                    published: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                  setIsSeriesModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مسلسل جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seriesList.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-[#0d1322] border border-white/6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={s.posterUrl} alt={s.title} className="w-12 h-16 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-white text-sm">{s.title}</h3>
                      <span className="text-xs text-gray-400 block">{s.seasonsLabel || `${s.seasonsCount} مواسم`} • تقييم: {s.rating}</span>
                      <span className="text-[10px] text-gray-500">{storage.getEpisodesBySeries(s.id).length} حلقات مسجلة</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSeries({ ...s });
                        setIsSeriesModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف مسلسل "${s.title}" وجميع حلقاته؟`)) {
                          storage.deleteSeries(s.id);
                          onRefreshData();
                        }
                      }}
                      className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CHANNELS MANAGEMENT */}
        {activeAdminTab === 'channels' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">إدارة القنوات الفضائية</h1>
                <p className="text-xs text-gray-400">تحديث روابط البث HLS وفحص استقرار الإشارة</p>
              </div>
              <button
                onClick={() => {
                  setEditingChannel({
                    id: `channel-${Date.now()}`,
                    name: '',
                    nameAr: '',
                    slug: '',
                    logoUrl: '',
                    category: 'sports',
                    categoryAr: 'رياضة',
                    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                    streamType: 'hls',
                    isLive: true,
                    quality: 'HD',
                    viewsCount: 0,
                    order: channels.length + 1,
                  });
                  setIsChannelModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قناة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#0d1322] border border-white/6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 p-1 flex items-center justify-center">
                        <img src={c.logoUrl} alt={c.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                        <span className="text-[10px] text-gray-400">{c.categoryAr}</span>
                      </div>
                    </div>
                    <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      مباشر
                    </span>
                  </div>

                  <div className="text-[11px] text-gray-400 truncate bg-black/30 p-2 rounded-lg font-mono">
                    {c.streamUrl}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      إشارة البث نشطة
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingChannel({ ...c });
                          setIsChannelModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف قناة "${c.name}"؟`)) {
                            storage.deleteChannel(c.id);
                            onRefreshData();
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MATCHES MANAGEMENT */}
        {activeAdminTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">إدارة مباريات كرة القدم</h1>
                <p className="text-xs text-gray-400">تحديث نتائج المباريات المباشرة والبطولات ومصادر البث</p>
              </div>
              <button
                onClick={() => {
                  setEditingMatch({
                    id: `match-${Date.now()}`,
                    homeTeam: { name: 'فريق 1', nameAr: 'ريال مدريد', logoUrl: '' },
                    awayTeam: { name: 'فريق 2', nameAr: 'برشلونة', logoUrl: '' },
                    league: { id: 'la-liga', name: 'La Liga', nameAr: 'الدوري الإسباني', logoUrl: '' },
                    kickoffTime: new Date().toISOString(),
                    displayTime: '21:00',
                    status: 'live',
                    homeScore: 0,
                    awayScore: 0,
                    channelName: 'beIN SPORTS 1 HD',
                    commentator: 'عصام الشوالي',
                    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                  });
                  setIsMatchModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مباراة جديدة</span>
              </button>
            </div>

            <div className="space-y-3">
              {matches.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-[#0d1322] border border-white/6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400">{m.league.nameAr}</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span>{m.homeTeam.nameAr}</span>
                      <span className="text-red-500 px-2 font-mono">
                        {m.homeScore ?? 0} - {m.awayScore ?? 0}
                      </span>
                      <span>{m.awayTeam.nameAr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{m.displayTime}</span>
                    <button
                      onClick={() => {
                        setEditingMatch({ ...m });
                        setIsMatchModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من حذف هذه المباراة؟')) {
                          storage.deleteMatch(m.id);
                          onRefreshData();
                        }
                      }}
                      className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: HOMEPAGE & BRANDING SETTINGS */}
        {activeAdminTab === 'homepage' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-black text-white">إعدادات المنصة والهوية البصرية</h1>
              <p className="text-xs text-gray-400">تخصيص اسم الموقع، الشعار، الألوان، وروابط التواصل وبيانات SEO</p>
            </div>

            {settingsSavedMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                ✓ تم حفظ الإعدادات بنجاح وتطبيقها على الموقع!
              </div>
            )}

            <div className="p-6 rounded-2xl bg-[#0d1322] border border-white/6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">اسم الموقع (بالعربية):</label>
                <input
                  type="text"
                  value={settingsForm.siteNameAr}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteNameAr: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">نص الشعار (Logo Brand):</label>
                <input
                  type="text"
                  value={settingsForm.siteName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">وصف الفوتر والنبذة التعريفية:</label>
                <textarea
                  rows={3}
                  value={settingsForm.footerAbout}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerAbout: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">بريد التواصل والدعم:</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full bg-[#121826] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1.5">عنوان SEO للبحث:</label>
                  <input
                    type="text"
                    value={settingsForm.seoTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                    className="w-full bg-[#121826] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  storage.saveSettings(settingsForm);
                  setSettingsSavedMessage(true);
                  setTimeout(() => setSettingsSavedMessage(false), 3000);
                  onRefreshData();
                }}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                حفظ الإعدادات وتطبيق التغييرات
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: USERS */}
        {activeAdminTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">إدارة المستخدمين والصلاحيات</h1>
              <p className="text-xs text-gray-400">إدارة حسابات الأعضاء وحماية المنصة من ترقية الصلاحيات غير المصرح بها</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d1322] border border-white/6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121826]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
                    A
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">admin@watchnow.tv</span>
                    <span className="text-[10px] text-gray-400">المشرف العام الأساسي (Super Admin)</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  نشط - صلاحيات كاملة
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ANALYTICS */}
        {activeAdminTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">الإحصائيات وسجل المشاهدات</h1>
                <p className="text-xs text-gray-400">توثيق معدلات المشاهدة وتصدير التقارير بصيغة CSV</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>تصدير تقرير المشاهدات (CSV)</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/6">
              <h3 className="text-sm font-bold text-white mb-4">أحداث المشاهدة المسجلة ({viewEvents.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {viewEvents.map((evt) => (
                  <div key={evt.id} className="p-3 rounded-xl bg-[#121826] border border-white/4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{evt.contentTitle}</span>
                      <span className="text-gray-400 text-[11px] block">النوع: {evt.contentType}</span>
                    </div>
                    <div className="text-right text-[11px] text-gray-400">
                      <span>{evt.dateString}</span>
                      <span className="block text-emerald-400 font-mono">+{evt.durationWatchedSeconds} ثانية</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: AUDIT LOGS */}
        {activeAdminTab === 'logs' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">سجل العمليات الإدارية (Audit Trail)</h1>
              <p className="text-xs text-gray-400">سجل غير قابل للتعديل يوثق جميع التغييرات المنفذة في المنصة</p>
            </div>

            <div className="rounded-2xl bg-[#0d1322] border border-white/6 overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#121826] text-gray-400 font-bold border-b border-white/6">
                  <tr>
                    <th className="p-3.5">المسؤول</th>
                    <th className="p-3.5">النوع</th>
                    <th className="p-3.5">العنصر</th>
                    <th className="p-3.5">التفاصيل</th>
                    <th className="p-3.5">التوقيت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/2">
                      <td className="p-3.5 font-mono text-gray-300">{log.actorEmail}</td>
                      <td className="p-3.5 font-bold text-red-400">{log.action}</td>
                      <td className="p-3.5 font-bold text-white">{log.entityTitle}</td>
                      <td className="p-3.5 text-gray-400">{log.details}</td>
                      <td className="p-3.5 font-mono text-gray-500">
                        {new Date(log.timestamp).toLocaleString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: FIREBASE CONFIG */}
        {activeAdminTab === 'firebase' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-black text-white">إعدادات قاعدة بيانات Firebase</h1>
              <p className="text-xs text-gray-400">
                ربط مشروع Cloud Firestore الحقيقي للبيانات المستمرة أو العمل في وضع المعاينة
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d1322] border border-white/6 space-y-4">
              <div className="p-4 rounded-xl bg-[#121826] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">الحالة الحالية:</span>
                  {isFirebaseConfigured() ? (
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      متصل بقاعدة بيانات Cloud Firestore
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      وضع المعاينة المحلي (Local Storage & Preset DB)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  في وضع المعاينة، يمكنك إضافة وتعديل وحذف أي فيلم أو مسلسل أو مباراة أو قناة وتجربة المشغل بشكل فوري وحفظ البيانات محلياً.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleTestFirebase}
                  disabled={isTestingFirebase}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Server className="w-4 h-4" />
                  <span>{isTestingFirebase ? 'جارِ فحص الاتصال...' : 'اختبار اتصال Firestore'}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('هل تريد استعادة البيانات الافتراضية الأصلية للمنصة؟')) {
                      storage.resetToDefaults();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>استعادة البيانات الافتراضية</span>
                </button>
              </div>

              {firebaseStatusMessage && (
                <div className="p-3.5 rounded-xl bg-[#151c2e] border border-white/10 text-xs text-gray-300 font-mono">
                  {firebaseStatusMessage}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Movie Form Modal */}
      {isMovieModalOpen && editingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <h3 className="text-lg font-bold text-white">بيانات الفيلم</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">عنوان الفيلم:</label>
                <input
                  type="text"
                  value={editingMovie.title}
                  onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">العنوان الأصلي (English):</label>
                <input
                  type="text"
                  value={editingMovie.originalTitle || ''}
                  onChange={(e) => setEditingMovie({ ...editingMovie, originalTitle: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">قصة الفيلم:</label>
                <textarea
                  rows={2}
                  value={editingMovie.description}
                  onChange={(e) => setEditingMovie({ ...editingMovie, description: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">رابط صورة الملصق (Poster):</label>
                <input
                  type="text"
                  value={editingMovie.posterUrl}
                  onChange={(e) => setEditingMovie({ ...editingMovie, posterUrl: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">رابط صورة الخلفية (Backdrop):</label>
                <input
                  type="text"
                  value={editingMovie.backdropUrl}
                  onChange={(e) => setEditingMovie({ ...editingMovie, backdropUrl: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">سنة الإنتاج:</label>
                <input
                  type="number"
                  value={editingMovie.year}
                  onChange={(e) => setEditingMovie({ ...editingMovie, year: parseInt(e.target.value, 10) || 2024 })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">التقييم:</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingMovie.rating}
                  onChange={(e) => setEditingMovie({ ...editingMovie, rating: parseFloat(e.target.value) || 7.0 })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">رابط سيرفر البث المباشر (HLS / MP4):</label>
                <input
                  type="text"
                  value={editingMovie.sources[0]?.url || ''}
                  onChange={(e) => {
                    const srcs = [...editingMovie.sources];
                    if (srcs[0]) {
                      srcs[0].url = e.target.value;
                    } else {
                      srcs.push({
                        id: 's-1',
                        label: 'سيرفر رئيسي',
                        quality: '1080p',
                        url: e.target.value,
                        type: 'hls',
                      });
                    }
                    setEditingMovie({ ...editingMovie, sources: srcs });
                  }}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  storage.saveMovie(editingMovie);
                  setIsMovieModalOpen(false);
                  onRefreshData();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                حفظ الفيلم
              </button>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Series Form Modal */}
      {isSeriesModalOpen && editingSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <h3 className="text-lg font-bold text-white">بيانات المسلسل</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">عنوان المسلسل:</label>
                <input
                  type="text"
                  value={editingSeries.title}
                  onChange={(e) => setEditingSeries({ ...editingSeries, title: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">عدد المواسم:</label>
                <input
                  type="number"
                  value={editingSeries.seasonsCount}
                  onChange={(e) => setEditingSeries({ ...editingSeries, seasonsCount: parseInt(e.target.value, 10) || 1 })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">القصة:</label>
                <textarea
                  rows={2}
                  value={editingSeries.description}
                  onChange={(e) => setEditingSeries({ ...editingSeries, description: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">رابط الملصق:</label>
                <input
                  type="text"
                  value={editingSeries.posterUrl}
                  onChange={(e) => setEditingSeries({ ...editingSeries, posterUrl: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">رابط الخلفية العريضة:</label>
                <input
                  type="text"
                  value={editingSeries.backdropUrl}
                  onChange={(e) => setEditingSeries({ ...editingSeries, backdropUrl: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  storage.saveSeries(editingSeries);
                  setIsSeriesModalOpen(false);
                  onRefreshData();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                حفظ المسلسل
              </button>
              <button
                onClick={() => setIsSeriesModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Channel Form Modal */}
      {isChannelModalOpen && editingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <h3 className="text-lg font-bold text-white">بيانات القناة الفضائية</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">اسم القناة:</label>
                <input
                  type="text"
                  value={editingChannel.name}
                  onChange={(e) => setEditingChannel({ ...editingChannel, name: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">رابط شعار القناة (Logo URL):</label>
                <input
                  type="text"
                  value={editingChannel.logoUrl}
                  onChange={(e) => setEditingChannel({ ...editingChannel, logoUrl: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">رابط البث الحي (HLS / m3u8):</label>
                <input
                  type="text"
                  value={editingChannel.streamUrl}
                  onChange={(e) => setEditingChannel({ ...editingChannel, streamUrl: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  storage.saveChannel(editingChannel);
                  setIsChannelModalOpen(false);
                  onRefreshData();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                حفظ القناة
              </button>
              <button
                onClick={() => setIsChannelModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Form Modal */}
      {isMatchModalOpen && editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0d1322] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 my-8">
            <h3 className="text-lg font-bold text-white">بيانات المباراة</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">الفريق الأول:</label>
                <input
                  type="text"
                  value={editingMatch.homeTeam.nameAr}
                  onChange={(e) => setEditingMatch({ ...editingMatch, homeTeam: { ...editingMatch.homeTeam, nameAr: e.target.value } })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">الفريق الثاني:</label>
                <input
                  type="text"
                  value={editingMatch.awayTeam.nameAr}
                  onChange={(e) => setEditingMatch({ ...editingMatch, awayTeam: { ...editingMatch.awayTeam, nameAr: e.target.value } })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">أهداف الفريق الأول:</label>
                <input
                  type="number"
                  value={editingMatch.homeScore ?? 0}
                  onChange={(e) => setEditingMatch({ ...editingMatch, homeScore: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">أهداف الفريق الثاني:</label>
                <input
                  type="number"
                  value={editingMatch.awayScore ?? 0}
                  onChange={(e) => setEditingMatch({ ...editingMatch, awayScore: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">حالة المباراة:</label>
                <select
                  value={editingMatch.status}
                  onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value as any })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                >
                  <option value="live">مباشر الآن</option>
                  <option value="upcoming">قادمة</option>
                  <option value="completed">منتهية</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">وقت المباراة (عرض):</label>
                <input
                  type="text"
                  value={editingMatch.displayTime}
                  onChange={(e) => setEditingMatch({ ...editingMatch, displayTime: e.target.value })}
                  className="w-full bg-[#121826] text-white text-xs rounded-xl p-2.5 border border-white/10"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => {
                  storage.saveMatch(editingMatch);
                  setIsMatchModalOpen(false);
                  onRefreshData();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                حفظ المباراة
              </button>
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

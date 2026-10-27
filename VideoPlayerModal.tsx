import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  RotateCcw,
  AlertTriangle,
  Server,
  Sparkles,
} from 'lucide-react';
import Hls from 'hls.js';
import { VideoSource } from '../types';
import { storage } from '../services/storage';

interface VideoPlayerModalProps {
  title: string;
  sources: VideoSource[];
  contentId: string;
  contentType: 'movie' | 'series' | 'episode' | 'channel' | 'match';
  onClose: () => void;
  posterUrl?: string;
  isLive?: boolean;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  title,
  sources,
  contentId,
  contentType,
  onClose,
  posterUrl,
  isLive = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);
  const watchSecondsRef = useRef<number>(0);

  const currentSource = sources[activeSourceIndex] || sources[0];

  // Initialize and attach stream (HLS or Native)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSource) return;

    setIsLoading(true);
    setPlaybackError(null);

    // Destroy existing Hls instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls =
      currentSource.type === 'hls' ||
      currentSource.url.endsWith('.m3u8') ||
      currentSource.url.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(currentSource.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setPlaybackError('تعذر الاتصال بسيرفر البث. يرجى تجربة سيرفر بديل أو فحص الاتصال.');
              storage.recordPlaybackError({
                contentId,
                contentTitle: title,
                contentType,
                streamUrl: currentSource.url,
                errorMessage: 'HLS Network Error: ' + data.details,
              });
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setPlaybackError('تنسيق البث غير مدعوم في هذا المتصفح أو تم إيقاف المصدر.');
              hls.destroy();
              break;
          }
        }
      });
    } else {
      // Native HTML5 video
      video.src = currentSource.url;
      video.load();
      video.play().catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentSource, contentId, contentType, title]);

  // Track watch time and record view event
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        watchSecondsRef.current += 1;
        if (watchSecondsRef.current === 10) {
          // Documented view count criteria: 10s of sustained playback
          storage.recordView(contentId, contentType, title, 10);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, contentId, contentType, title]);

  // Controls auto-hide timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch((e) => console.log('play error', e));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const targetTime = parseFloat(e.target.value);
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      video.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 lg:p-8 animate-fadeIn">
      {/* Player Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between select-none group"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain cursor-pointer"
          poster={posterUrl}
          playsInline
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onDurationChange={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsLoading(false);
            setPlaybackError('فشل تشغيل الفيديو. يرجى اختيار سيرفر آخر أو المحاولة لاحقاً.');
            storage.recordPlaybackError({
              contentId,
              contentTitle: title,
              contentType,
              streamUrl: currentSource?.url || '',
              errorMessage: 'HTML5 Video Error Event',
            });
          }}
          onClick={togglePlay}
        />

        {/* Loading Spinner */}
        {isLoading && !playbackError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-3 shadow-lg" />
            <span className="text-white text-xs font-semibold">جارِ تهيئة البث بأعلى جودة...</span>
          </div>
        )}

        {/* Playback Error Overlay */}
        {playbackError && (
          <div className="absolute inset-0 z-30 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">تعذر تشغيل هذا المصدر</h3>
            <p className="text-gray-300 text-sm max-w-md mb-6">{playbackError}</p>

            {/* Switch Source Options */}
            {sources.length > 1 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {sources.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSourceIndex(idx);
                      setPlaybackError(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      activeSourceIndex === idx
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-[#151c2d] text-gray-300 border-white/10 hover:border-red-500/50'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5 inline mr-1" />
                    {s.label} ({s.quality})
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => {
                  setPlaybackError(null);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play();
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
            )}
          </div>
        )}

        {/* Top Bar (Title & Close Button) */}
        <div
          className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between z-20 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            {isLive && (
              <span className="bg-[#e50914] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                بث مباشر
              </span>
            )}
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-md">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Custom Controls Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Seek Progress Bar (if not pure live without duration) */}
          {!isLive && (
            <div className="relative mb-3 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e50914] hover:h-2 transition-all"
              />
            </div>
          )}

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between gap-3 text-white text-xs sm:text-sm">
            {/* Left: Play/Pause, Volume, Time */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors cursor-pointer"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current translate-x-[-1px]" />
                )}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="hover:text-red-400">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-white/30 rounded appearance-none accent-red-600 cursor-pointer"
                />
              </div>

              {/* Time Display */}
              {!isLive ? (
                <div className="text-gray-300 text-xs font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              ) : (
                <div className="text-red-400 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  مباشر الآن
                </div>
              )}
            </div>

            {/* Right: Sources & Fullscreen */}
            <div className="flex items-center gap-3">
              {/* Multi-source selector */}
              {sources.length > 1 && (
                <div className="relative">
                  <select
                    value={activeSourceIndex}
                    onChange={(e) => setActiveSourceIndex(parseInt(e.target.value, 10))}
                    className="bg-[#182030] border border-white/15 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {sources.map((src, i) => (
                      <option key={src.id} value={i}>
                        {src.label} ({src.quality})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quality indicator badge */}
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/10 text-white border border-white/15">
                {currentSource?.quality || 'HD'}
              </span>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:text-red-400 transition-colors cursor-pointer"
                title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

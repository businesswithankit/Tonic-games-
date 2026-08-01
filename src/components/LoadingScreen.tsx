import React, { useState, useEffect } from 'react';
import { Gamepad2, Sparkles, Zap, Flame, Shield } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
  isReady: boolean;
  onFadeOutComplete: () => void;
  logoUrl?: string;
  websiteName?: string;
}

const GAMING_MESSAGES = [
  '🎮 Loading Games...',
  '🚀 Preparing Your Gaming Hub...',
  '⚡ Powering Up...',
  '🎯 Finding the Best Games...',
  '🔥 Loading Trending Games...',
  '🕹️ Almost Ready...',
  '🌌 Entering the Gaming World...',
  '⭐ Optimizing Your Experience...',
  '🎲 Collecting New Adventures...',
  '🎉 Get Ready to Play!',
];

// Lightweight CSS particles for mobile-friendly atmospheric gaming vibe
const PARTICLES = Array.from({ length: 18 }).map((_, idx) => ({
  id: idx,
  left: `${(idx * 17 + 13) % 92}%`,
  top: `${(idx * 23 + 19) % 88}%`,
  size: idx % 3 === 0 ? 3 : idx % 2 === 0 ? 4 : 2,
  duration: 4 + (idx % 4) * 1.5,
  delay: (idx % 5) * 0.7,
  color:
    idx % 3 === 0
      ? 'rgba(34, 211, 238, 0.45)' // Cyan
      : idx % 2 === 0
      ? 'rgba(217, 70, 239, 0.45)' // Fuchsia
      : 'rgba(168, 85, 247, 0.45)', // Purple
}));

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  isReady,
  onFadeOutComplete,
  logoUrl,
  websiteName = 'TONIC GAMES',
}) => {
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [showSlowNotice, setShowSlowNotice] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // Rotate gaming messages smoothly
  useEffect(() => {
    if (isReady && progress >= 100) {
      // Show the final celebratory message
      setMessageIndex(GAMING_MESSAGES.length - 1);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % (GAMING_MESSAGES.length - 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [isReady, progress]);

  // Show friendly advisory notice if loading takes longer than expected (e.g. slow connection)
  useEffect(() => {
    if (isReady) {
      setShowSlowNotice(false);
      return;
    }

    const slowTimer = setTimeout(() => {
      if (!isReady) {
        setShowSlowNotice(true);
      }
    }, 7000);

    return () => clearTimeout(slowTimer);
  }, [isReady]);

  // Trigger smooth fade-out once data is ready and progress reaches 100%
  useEffect(() => {
    if (isReady && progress >= 100 && !isFadingOut) {
      const startFadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        const completeTimer = setTimeout(() => {
          onFadeOutComplete();
        }, 450); // Match fade out duration
        return () => clearTimeout(completeTimer);
      }, 250); // Brief pause to show 100% and "Get Ready to Play!"

      return () => clearTimeout(startFadeTimer);
    }
  }, [isReady, progress, isFadingOut, onFadeOutComplete]);

  const displayProgress = Math.min(Math.max(Math.round(progress), 0), 100);
  const activeMessage =
    isReady && progress >= 100
      ? '🎉 Get Ready to Play!'
      : GAMING_MESSAGES[messageIndex] || '🎮 Loading Games...';

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-[#050508] via-[#0b0716] to-[#050508] text-white overflow-hidden select-none transition-opacity duration-450 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading gaming portal"
    >
      {/* Background Atmospheric Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-fuchsia-600/15 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[480px] h-80 sm:h-[480px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Lightweight CSS Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Center Glassmorphic Gaming Loading Card */}
      <div className="relative z-10 max-w-md w-full mx-4 px-6 py-8 sm:px-10 sm:py-10 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(34,211,238,0.12)] flex flex-col items-center text-center">
        {/* Brand Header / Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={websiteName}
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]"
            />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-purple-600 p-[2px] shadow-[0_0_25px_rgba(34,211,238,0.45)]">
                <div className="w-full h-full bg-[#08080f] rounded-[14px] flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                {websiteName}
              </span>
            </div>
          )}
          <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.25em] text-cyan-400/80 uppercase">
            PREMIUM WEB GAMING PORTAL
          </span>
        </div>

        {/* Futuristic Glowing Cyber Spinner */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-7 flex items-center justify-center">
          {/* Outer Rotating Glowing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-fuchsia-500 animate-spin shadow-[0_0_25px_rgba(34,211,238,0.3)]" />
          {/* Inner Reverse Rotating Ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 border-l-cyan-300 shadow-[0_0_18px_rgba(217,70,239,0.3)]"
            style={{ animation: 'spin 3s linear infinite reverse' }}
          />
          {/* Center Pulsing Gaming Icon */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-fuchsia-500/15 to-purple-500/15 border border-white/10 flex items-center justify-center shadow-inner">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 animate-pulse" />
          </div>
        </div>

        {/* Rotating Gaming Loading Message */}
        <div className="min-h-[28px] flex items-center justify-center mb-5 px-2">
          <p className="text-sm sm:text-base font-bold text-slate-100 tracking-wide transition-all duration-300">
            {activeMessage}
          </p>
        </div>

        {/* Animated Progress Bar Container */}
        <div className="w-full mb-3">
          <div className="w-full h-3 sm:h-3.5 rounded-full bg-white/10 p-0.5 border border-white/10 overflow-hidden relative shadow-inner">
            {/* Gradient Progress Fill */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 transition-all duration-300 ease-out relative shadow-[0_0_15px_rgba(34,211,238,0.6)]"
              style={{ width: `${displayProgress}%` }}
            >
              {/* Shimmer Light Highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Percentage Display & Readiness Badge */}
        <div className="w-full flex items-center justify-between text-xs font-bold px-1 text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400 font-extrabold">
            <Zap className="w-3.5 h-3.5" />
            <span>{displayProgress === 100 ? 'PORTAL READY' : 'OPTIMIZING REALM'}</span>
          </span>
          <span className="font-mono text-cyan-300 text-sm font-black">
            {displayProgress}%
          </span>
        </div>

        {/* Advisory Retry / Patience State for Slow Internet */}
        {showSlowNotice && (
          <div className="mt-6 w-full px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center justify-center gap-2 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span>Connection is taking longer than expected. Please wait...</span>
          </div>
        )}

        {/* Clean Gaming Feature Status Indicators */}
        <div className="mt-6 pt-5 border-t border-white/10 w-full flex items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
          <div className="flex items-center gap-1 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Instant Play</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            <span>No Downloads</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Mobile Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

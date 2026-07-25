import React from 'react';
import { Gamepad2, Play, Sparkles, Zap, Shield, Flame } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroBannerProps {
  settings: SiteSettings;
  onExploreClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ settings, onExploreClick }) => {
  if (!settings.heroVisible) return null;

  return (
    <div className="relative w-full overflow-hidden my-6 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(34,211,238,0.12)] bg-[#08080d]">
      {/* Background Image with Cyber Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={
            settings.heroBgImage ||
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80'
          }
          alt="Gaming Hero"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        {/* Atmospheric Blur Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 flex flex-col items-start gap-6">
        {/* Neon Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(34,211,238,0.25)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>PREMIUM HTML5 GAMING PORTAL</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.1]">
          {settings.heroTitle || 'ENTER THE ULTIMATE GAMING REALM'}
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
          {settings.heroSubtitle ||
            'Play hundreds of high-grade free web games directly in your browser with zero downloads, instant load times, and mobile support.'}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300 pt-2">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>100% Free to Play</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>No File Downloads</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Shield className="w-4 h-4 text-fuchsia-400" />
            <span>Mobile & Desktop</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            onClick={() => {
              if (onExploreClick) onExploreClick();
              else {
                const el = document.getElementById('trending-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-xs tracking-[0.15em] uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_45px_rgba(217,70,239,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{settings.heroButtonText || 'EXPLORE TRENDING GAMES'}</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('categories-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
            <span>BROWSE CATEGORIES</span>
          </button>
        </div>
      </div>
    </div>
  );
};

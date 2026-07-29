import React from 'react';
import {
  ArrowLeft,
  Gamepad2,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Users,
  Target,
  Send,
  HeartHandshake,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const AboutUsPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
  const customContent = settings.aboutUsContent;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in space-y-10">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Return to Home</span>
        </button>
        <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
          About Us
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen Browser Gaming Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About {settings.websiteName || 'TONIC GAMES'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Empowering millions of players around the world with instant, high-performance, free HTML5 browser games—no installs, no downloads, zero fuss.
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8">
        {customContent ? (
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            {customContent}
          </div>
        ) : (
          <>
            {/* Mission Statement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Instant Playback</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We harness modern WebGL and HTML5 technologies to load games instantly directly inside your web browser across desktop and mobile.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center border border-fuchsia-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Indie Creator Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We provide a global stage for independent game developers to showcase, distribute, and monetize their creative HTML5 titles.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Safe & Curated</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every game on our platform undergoes quality assurance to ensure smooth gameplay, clean safety standards, and high performance.
                </p>
              </div>
            </div>

            {/* Comprehensive Description */}
            <div className="space-y-4 pt-4 border-t border-white/10 text-slate-300 text-xs sm:text-sm leading-relaxed">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>Our Story & Mission</span>
              </h2>
              <p>
                Founded with a passion for web technology and accessibility, <strong className="text-cyan-300">{settings.websiteName || 'TONIC GAMES'}</strong> was built to remove friction from gaming. We believe everyone deserves instant access to high-quality entertainment without heavy downloads or intrusive software installations.
              </p>
              <p>
                Our portal curates hundreds of hand-selected games across multiple genres including Action, Arcade, Puzzle, Racing, Sports, Strategy, and Multiplayer. Whether you have 5 minutes or 5 hours, our responsive games adapt smoothly to your phone, tablet, or PC.
              </p>
            </div>

            {/* Developer Invitation */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-fuchsia-950/60 border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-6 h-6 text-fuchsia-400 shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Are You a Game Developer?</h3>
                  <p className="text-xs text-slate-300">
                    Submit your HTML5 game to reach thousands of active players worldwide.
                  </p>
                </div>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('submission')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Your Game Now</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

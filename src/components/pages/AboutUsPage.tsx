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
  Layers,
  Code2,
  Cpu,
  Mail,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const AboutUsPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
  const siteName = settings.websiteName || 'GAMES TONIC';

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
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          About Us
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span>Next-Gen HTML5 Gaming Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About {siteName}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Welcome to <strong className="text-cyan-300">{siteName}</strong>—the premier destination for instant, free HTML5 browser games. We empower millions of players worldwide with frictionless access to top-tier arcade, racing, puzzle, action, and strategy games directly in their browser.
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-10">
        
        {/* Core Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant WebGL Play</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Harnessing modern WebGL and HTML5 standards, all games launch instantly without downloads, executable installs, or plugin setups.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center border border-fuchsia-500/30">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Indie Developer Hub</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We provide a high-visibility global platform for independent game studios and solo creators to showcase, publish, and monetize their web titles.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Curated & Safe</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every game in our portal undergoes rigorous quality assurance to guarantee high frame rates, responsive controls, and secure execution.
            </p>
          </div>
        </div>

        {/* Detailed Story & Mission */}
        <div className="space-y-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Our Mission & Platform Vision</span>
          </h2>
          <p>
            At <strong className="text-white">{siteName}</strong>, we believe gaming should be accessible to everyone, anywhere, at any time. Traditional gaming platforms impose massive file downloads, system compatibility hurdles, and intrusive sign-up requirements. We built {siteName} to strip away all friction, creating a streamlined environment where high-quality games load in milliseconds across smartphones, tablets, laptops, and desktop computers.
          </p>
          <p>
            Our library is carefully curated across diverse categories—including Action & Shooter, Racing & Speed, Retro Arcade, Puzzle & Mind, Sports & Skill, and Adventure RPGs. Whether you are looking for a quick 2-minute distraction during a break or hours of immersive gameplay, our portal is optimized for peak performance.
          </p>
        </div>

        {/* Technical Architecture & Safety */}
        <div className="space-y-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-fuchsia-400" />
            <span>How Games Tonic Operates</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>External Play URL iFrame Architecture</span>
              </h4>
              <p className="text-xs text-slate-400">
                Games are hosted on secure HTTPS servers provided by verified developers or gaming networks. They are safely rendered within isolated sandboxed iFrames on our domain.
              </p>
            </li>
            <li className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Cross-Device Responsiveness</span>
              </h4>
              <p className="text-xs text-slate-400">
                Our player adapts dynamically to portrait and landscape orientations, automatically supporting touch screen gestures, keyboard controls, or gamepads.
              </p>
            </li>
            <li className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-pink-400" />
                <span>Zero Account Requirement</span>
              </h4>
              <p className="text-xs text-slate-400">
                Players do not need to create accounts or disclose personal credentials to enjoy full game access. Continue Playing queues are stored locally on your device.
              </p>
            </li>
            <li className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Fair Sponsorships</span>
              </h4>
              <p className="text-xs text-slate-400">
                We partner with select brand sponsors to display non-intrusive banner placements that keep our entire platform 100% free for players worldwide.
              </p>
            </li>
          </ul>
        </div>

        {/* Developer Invitation Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-purple-950/70 to-fuchsia-950/70 border border-white/15 space-y-4">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-7 h-7 text-fuchsia-400 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white">Are You a Game Developer or Studio?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publish your HTML5 titles on {siteName} using our multi-step developer submission wizard. Reach thousands of active players every day!
              </p>
            </div>
          </div>
          {onNavigate && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('submission')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Submit Your Game Now</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-purple-400" />
                <span>Contact Our Team</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved. Built for instant browser gaming worldwide.</p>
        </div>
      </div>
    </div>
  );
};

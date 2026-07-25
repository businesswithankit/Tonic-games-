import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  Flame,
  Sparkles,
  Star,
  ShieldCheck,
  Menu,
  X,
  Clock,
  Send,
  Lock,
} from 'lucide-react';
import { PageView, SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  onOpenSearch: () => void;
  onSelectCategory: (categorySlug: string | null) => void;
  recentlyPlayedCount: number;
  onOpenRecentlyPlayed: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activePage,
  setActivePage,
  onOpenSearch,
  onSelectCategory,
  recentlyPlayedCount,
  onOpenRecentlyPlayed,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageView, catSlug: string | null = null) => {
    setActivePage(page);
    onSelectCategory(catSlug);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.websiteName}
              className="h-10 w-auto object-contain rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-purple-600 p-[2px] shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] transition-all">
              <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          )}

          <div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent uppercase">
              {settings.websiteName || 'GAMES TONIC'}
            </span>
            <span className="block text-[10px] font-bold tracking-[0.25em] text-cyan-400/80 uppercase">
              PRO HTML5 PORTAL
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activePage === 'home'
                ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)] font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => {
              handleNavClick('home');
              const el = document.getElementById('trending-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            Trending
          </button>

          <button
            onClick={() => {
              handleNavClick('home');
              const el = document.getElementById('featured-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Featured
          </button>

          <button
            onClick={() => handleNavClick('submission')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activePage === 'submission'
                ? 'bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Send className="w-4 h-4 text-fuchsia-400" />
            Submit Game
          </button>
        </nav>

        {/* Actions (Search, Rate, Recently Played) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Live Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-500/50 hover:text-white transition-all group"
            title="Search Games (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-black/40 text-slate-400 rounded border border-white/10 font-mono">
              /
            </kbd>
          </button>

          {/* Recently Played Drawer Trigger */}
          {recentlyPlayedCount > 0 && (
            <button
              onClick={onOpenRecentlyPlayed}
              className="relative p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all"
              title="Recently Played"
            >
              <Clock className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#090a0f]">
                {recentlyPlayedCount}
              </span>
            </button>
          )}

          {/* External Rating Button */}
          {settings.rateButtonLink && (
            <a
              href={settings.rateButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:border-amber-400 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{settings.rateButtonText || 'Rate Us'}</span>
            </a>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-400"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-white/10 bg-[#0c0e17]/95 backdrop-blur-2xl px-4 py-4 space-y-3">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-4 py-3 rounded-xl bg-white/5 text-slate-200 font-medium flex items-center gap-3"
          >
            <Gamepad2 className="w-5 h-5 text-purple-400" />
            Home
          </button>

          <button
            onClick={() => {
              handleNavClick('home');
              const el = document.getElementById('trending-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left px-4 py-3 rounded-xl bg-white/5 text-slate-200 font-medium flex items-center gap-3"
          >
            <Flame className="w-5 h-5 text-amber-400" />
            Trending Games
          </button>

          <button
            onClick={() => {
              handleNavClick('home');
              const el = document.getElementById('categories-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left px-4 py-3 rounded-xl bg-white/5 text-slate-200 font-medium flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Categories
          </button>

          <button
            onClick={() => handleNavClick('submission')}
            className="w-full text-left px-4 py-3 rounded-xl bg-white/5 text-slate-200 font-medium flex items-center gap-3"
          >
            <Send className="w-5 h-5 text-pink-400" />
            Submit Game
          </button>

          {settings.rateButtonLink && (
            <a
              href={settings.rateButtonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-sm"
            >
              {settings.rateButtonText || '⭐ Rate Games Tonic'}
            </a>
          )}
        </div>
      )}
    </header>
  );
};

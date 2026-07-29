import React, { useState, useRef } from 'react';
import {
  Gamepad2,
  Shield,
  FileText,
  Mail,
  Send,
  Globe,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { PageView, SiteSettings } from '../types';
import { SocialMediaList } from './SocialIcons';

interface FooterProps {
  settings: SiteSettings;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, activePage, setActivePage }) => {
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyrightClick = (e: React.MouseEvent) => {
    if (e.detail === 3) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      setClickCount(0);
      setActivePage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
        setActivePage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return 0;
      }
      return next;
    });

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1200);
  };

  const getCopyrightText = () => {
    let raw = settings.footerText || '© 2026 TONIC GAMES. All rights reserved.';
    raw = raw.replace(/GAMES TONIC/gi, 'TONIC GAMES');
    raw = raw
      .replace(/\s*-?\s*The ultimate next-gen HTML5 gaming portal\.?/gi, '')
      .replace(/\s*-\s*The ultimate next-gen HTML5 gaming portal\s*-?/gi, '')
      .trim();
    if (!raw.includes('TONIC GAMES')) {
      raw = '© 2026 TONIC GAMES. All rights reserved.';
    }
    return raw;
  };

  return (
    <footer className="w-full mt-20 border-t border-white/10 bg-[#06070a]/95 backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          
          {/* 1. Website Information & 2. Social Media */}
          <div className="space-y-6 md:col-span-2 lg:col-span-4">
            {/* Website Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.websiteName || 'TONIC GAMES'}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1.5px]">
                    <div className="w-full h-full bg-[#080a10] rounded-[9px] flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                )}
                <span className="text-lg font-black tracking-wider text-white">
                  {settings.websiteName || 'TONIC GAMES'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                TONIC GAMES is a premium HTML5 gaming portal hosting high quality browser games with direct Play URLs. Zero downloads required.
              </p>
            </div>

            {/* Social Media */}
            <div className="space-y-2.5 pt-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">
                Connect With Us
              </h4>
              <SocialMediaList
                socialLinks={settings.socialLinks}
                twitter={settings.socialTwitter}
                discord={settings.socialDiscord}
                youtube={settings.socialYoutube}
                telegram={settings.socialTelegram}
              />
            </div>
          </div>

          {/* 3. Navigation */}
          <div className="space-y-3 md:col-span-1 lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group text-left w-full"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Home Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    setTimeout(() => {
                      const el = document.getElementById('trending-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group text-left w-full"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Trending Games</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    setTimeout(() => {
                      const el = document.getElementById('categories-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group text-left w-full"
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Game Categories</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Official Links */}
          <div className="space-y-3 md:col-span-1 lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-fuchsia-400">
              Official Links
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-400">
              <li>
                <a
                  href="https://games-tonic.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group text-left w-full p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10"
                >
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-200 group-hover:text-white">Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors ml-auto shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://games-tonic.ai.studio/suggest-feedback"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group text-left w-full p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 hover:bg-white/10"
                >
                  <MessageSquare className="w-4 h-4 text-fuchsia-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-200 group-hover:text-white">Suggestion & Feedback</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-fuchsia-400 transition-colors ml-auto shrink-0" />
                </a>
              </li>
            </ul>
          </div>

          {/* 5. Legal & Policies */}
          <div className="space-y-3 md:col-span-2 lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">
              Legal & Policies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-slate-400">
              <button
                onClick={() => {
                  setActivePage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>About Us</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('community-guidelines');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Community Guidelines</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('submission-policy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <FileText className="w-3.5 h-3.5 text-fuchsia-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Submission Policy</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('dmca');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>DMCA / Copyright Policy</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('copyright-removal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <FileText className="w-3.5 h-3.5 text-pink-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Copyright Removal</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('privacy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Privacy Policy</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('terms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Terms & Conditions</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Contact Us</span>
              </button>
              <button
                onClick={() => {
                  setActivePage('submission');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-left group sm:col-span-2"
              >
                <Send className="w-3.5 h-3.5 text-pink-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Developer Game Submission</span>
              </button>
            </div>
          </div>

        </div>

        {/* 6. Copyright */}
        <div
          onClick={handleCopyrightClick}
          className="text-center text-xs text-slate-500 font-medium select-none cursor-pointer hover:text-slate-300 transition-colors"
          title="Press 3 times to open Admin Panel"
        >
          {getCopyrightText()}
        </div>
      </div>
    </footer>
  );
};


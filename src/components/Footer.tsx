import React, { useState, useRef } from 'react';
import { Gamepad2, Shield, FileText, Mail, Send } from 'lucide-react';
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
    <footer className="w-full mt-20 border-t border-white/10 bg-[#06070a]/90 backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.websiteName || 'TONIC GAMES'} className="h-8 w-auto object-contain" />
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

            <p className="text-xs text-slate-400 leading-relaxed">
              TONIC GAMES is a premium HTML5 gaming portal hosting high quality browser games with direct Play URLs. Zero downloads required.
            </p>

            {/* Social Icons with Real Brand SVGs & Multi-Social Support */}
            <div className="pt-1">
              <SocialMediaList
                socialLinks={settings.socialLinks}
                twitter={settings.socialTwitter}
                discord={settings.socialDiscord}
                youtube={settings.socialYoutube}
                telegram={settings.socialTelegram}
              />
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    const el = document.getElementById('trending-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trending Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    const el = document.getElementById('categories-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Game Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Pages / Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">Legal & Support</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button
                  onClick={() => setActivePage('privacy')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('terms')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('submission')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-pink-400" />
                  Developer Game Submission
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright - Pressing 3 times opens Admin Panel */}
        <div
          onClick={handleCopyrightClick}
          className="pt-6 text-center text-xs text-slate-500 font-medium select-none cursor-pointer hover:text-slate-300 transition-colors"
          title="Press 3 times to open Admin Panel"
        >
          {getCopyrightText()}
        </div>
      </div>
    </footer>
  );
};

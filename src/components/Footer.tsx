import React from 'react';
import { Gamepad2, Shield, FileText, Mail, Send } from 'lucide-react';
import { PageView, SiteSettings } from '../types';
import { SocialMediaList } from './SocialIcons';

interface FooterProps {
  settings: SiteSettings;
  activePage: PageView;
  setActivePage: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, activePage, setActivePage }) => {
  return (
    <footer className="w-full mt-20 border-t border-white/10 bg-[#06070a]/90 backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.websiteName} className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1.5px]">
                  <div className="w-full h-full bg-[#080a10] rounded-[9px] flex items-center justify-center">
                    <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              )}
              <span className="text-lg font-black tracking-wider text-white">
                {settings.websiteName || 'GAMES TONIC'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              GAMES TONIC is a premium HTML5 gaming portal hosting high quality browser games with direct Play URLs. Zero downloads required.
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
                <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">
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
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('terms')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('submission')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-pink-400" />
                  Developer Game Submission
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-center text-xs text-slate-500 font-medium">
          {(settings.footerText || '© 2026 GAMES TONIC. All rights reserved.')
            .replace(/\s*-?\s*The ultimate next-gen HTML5 gaming portal\.?/gi, '')
            .replace(/\s*-\s*The ultimate next-gen HTML5 gaming portal\s*-?/gi, '')
            .trim()}
        </div>
      </div>
    </footer>
  );
};

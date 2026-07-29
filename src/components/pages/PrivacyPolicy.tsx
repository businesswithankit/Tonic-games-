import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye } from 'lucide-react';
import { SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PageProps> = ({ settings, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>LEGAL COMPLIANCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">
          Last Updated: February 2026 • Official Privacy Guidelines for {settings.websiteName || 'TONIC GAMES'}
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 text-sm text-slate-300 leading-relaxed">
        {settings.privacyPolicyContent ? (
          <div className="whitespace-pre-line space-y-4">
            {settings.privacyPolicyContent}
          </div>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                1. Information Collection & Use
              </h2>
              <p>
                {settings.websiteName || 'TONIC GAMES'} operates as an HTML5 gaming portal. We do not require public user account creation or registration to play games. We prioritize user anonymity and privacy.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                2. Local Storage Usage
              </h2>
              <p>
                We utilize browser Local Storage exclusively on your device to store user preferences, such as your Recently Played games, Continue Playing queue, and Recent Search queries. This data stays 100% client-side and is never sold or broadcasted.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                3. External Hosted Game Links
              </h2>
              <p>
                All games hosted on {settings.websiteName || 'GAMES TONIC'} are loaded via direct Play URLs provided by external developers or gaming networks. When playing external games, third-party hosts may process cookies or analytics according to their respective privacy terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">4. Contact Information</h2>
              <p>
                If you have any questions regarding this Privacy Policy, feel free to reach out via our official Contact Us page.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

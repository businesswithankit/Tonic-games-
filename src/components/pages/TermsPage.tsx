import React from 'react';
import { FileText, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
}

export const TermsPage: React.FC<PageProps> = ({ settings, onBack }) => {
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>TERMS OF SERVICE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Terms & Conditions</h1>
        <p className="text-xs text-slate-400">
          Last Updated: February 2026 • Usage Conditions for {settings.websiteName || 'TONIC GAMES'}
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 text-sm text-slate-300 leading-relaxed">
        {settings.termsContent ? (
          <div className="whitespace-pre-line space-y-4">
            {settings.termsContent}
          </div>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and playing games on {settings.websiteName || 'TONIC GAMES'}, you agree to comply with these terms. All games are provided free of charge for personal entertainment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                2. External Game Hosting Disclaimer
              </h2>
              <p>
                {settings.websiteName || 'TONIC GAMES'} does not store game executable binaries or proprietary assets on local servers. Each game runs via direct Play URLs provided by their respective copyright holders.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-white">3. Intellectual Property Rights</h2>
              <p>
                All game titles, trademarks, and artwork belong to their original developers. If you are a rights holder and wish to request removal of a link, please submit a notice via the Contact page.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

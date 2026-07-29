import React from 'react';
import {
  ArrowLeft,
  Users,
  ShieldAlert,
  CheckCircle,
  XCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const CommunityGuidelinesPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
  const customContent = settings.communityGuidelinesContent;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in space-y-10">
      {/* Top Nav */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Return to Home</span>
        </button>
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          Community Standards
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Users className="w-4 h-4 text-purple-400" />
          <span>Fair Play & Safety First</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Community Guidelines
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Our community standards ensure that {settings.websiteName || 'TONIC GAMES'} remains a welcoming, fair, and secure environment for players, developers, and creators worldwide.
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
            {/* Encouraged Behaviors */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>What We Encourage</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
                  <h4 className="font-bold text-emerald-300">Respect & Inclusivity</h4>
                  <p className="text-slate-400">
                    Treat all players and developers with courtesy. Constructive feedback helps creators refine their games.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
                  <h4 className="font-bold text-emerald-300">Fair Play & Authentic Scores</h4>
                  <p className="text-slate-400">
                    Compete honorably. Celebrate genuine high scores and skill progression without automated bots or exploits.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
                  <h4 className="font-bold text-emerald-300">Original Game Creation</h4>
                  <p className="text-slate-400">
                    Support original work. Developers must submit content they created or have explicit authorization to share.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
                  <h4 className="font-bold text-emerald-300">Prompt Reporting</h4>
                  <p className="text-slate-400">
                    Report broken game links, inappropriate content, or copyright concerns directly to our administration team.
                  </p>
                </div>
              </div>
            </div>

            {/* Prohibited Behaviors */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>Strictly Prohibited Actions</span>
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                <li>
                  <strong className="text-white">Malware & Phishing:</strong> Submitting games containing malicious code, hidden tracking scripts, or redirection loops to harmful sites.
                </li>
                <li>
                  <strong className="text-white">Harassment & Hate Speech:</strong> Any discriminatory, abusive, or threatening language in game assets, developer names, or contact communications.
                </li>
                <li>
                  <strong className="text-white">Copyright & Trademark Infringement:</strong> Uploading games containing stolen graphics, proprietary audio, or unregistered asset rips.
                </li>
                <li>
                  <strong className="text-white">Cheating & Botting:</strong> Utilizing memory injection, macro scripts, or fake analytics to tamper with high scores or game play metrics.
                </li>
              </ul>
            </div>

            {/* Enforcement & Reporting */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Enforcement & Compliance</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Violations of these guidelines may result in immediate game removal, submission rejections, or permanent blocking of developer accounts.
              </p>
              {onNavigate && (
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate('contact')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-2 hover:bg-cyan-500/30 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Report a Violation</span>
                  </button>
                  <button
                    onClick={() => onNavigate('submission-policy')}
                    className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-2 hover:bg-purple-500/30 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Read Game Submission Policy</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

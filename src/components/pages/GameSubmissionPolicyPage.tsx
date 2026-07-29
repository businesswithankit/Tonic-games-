import React from 'react';
import {
  ArrowLeft,
  FileCheck,
  ShieldCheck,
  Code2,
  Lock,
  Layers,
  AlertTriangle,
  Send,
  HelpCircle,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const GameSubmissionPolicyPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
  const customContent = settings.gameSubmissionPolicyContent;

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
        <span className="text-xs font-mono text-fuchsia-400 uppercase tracking-widest">
          Submission Policy
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
          <FileCheck className="w-4 h-4 text-fuchsia-400" />
          <span>Developer Publishing Terms</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Game Submission Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Requirements, rights management, and review workflows for publishing HTML5 browser games on {settings.websiteName || 'TONIC GAMES'}.
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">1. Rights Ownership</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You must hold all intellectual property rights or explicit written distribution licenses for submitted games.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <Code2 className="w-6 h-6 text-fuchsia-400" />
                <h3 className="text-sm font-bold text-white">2. Web Standards</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Games must run smoothly over HTTPS iFrame embedding, supporting desktop keyboard/mouse or mobile touch controls.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <Layers className="w-6 h-6 text-purple-400" />
                <h3 className="text-sm font-bold text-white">3. Review Process</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submissions enter a Pending Review status. Approved games go live directly to our public portal index.
                </p>
              </div>
            </div>

            {/* Detailed Policy Sections */}
            <div className="space-y-6 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white text-cyan-300">
                  A. Ownership & Intellectual Property Confirmation
                </h3>
                <p>
                  By submitting any game, artwork, audio asset, or brand title to <strong className="text-white">{settings.websiteName || 'TONIC GAMES'}</strong>, you represent and warrant that:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li>You are the sole author/creator of the game or authorized developer representative.</li>
                  <li>The game does not infringe upon third-party trademarks, copyrights, or trade secrets.</li>
                  <li>No unauthorized third-party game assets (sprites, music, models) have been included without licensing.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white text-fuchsia-300">
                  B. Technical Specifications & Performance
                </h3>
                <p>
                  To provide a seamless experience for players:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li><strong>Play URL:</strong> Must be a valid, secure HTTPS link allowing iframe embedding without broken headers.</li>
                  <li><strong>Responsiveness:</strong> Must specify landscape or portrait orientation and handle viewport scaling cleanly.</li>
                  <li><strong>No Forced Popups:</strong> Games must not execute aggressive window popups, malware redirects, or infinite loops.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white text-purple-300">
                  C. Review, Approval & Right to Remove
                </h3>
                <p>
                  Our administrative team reserves full discretion to review, approve, reject, or unpublish any game submission at any time if it fails to meet technical, quality, or community guidelines.
                </p>
              </div>
            </div>

            {/* Submit CTA */}
            {onNavigate && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-fuchsia-950/60 to-purple-950/60 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Ready to Publish Your Game?</h3>
                  <p className="text-xs text-slate-300">
                    Accept our submission policies and publish your HTML5 game today!
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('submission')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Go to Submission Form</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

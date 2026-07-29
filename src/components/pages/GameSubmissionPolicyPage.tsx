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
  CheckCircle2,
  Globe,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const GameSubmissionPolicyPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
  const siteName = settings.websiteName || 'GAMES TONIC';

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
          Developer Guidelines
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
          <FileCheck className="w-4 h-4 text-fuchsia-400" />
          <span>Developer Publishing Policy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Game Submission Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive requirements, rights verification, technical standards, and administrative review protocols for publishing HTML5 browser games on <strong className="text-fuchsia-300">{siteName}</strong>.
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8">
        
        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">1. Rights Ownership</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Developers must hold complete intellectual property rights or explicit written distribution licensing for all submitted game assets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Code2 className="w-6 h-6 text-fuchsia-400" />
            <h3 className="text-sm font-bold text-white">2. WebGL & HTTPS</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Games must run smoothly over HTTPS iFrame embedding, supporting desktop mouse/keyboard or mobile touch controls.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Layers className="w-6 h-6 text-purple-400" />
            <h3 className="text-sm font-bold text-white">3. Multi-Step Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All submissions undergo administrative QA verification. Approved games go live directly to our public portal index.
            </p>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="space-y-6 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <div className="space-y-2">
            <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Section A. Ownership & Intellectual Property Affirmation</span>
            </h3>
            <p>
              By submitting any game, artwork, audio track, developer logo, or brand title to <strong className="text-white">{siteName}</strong>, you guarantee and represent that:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li>You are the original creator of the game code or an authorized representative of the publishing studio.</li>
              <li>The game does not infringe upon third-party trademarks, copyrights, trade secrets, or proprietary code.</li>
              <li>No unauthorized third-party sprites, 3D models, or copyrighted audio files have been included without valid licensing.</li>
              <li>If AI generation tools were utilized during creation, you disclose the AI Prompt Link/Details in the submission wizard.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-fuchsia-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-fuchsia-400" />
              <span>Section B. Technical Specifications & Security Standards</span>
            </h3>
            <p>
              To maintain high portal performance and user safety, submitted games must comply with the following technical criteria:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
              <li><strong>Valid Embed Play URL:</strong> Must provide a direct, secure HTTPS link allowing iframe embedding without restrictive X-Frame-Options block headers.</li>
              <li><strong>Screen Orientation & Scaling:</strong> Must specify landscape or portrait orientation and handle responsive viewport resizing cleanly.</li>
              <li><strong>No Executable Downloads:</strong> Games must be 100% web-based HTML5/WebGL. We do not host downloadable `.exe`, `.apk`, or zip files.</li>
              <li><strong>Zero Malware & No Forced Popups:</strong> Games must not trigger browser popups, forced window redirects, crypto-mining scripts, or phishing redirects.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Section C. The 5-Step Developer Submission Wizard</span>
            </h3>
            <p>
              Submissions are processed through our developer submission wizard:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-300 bg-black/40 p-4 rounded-2xl border border-white/5">
              <li><strong>Step 1 - Basic Information:</strong> Game title, version, category selection, developer name, thumbnail URL, and Play URL.</li>
              <li><strong>Step 2 - Game Details:</strong> Supported platforms multi-select (Android, iOS, Windows, macOS, Linux, Web), screen orientation, features, tags, and detailed instructions.</li>
              <li><strong>Step 3 - Optional Info:</strong> Developer website link, contact email, and AI Project / Prompt Link.</li>
              <li><strong>Step 4 - Quick Preview:</strong> Review game details in real-time before submitting.</li>
              <li><strong>Step 5 - Submit:</strong> Direct submission into Firebase Firestore for admin QA review.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Section D. Review, Approval & Rights to Remove</span>
            </h3>
            <p>
              {siteName} administrators maintain sole discretion during game screening. We reserve the right to approve, reject, re-categorize, or unpublish any submission if technical glitches arise, Play URLs expire, or community standards are breached.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Section E. Developer Rights & Unpublishing Requests</span>
            </h3>
            <p>
              Developers retain 100% of their intellectual property rights. If you wish to update a Play URL or request the removal of your game from {siteName}, contact our team via the official Contact Us form, and your game will be unindexed promptly.
            </p>
          </div>
        </div>

        {/* Action Banner */}
        {onNavigate && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-fuchsia-950/70 via-purple-950/70 to-cyan-950/70 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Ready to Publish Your HTML5 Game?</h3>
              <p className="text-xs text-slate-300">
                Launch our 5-step Developer Submission Wizard now and preview your game live!
              </p>
            </div>
            <button
              onClick={() => onNavigate('submission')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shrink-0 shadow-lg shadow-fuchsia-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Open Submission Wizard</span>
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName}. Supporting independent HTML5 game creators worldwide.</p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ArrowLeft,
  Users,
  ShieldAlert,
  CheckCircle,
  XCircle,
  MessageSquare,
  Sparkles,
  ShieldCheck,
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

export const CommunityGuidelinesPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
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
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          Community Standards
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Users className="w-4 h-4 text-purple-400" />
          <span>Safety & Community Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Community Guidelines
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          These standards ensure that <strong className="text-cyan-300">{siteName}</strong> remains a safe, fair, transparent, and enjoyable gaming ecosystem for players, developers, and partners across the world.
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8">
        
        {/* Purpose Overview */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Core Community Principles</span>
          </h2>
          <p>
            Whether you are playing games during a quick break or submitting HTML5 titles as a game developer, everyone interacting with {siteName} is expected to adhere to our standards of integrity, respect, and technical safety.
          </p>
        </div>

        {/* Encouraged Behaviors */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>1. What We Encourage</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
              <h4 className="font-bold text-emerald-300">Respect & Constructive Feedback</h4>
              <p className="text-slate-400">
                Treat all players and game studios with courtesy. When communicating with developers or leaving game reviews, offer helpful, constructive input.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
              <h4 className="font-bold text-emerald-300">Fair Play & Genuine Scores</h4>
              <p className="text-slate-400">
                Compete with honor. Celebrate authentic skill progression and high scores without using memory injection, automated bots, or exploits.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
              <h4 className="font-bold text-emerald-300">Original Game Publishing</h4>
              <p className="text-slate-400">
                Support original work. Developers must submit content they authored or have explicit, documented distribution authorization to share.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1.5">
              <h4 className="font-bold text-emerald-300">Active Reporting of Issues</h4>
              <p className="text-slate-400">
                Help maintain platform quality. Report broken game links, improper embedded ads, or copyright infringements promptly to our admin team.
              </p>
            </div>
          </div>
        </div>

        {/* Strictly Prohibited Actions */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            <span>2. Strictly Prohibited Conduct</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <h4 className="font-bold text-rose-300">A. Security & Technical Abuse</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                <li>Submitting games containing malware, viruses, crypto-miners, or tracking spyware.</li>
                <li>Executing aggressive forced popups, tab redirects, or external URL hijacks inside iFrames.</li>
                <li>Attempting to bypass security controls or perform Denial of Service (DoS) attacks on {siteName}.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <h4 className="font-bold text-rose-300">B. Intellectual Property & Fraud</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                <li>Submitting stolen games, unauthorized asset rips, or cloned games without developer consent.</li>
                <li>Impersonating another game studio, developer, or platform administrator.</li>
                <li>Falsifying submission details, AI prompt links, or ownership documentation.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <h4 className="font-bold text-rose-300">C. Harassment & Inappropriate Content</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                <li>Promoting hate speech, discrimination, violence, or sexually explicit material in game assets or descriptions.</li>
                <li>Harassing players, developers, or support staff via contact submission forms or public channels.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Review & Moderation Workflow */}
        <div className="space-y-4 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>3. Moderation & Enforcement Protocol</span>
          </h2>
          <p>
            Our administration team active monitors game submissions and contact reports. If a game submission or developer violates these guidelines, {siteName} reserves full authority to execute enforcement actions, including:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
            <li><strong>Rejection of Pending Submissions:</strong> Denying game indexing during the review phase.</li>
            <li><strong>Immediate Game Takedowns:</strong> Instantly unpublishing and hiding offending games from the public directory.</li>
            <li><strong>Developer Blacklisting:</strong> Permanently blocking offending developer email addresses and domain links from future submissions.</li>
            <li><strong>Legal Referrals:</strong> Reporting severe security threats or fraudulent activities to relevant legal authorities.</li>
          </ul>
        </div>

        {/* Reporting & Quick Links */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-white">Spotted a Violation or Broken Game?</h3>
              <p className="text-xs text-slate-300">
                Help us protect the community by filing a direct report to our administration team.
              </p>
            </div>
          </div>
          {onNavigate && (
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-2 hover:bg-cyan-500/30 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Submit Contact Report</span>
              </button>
              <button
                onClick={() => onNavigate('submission-policy')}
                className="px-4 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-2 hover:bg-purple-500/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Read Game Submission Policy</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName}. Dedicated to fair play and digital safety.</p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ArrowLeft,
  Shield,
  FileText,
  AlertOctagon,
  Scale,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const DMCAPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
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
        <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">
          Copyright Compliance
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>DMCA & Copyright Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          DMCA & Copyright Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          <strong className="text-purple-300">{siteName}</strong> fully respects the intellectual property rights of creators, independent game studios, and copyright holders. We operate in compliance with the Digital Millennium Copyright Act (17 U.S.C. § 512).
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8">
        
        {/* Protection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">DMCA Compliance Notice</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We maintain strict policies to respond expeditiously to clear, formal notices of alleged copyright infringement submitted in accordance with federal law.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Expedited Takedown Protocol</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon receipt of a valid infringement notification, our legal team immediately disables or unindexes access to the allegedly infringing Play URL link.
            </p>
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Elements of a Valid DMCA Takedown Notice</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            To submit an official copyright removal request, please ensure your written notification includes the following required elements:
          </p>
          <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-300 bg-black/40 p-5 rounded-2xl border border-white/5">
            <li><strong>Signature:</strong> A physical or electronic signature of a person authorized to act on behalf of the copyright holder.</li>
            <li><strong>Identification of Work:</strong> Clear identification of the copyrighted work claimed to have been infringed (or link to original work).</li>
            <li><strong>Exact Location on Portal:</strong> The direct URL link on {siteName} where the allegedly infringing game is listed.</li>
            <li><strong>Contact Details:</strong> Your full legal name, company name, physical address, telephone number, and official email address.</li>
            <li><strong>Good Faith Statement:</strong> A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
            <li><strong>Perjury Statement:</strong> A statement made under penalty of perjury that the information provided in your notice is accurate and truthful.</li>
          </ol>
        </div>

        {/* Counter-Notice & Repeat Infringers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300">
          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-bold text-purple-300">
              Counter-Notification Procedure
            </h3>
            <p className="text-slate-400">
              If a game developer believes their game link was removed by error or misidentification, they may file a formal counter-notice containing proof of licensing or ownership to request link restoration.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-base font-bold text-pink-300">
              Repeat Infringer Disqualification
            </h3>
            <p className="text-slate-400">
              In accordance with DMCA mandates, {siteName} enforces a strict repeat infringer policy, permanently revoking submission access from any developer who repeatedly violates third-party copyright.
            </p>
          </div>
        </div>

        {/* Link to Online Takedown Form */}
        {onNavigate && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/70 via-pink-950/70 to-cyan-950/70 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Need to File a Takedown Notice?</h3>
              <p className="text-xs text-slate-300">
                Submit your official Copyright Removal Request using our fast online form.
              </p>
            </div>
            <button
              onClick={() => onNavigate('copyright-removal')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              <Send className="w-4 h-4" />
              <span>File Copyright Removal Request</span>
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName}. Compliant with 17 U.S.C. § 512 DMCA standards.</p>
        </div>
      </div>
    </div>
  );
};

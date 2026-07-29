import React from 'react';
import {
  ArrowLeft,
  Shield,
  FileText,
  AlertOctagon,
  Scale,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const DMCAPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
  const customContent = settings.dmcaPolicyContent;

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
          Copyright Policy
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Digital Millennium Copyright Act Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          DMCA & Copyright Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {settings.websiteName || 'TONIC GAMES'} respects the intellectual property rights of creators and copyright owners. We respond promptly to notices of alleged copyright infringement.
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
            {/* Notice Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">DMCA Protection Notice</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  It is our policy to respond to clear notices of alleged copyright infringement in compliance with the Digital Millennium Copyright Act (17 U.S.C. § 512).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Fast Take-Down Action</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upon receipt of a valid infringement notification, we will expeditiously remove or disable access to the allegedly infringing game link.
                </p>
              </div>
            </div>

            {/* Elements of a Valid Take-Down Notice */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Required DMCA Notice Details</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To submit a valid DMCA take-down notice, please provide the following details in writing:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300 bg-black/40 p-5 rounded-2xl border border-white/5">
                <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
                <li>Identification of the copyrighted work claimed to have been infringed.</li>
                <li>Identification of the material that is claimed to be infringing (including the direct URL on our portal).</li>
                <li>Your contact information, including your full name, physical address, telephone number, and email address.</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement made under penalty of perjury that the information in the notification is accurate.</li>
              </ol>
            </div>

            {/* Counter-Notification & Repeat Infringers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white text-purple-300">
                  Counter-Notification Procedure
                </h3>
                <p>
                  If a game developer believes their content was removed by mistake or misidentification, they may file a counter-notice with our designated agent containing proof of licensing or ownership.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white text-pink-300">
                  Repeat Infringer Policy
                </h3>
                <p>
                  In accordance with DMCA requirements, we maintain a policy of terminating developer submission privileges for individuals who repeatedly infringe intellectual property rights.
                </p>
              </div>
            </div>

            {/* Link to Copyright Removal Request Page */}
            {onNavigate && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-pink-950/60 to-cyan-950/60 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Need to File a Removal Request?</h3>
                  <p className="text-xs text-slate-300">
                    Submit your official Copyright Removal Request using our fast online submission form.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('copyright-removal')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  <span>File Removal Request</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

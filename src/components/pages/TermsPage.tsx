import React from 'react';
import { FileText, ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck, Scale, Globe, Layers, Send } from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const TermsPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
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
          Terms of Service
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Official Terms of Use</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Last Updated: February 2026 • Legal Terms and Conditions governing access to and use of <strong className="text-purple-300">{siteName}</strong>.
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing, browsing, or playing games on <strong className="text-white">{siteName}</strong>, you agree to be bound by these Terms & Conditions and all applicable laws. If you do not agree with any part of these terms, you must discontinue using our platform immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>2. External Game Hosting Disclaimer</span>
          </h2>
          <p>
            {siteName} is an HTML5 game directory and streaming portal:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>No Executable File Storage:</strong> We do not host downloadable game executables (`.exe`, `.apk`, zip packages) on our local servers.</li>
            <li><strong>Embedded Play URLs:</strong> Games are embedded via direct, secure HTTPS Play URLs provided by external game developers or verified distribution partners.</li>
            <li><strong>Third-Party Content Availability:</strong> We are not responsible for server downtime or content modifications on third-party external game servers.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Scale className="w-5 h-5 text-purple-400" />
            <span>3. Intellectual Property Rights</span>
          </h2>
          <p>
            All website design elements, custom layout components, branding, graphics, and code logic are the property of {siteName}. All individual game titles, characters, trademarks, soundtracks, and artwork belong exclusively to their respective original developers or copyright holders.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>4. Permitted & Prohibited Conduct</span>
          </h2>
          <p>
            Users are granted a personal, non-exclusive, non-transferable license to access and play games for personal entertainment:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Prohibited Actions:</strong> Automated scraping, botting, reverse engineering of the portal codebase, introducing malicious scripts into iFrames, or flooding network servers.</li>
            <li><strong>Commercial Exploitation:</strong> You may not re-sell, re-package, or frame {siteName} content within unauthorized commercial applications without written consent.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Layers className="w-5 h-5 text-fuchsia-400" />
            <span>5. Developer Game Submissions</span>
          </h2>
          <p>
            Developers who submit games via our 5-step Developer Submission Wizard grant {siteName} a non-exclusive, worldwide, royalty-free license to embed, display, index, and promote the game title on our portal. Developers retain full ownership and may request unpublishing at any time.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Globe className="w-5 h-5 text-pink-400" />
            <span>6. Disclaimer of Warranties & Limitation of Liability</span>
          </h2>
          <p>
            {siteName} is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. In no event shall {siteName} or its operators be liable for indirect, incidental, or consequential damages resulting from portal usage or third-party game availability.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="text-lg font-bold text-white">7. Terms Revisions & Contact</h2>
          <p>
            We reserve the right to revise these Terms & Conditions at any time. Continued use of the website following updates constitutes acceptance of modified terms. For legal inquiries, please reach out via our official Contact Us page.
          </p>
        </section>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

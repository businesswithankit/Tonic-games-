import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye, Server, Megaphone, FileText, Mail } from 'lucide-react';
import { PageView, SiteSettings } from '../../types';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
}

export const PrivacyPolicyPage: React.FC<PageProps> = ({ settings, onBack, onNavigate }) => {
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
          Legal Compliance
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Official Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Last Updated: February 2026 • Official Privacy and Data Protection Guidelines for <strong className="text-cyan-300">{siteName}</strong>.
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <span>1. Information Collection & Use</span>
          </h2>
          <p>
            <strong className="text-white">{siteName}</strong> operates as a public HTML5 gaming portal. We prioritize user privacy and player anonymity:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>No Player Account Required:</strong> You do not need to register, create an account, or disclose personal identity credentials to play any game on our website.</li>
            <li><strong>Contact & Submission Data:</strong> If you voluntarily submit a message via our Contact form or submit a game via our Developer Submission Wizard, we collect your name, email address, and submission details exclusively to process your request.</li>
            <li><strong>Server Logs:</strong> Like standard web platforms, our cloud infrastructure automatically logs standard technical metadata (IP address, browser type, device type, referrer URL) to guarantee portal security and prevent malicious traffic spikes.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Database className="w-5 h-5 text-purple-400" />
            <span>2. Local Storage Usage</span>
          </h2>
          <p>
            We utilize standard browser Local Storage exclusively on your client device to enhance your gameplay experience. This data stays 100% local to your browser and is never sold, broadcasted, or tracked across external websites:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Recently Played Queue:</strong> Remembers game titles you recently played so you can resume instantly.</li>
            <li><strong>Favorites & Game Scores:</strong> Saves your bookmarked games and locally tracked high scores.</li>
            <li><strong>UI Preferences:</strong> Stores screen layout settings and category filters.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <span>3. External Hosted Game Links & iFrames</span>
          </h2>
          <p>
            Games presented on {siteName} are loaded via direct Play URLs provided by external developers or gaming distribution networks. When playing these games inside an embedded iFrame, third-party hosts may process cookies or analytics according to their respective privacy terms:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li>External game hosts operate independently from {siteName}.</li>
            <li>We encourage players to review the privacy policies of third-party game developers if they interact with in-game purchasing or account systems within specific external games.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Server className="w-5 h-5 text-fuchsia-400" />
            <span>4. Firebase Backend Infrastructure & Data Security</span>
          </h2>
          <p>
            Our portal uses Google Firebase (Firestore and Authentication) for secure backend database management:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li>Admin authentication is protected with encrypted SSL connections and strict security rules.</li>
            <li>Contact inquiries and developer game submissions stored in Firestore are restricted to authorized administrators.</li>
            <li>We implement industry-standard encryption protocols to protect all stored operational data against unauthorized access.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Megaphone className="w-5 h-5 text-pink-400" />
            <span>5. Sponsor Banners & Advertising Networks</span>
          </h2>
          <p>
            {siteName} displays sponsor promotional banners and network ad codes (such as Google AdSense or sponsor graphics) to keep our platform free for all users:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li>Third-party ad networks may use cookies to serve ads based on non-personally identifiable visit history.</li>
            <li>You can opt out of personalized advertising by adjusting your browser cookie settings or visiting digital advertising choice portals.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>6. GDPR, CCPA & Children's Privacy (COPPA)</span>
          </h2>
          <p>
            We comply with global data protection regulations (GDPR, CCPA, and COPPA):
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Data Subject Rights:</strong> You have the right to request access to, correction of, or deletion of any contact messages or developer submissions you submitted to us.</li>
            <li><strong>Children's Privacy:</strong> Our portal offers general audience web games. We do not knowingly collect personal information from children under the age of 13.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>7. Contact Privacy Officer</span>
          </h2>
          <p>
            If you have questions, data access requests, or concerns regarding this Privacy Policy, please reach out directly via our official Contact Us page.
          </p>
          {onNavigate && (
            <button
              onClick={() => onNavigate('contact')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs uppercase hover:bg-cyan-500/30 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Go to Contact Page</span>
            </button>
          )}
        </section>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName}. Privacy protected & secured.</p>
        </div>
      </div>
    </div>
  );
};

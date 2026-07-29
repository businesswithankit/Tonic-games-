import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  FileX,
  Send,
  CheckCircle2,
  AlertOctagon,
  User,
  Mail,
  Link as LinkIcon,
  FileText,
  Lock,
} from 'lucide-react';
import { PageView, SiteSettings } from '../../types';
import { saveContactToStore } from '../../firebase';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
  onRefreshData?: () => void;
}

export const CopyrightRemovalPage: React.FC<PageProps> = ({
  settings,
  onBack,
  onNavigate,
  onRefreshData,
}) => {
  const customContent = settings.copyrightRemovalContent;

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    rightsHolder: '',
    gameTitle: '',
    gameUrl: '',
    proofOfOwnership: '',
    details: '',
    agreedToTerms: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.gameTitle || !form.agreedToTerms) return;

    setSubmitting(true);
    try {
      await saveContactToStore({
        name: form.fullName,
        email: form.email,
        subject: `[DMCA REMOVAL REQUEST] Game: ${form.gameTitle}`,
        message: `COPYRIGHT REMOVAL NOTICE DETAILS:
- Rights Holder / Organization: ${form.rightsHolder || form.fullName}
- Target Game Title: ${form.gameTitle}
- Target Game URL on Portal: ${form.gameUrl || 'N/A'}
- Proof of Ownership / Original Work Link: ${form.proofOfOwnership || 'N/A'}

INFRACTING DETAILS & STATEMENT:
${form.details}

Good Faith Statement: Verified under penalty of perjury.`,
        createdAt: new Date().toISOString(),
      });

      setSubmitted(true);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Failed to send removal notice:', err);
    } finally {
      setSubmitting(false);
    }
  };

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
        <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">
          Removal Notice
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider">
          <FileX className="w-4 h-4 text-pink-400" />
          <span>Copyright Removal Notice Form</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Copyright Removal Request
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          If you are a copyright owner or authorized representative and believe content on {settings.websiteName || 'TONIC GAMES'} infringes your work, please complete this official removal request.
        </p>
      </div>

      {/* Main Glassmorphic Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8">
        {customContent && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-6">
            {customContent}
          </div>
        )}

        {submitted ? (
          <div className="py-12 text-center space-y-5 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Notice Received Successfully</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your copyright removal request for <strong className="text-pink-400">{form.gameTitle}</strong> has been transmitted directly to our copyright management team for immediate review and take-down processing.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black text-xs uppercase cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-xs text-pink-200 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-white mb-0.5">Important Legal Notice</strong>
                Under Section 512(f) of the DMCA, any person who knowingly misrepresents that material or activity is infringing may be subject to liability for damages.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Full Legal Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Contact Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="legal@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-pink-400" />
                  <span>Copyright Holder / Company</span>
                </label>
                <input
                  type="text"
                  value={form.rightsHolder}
                  onChange={(e) => setForm({ ...form, rightsHolder: e.target.value })}
                  placeholder="e.g. Pixel Forge Interactive LLC"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase flex items-center gap-1.5">
                  <FileX className="w-3.5 h-3.5 text-amber-400" />
                  <span>Target Game Title *</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.gameTitle}
                  onChange={(e) => setForm({ ...form, gameTitle: e.target.value })}
                  placeholder="Name of game on our portal"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Portal Game URL</span>
                </label>
                <input
                  type="url"
                  value={form.gameUrl}
                  onChange={(e) => setForm({ ...form, gameUrl: e.target.value })}
                  placeholder="https://ourportal.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Link to Original Copyrighted Work</span>
                </label>
                <input
                  type="url"
                  value={form.proofOfOwnership}
                  onChange={(e) => setForm({ ...form, proofOfOwnership: e.target.value })}
                  placeholder="https://original-game-store.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Description of Infringement & Statement *</span>
              </label>
              <textarea
                rows={4}
                required
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Detail the copyrighted assets (art, audio, code) that are infringed without authorization..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={form.agreedToTerms}
                  onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
                  className="mt-0.5 accent-pink-500 rounded cursor-pointer"
                />
                <span>
                  I swear, under penalty of perjury, that I am the copyright owner or authorized agent, and that the information in this notification is accurate and submitted in good faith.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !form.agreedToTerms}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{submitting ? 'Transmitting Notice...' : 'Submit Copyright Removal Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

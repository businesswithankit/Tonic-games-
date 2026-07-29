import React, { useState } from 'react';
import { Mail, Send, ArrowLeft, CheckCircle2, MessageSquare, Shield, Sparkles, HelpCircle } from 'lucide-react';
import { PageView, SiteSettings } from '../../types';
import { saveContactToStore } from '../../firebase';

interface PageProps {
  settings: SiteSettings;
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
  onRefreshData?: () => void;
}

export const ContactPage: React.FC<PageProps> = ({ settings, onBack, onNavigate, onRefreshData }) => {
  const siteName = settings.websiteName || 'GAMES TONIC';

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitting(true);
      try {
        await saveContactToStore({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
          message: formData.message,
          createdAt: new Date().toISOString(),
        });
        setSubmitted(true);
        if (onRefreshData) onRefreshData();
      } catch (err) {
        console.error('Failed to save contact message:', err);
      } finally {
        setSubmitting(false);
      }
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
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
          Support & Contact
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Direct Contact Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Contact {siteName}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Have player feedback, broken game reports, developer inquiries, or sponsor partnership proposals? Reach out to our team directly.
        </p>
      </div>

      {/* Communication Channels Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Player Support</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Report gameplay bugs, broken iframe links, or site suggestions.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <Sparkles className="w-6 h-6 text-fuchsia-400" />
          <h3 className="text-sm font-bold text-white">Developer Partnerships</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inquiries regarding HTML5 game publishing or portfolio features.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <Shield className="w-6 h-6 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Legal & Compliance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            DMCA notifications, copyright removal requests, and privacy inquiries.
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Form Container */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-8">
        {submitted ? (
          <div className="py-12 text-center space-y-5 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Message Delivered Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to <strong className="text-cyan-400">{siteName}</strong>. Our support team will review your message and respond via email within 24-48 hours.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
              }}
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase hover:bg-cyan-400 transition-all cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Subject / Inquiry Type
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Broken game report / Sponsorship inquiry"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Message Content *
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message, feedback, or inquiry in detail here..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-fuchsia-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{submitting ? 'Transmitting Message...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteName}. Support inquiries monitored 24/7.</p>
        </div>
      </div>
    </div>
  );
};

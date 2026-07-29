import React, { useState } from 'react';
import { X, Flag, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Game } from '../types';
import { saveContactToStore } from '../firebase';

interface ReportModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ game, isOpen, onClose }) => {
  const [reason, setReason] = useState('Game Not Loading / Broken Link');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveContactToStore({
        name: 'Game Reporter',
        email: email.trim() || 'anonymous@user.com',
        subject: `[GAME REPORT] ${game.title} (ID: ${game.id})`,
        message: `Report Reason: ${reason}\n\nAdditional Details: ${details.trim() || 'No additional details provided.'}`,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#0c0d18] border border-white/15 p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">Report Submitted</h3>
            <p className="text-xs text-slate-300">
              Thank you for helping us maintain game quality. Our moderation team will review this issue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
                <Flag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Report Problem with Game</h3>
                <p className="text-xs text-slate-400 truncate max-w-[300px]">{game.title}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Issue Category
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-400"
              >
                <option value="Game Not Loading / Broken Link" className="bg-[#0c0d18] text-white">
                  Game Not Loading / Broken Link
                </option>
                <option value="Controls Not Working" className="bg-[#0c0d18] text-white">
                  Controls Not Working
                </option>
                <option value="Performance / Lag Issue" className="bg-[#0c0d18] text-white">
                  Performance / Lag Issue
                </option>
                <option value="Inappropriate Content" className="bg-[#0c0d18] text-white">
                  Inappropriate Content
                </option>
                <option value="Copyright / DMCA Concern" className="bg-[#0c0d18] text-white">
                  Copyright / DMCA Concern
                </option>
                <option value="Other Issue" className="bg-[#0c0d18] text-white">
                  Other Issue
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Your Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Describe the Issue
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Please provide details about what happened when playing..."
                className="w-full bg-white/5 border border-white/15 rounded-xl p-4 text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-red-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Reports are reviewed by platform admins within 24 hours.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

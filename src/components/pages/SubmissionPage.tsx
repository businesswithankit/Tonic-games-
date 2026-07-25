import React, { useState } from 'react';
import {
  ArrowLeft,
  Gamepad2,
  Send,
  CheckCircle2,
  HardDrive,
  Link as LinkIcon,
  Image as ImageIcon,
  User,
  Mail,
  Tag,
  FileText,
  Sparkles,
  Layers,
  HelpCircle,
  Code2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Category, SiteSettings } from '../../types';
import { saveSubmissionToStore } from '../../firebase';

interface PageProps {
  settings: SiteSettings;
  categories: Category[];
  onBack: () => void;
  onRefreshData?: () => void;
}

export const SubmissionPage: React.FC<PageProps> = ({
  settings,
  categories,
  onBack,
  onRefreshData,
}) => {
  const [formData, setFormData] = useState({
    gameTitle: '',
    version: '1.0.0',
    weight: '10 MB',
    features: 'Touch Controls, 60 FPS Engine, Leaderboards',
    playUrl: '',
    thumbnailUrl: '',
    description: '',
    longDescription: '',
    category: categories[0]?.slug || 'action',
    developerName: '',
    contactEmail: '',
    orientation: 'landscape' as 'portrait' | 'landscape',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gameTitle || !formData.playUrl || !formData.developerName) return;

    setSubmitting(true);
    try {
      const parsedFeatures = formData.features
        ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
        : ['HTML5 WebGL', 'Responsive Play'];

      await saveSubmissionToStore({
        gameTitle: formData.gameTitle,
        version: formData.version || '1.0.0',
        weight: formData.weight || '10 MB',
        features: parsedFeatures,
        playUrl: formData.playUrl,
        thumbnailUrl:
          formData.thumbnailUrl ||
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        description: formData.description,
        longDescription: formData.longDescription || formData.description,
        category: formData.category,
        developerName: formData.developerName,
        contactEmail: formData.contactEmail || 'developer@studio.com',
        orientation: formData.orientation,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });

      setSubmitted(true);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Failed to submit game:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      gameTitle: '',
      version: '1.0.0',
      weight: '10 MB',
      features: 'Touch Controls, 60 FPS Engine, Leaderboards',
      playUrl: '',
      thumbnailUrl: '',
      description: '',
      longDescription: '',
      category: categories[0]?.slug || 'action',
      developerName: '',
      contactEmail: '',
      orientation: 'landscape',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in space-y-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
          <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
          <span>DEVELOPER GAME SUBMISSION PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Submit & Publish Your HTML5 Game
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Publish your game on {settings.websiteName || 'GAMES TONIC'}. Fill in the game version, weight, features, and detailed gameplay description. Approved games go live directly to thousands of instant players!
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(217,70,239,0.1)]">
        {submitted ? (
          <div className="py-12 text-center space-y-5 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Game Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for submitting <strong className="text-cyan-400">{formData.gameTitle}</strong> (v{formData.version})! Our admin team will review your submission details and publish it.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-lg cursor-pointer"
              >
                Submit Another Game
              </button>
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Return to Games Portal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Basic Game Information</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* 1. Name of the game */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Game Title / Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.gameTitle}
                  onChange={(e) => setFormData({ ...formData, gameTitle: e.target.value })}
                  placeholder="e.g. Cyber Nitro Runner"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Version of the game */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Version *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g. 1.0.0 or 2.4.0"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Weight of the game */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Game Weight / Size *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g. 15 MB, 8.5 MB"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400 transition-colors font-mono"
                />
              </div>

              {/* Game Features (comma separated) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Game Features (Comma Separated) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="e.g. 60 FPS Engine, Touch Controls, Global Leaderboard, 50 Levels"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Link of the game */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Play URL (Embed / Game Link) *</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.playUrl}
                  onChange={(e) => setFormData({ ...formData, playUrl: e.target.value })}
                  placeholder="https://play.gamepix.com/my-game/embed"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Image link of the game */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Game Image / Thumbnail URL *</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Category *</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0d16] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug} className="bg-[#0b0d16] text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Developer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Developer / Studio Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.developerName}
                  onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                  placeholder="e.g. Neon Pulse Studios"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Contact Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="e.g. developer@studio.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Screen Orientation Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Optimal Screen Orientation
              </label>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="radio"
                    name="orientation"
                    value="landscape"
                    checked={formData.orientation === 'landscape'}
                    onChange={() => setFormData({ ...formData, orientation: 'landscape' })}
                    className="accent-fuchsia-500"
                  />
                  <span>Landscape Mode (Desktop/Mobile)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="radio"
                    name="orientation"
                    value="portrait"
                    checked={formData.orientation === 'portrait'}
                    onChange={() => setFormData({ ...formData, orientation: 'portrait' })}
                    className="accent-fuchsia-500"
                  />
                  <span>Portrait Mode (Mobile First)</span>
                </label>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Short Game Description *</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write a catchy 1-2 sentence preview of the game..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Detailed Long Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Detailed Gameplay Description & Instructions</span>
              </label>
              <textarea
                rows={5}
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                placeholder="Explain game mechanics, storylines, character controls (Arrow keys / WASD / Touch gestures), power-ups, level progression, and tips in detail..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_45px_rgba(34,211,238,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{submitting ? 'Submitting Game...' : 'Submit & Publish Game'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Another Form / Detailed Helper Section Below for Developers */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold text-white">Developer Publishing Guidelines & Specifications</h3>
            <p className="text-xs text-slate-400">Everything you need to know about publishing on GAMES TONIC.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
              <Zap className="w-4 h-4" />
              <span>1. Instant HTML5 Embedding</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your HTTPS Play URL is rendered inside a high-speed iFrame container. Ensure your game server allows cross-origin embedding and HTTPS protocols.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-fuchsia-400 text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>2. No Popup / Direct Play</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once published, players can click and start playing immediately without forced popup dialogs or interstitial load gates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase">
              <Code2 className="w-4 h-4" />
              <span>3. Features & Weight</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              List key feature tags (e.g., 60 FPS, Touch Controls) and game weight (MB) so players on mobile and slow networks know what to expect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

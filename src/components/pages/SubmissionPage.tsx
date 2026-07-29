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
  ShieldAlert,
  X,
  ExternalLink,
  Eye,
  Plus,
  Bot,
  Monitor,
  Smartphone,
  Check,
  Play,
  Copy,
} from 'lucide-react';
import { Category, PageView, SiteSettings } from '../../types';
import { saveSubmissionToStore } from '../../firebase';

interface PageProps {
  settings: SiteSettings;
  categories: Category[];
  onBack: () => void;
  onNavigate?: (page: PageView) => void;
  onRefreshData?: () => void;
}

const PLATFORM_OPTIONS = ['Android', 'iOS', 'Windows', 'macOS', 'Linux', 'Web Browser'];

const PRESET_TAGS = [
  'Action',
  'Adventure',
  'Puzzle',
  'Racing',
  'Horror',
  'Multiplayer',
  'Arcade',
  'Casual',
  'Offline',
  'Online',
];

export const SubmissionPage: React.FC<PageProps> = ({
  settings,
  categories,
  onBack,
  onNavigate,
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
    aiPromptUsed: '',
    platforms: ['Web Browser'] as string[],
    tags: ['Action', 'Arcade'] as string[],
  });

  const [customTagInput, setCustomTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [previewIframeActive, setPreviewIframeActive] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Platform multi-select toggle
  const togglePlatform = (p: string) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(p);
      if (exists) {
        return { ...prev, platforms: prev.platforms.filter((item) => item !== p) };
      } else {
        return { ...prev, platforms: [...prev.platforms, p] };
      }
    });
  };

  // Tag toggle / add / remove
  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      if (exists) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  const handleAddCustomTag = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = customTagInput.trim();
    if (!trimmed) return;
    if (!formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setCustomTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagToRemove) }));
  };

  // Open quick preview modal
  const handleOpenPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewIframeActive(false);
    setShowPreviewModal(true);
  };

  // When user clicks Submit Game button on main form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gameTitle || !formData.playUrl || !formData.developerName) return;

    // Reset policy acceptance and show policy modal
    setPolicyAccepted(false);
    setShowPolicyModal(true);
  };

  // Triggered from modal after checking checkbox & clicking Accept & Submit
  const handleAcceptAndSubmit = async () => {
    if (!policyAccepted) return;

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
        aiPromptUsed: formData.aiPromptUsed,
        platforms: formData.platforms,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });

      setShowPolicyModal(false);
      setShowPreviewModal(false);
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
    setShowPolicyModal(false);
    setShowPreviewModal(false);
    setPolicyAccepted(false);
    setPreviewIframeActive(false);
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
      aiPromptUsed: '',
      platforms: ['Web Browser'],
      tags: ['Action', 'Arcade'],
    });
  };

  const copyPromptToClipboard = () => {
    if (!formData.aiPromptUsed) return;
    navigator.clipboard.writeText(formData.aiPromptUsed);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
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
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Publish your game on {settings.websiteName || 'TONIC GAMES'}. Specify supported platforms, tags, gameplay instructions, and preview your game live before publishing!
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
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Basic Game Information</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Name of the game */}
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

              {/* Game Features */}
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
                  placeholder="e.g. 60 FPS Engine, Touch Controls, Global Leaderboard"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Play URL / Embed link */}
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

              {/* Game Thumbnail URL */}
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

            {/* Supported Platforms Multi-Select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supported Platforms (Select Multiple)</span>
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {PLATFORM_OPTIONS.map((plat) => {
                  const isSelected = formData.platforms.includes(plat);
                  return (
                    <button
                      type="button"
                      key={plat}
                      onClick={() => togglePlatform(plat)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{plat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Game Tags Input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Game Tags</span>
              </label>

              {/* Preset Tags Toggle */}
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((tag) => {
                  const isSelected = formData.tags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tag Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomTag(e);
                  }}
                  placeholder="Add custom tag (e.g. Cyberpunk, Speedrun)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400"
                />
                <button
                  type="button"
                  onClick={(e) => handleAddCustomTag(e)}
                  className="px-4 py-2.5 rounded-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/40 text-fuchsia-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>

              {/* Currently Selected Tags Pills */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Selected Tags:
                  </span>
                  {formData.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-purple-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                rows={4}
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                placeholder="Explain game mechanics, storylines, character controls (Arrow keys / WASD / Touch gestures), power-ups, level progression, and tips in detail..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400 transition-colors"
              />
            </div>

            {/* AI Prompt Used Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Prompt Used (Optional)</span>
              </label>
              <textarea
                rows={3}
                value={formData.aiPromptUsed}
                onChange={(e) => setFormData({ ...formData, aiPromptUsed: e.target.value })}
                placeholder="Paste the AI prompt used to generate or build this game (e.g. Gemini, ChatGPT, Claude prompt)..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 font-mono transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                If you created or modified this game using AI prompts, sharing them helps the community understand how the game was built!
              </p>
            </div>

            {/* Action Buttons: Quick Preview & Submit */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleOpenPreview}
                className="w-full sm:w-1/2 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:border-cyan-400 transition-all cursor-pointer shadow-md"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Preview Game</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-1/2 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-sm uppercase tracking-[0.12em] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_45px_rgba(34,211,238,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>{submitting ? 'Submitting Game...' : 'Submit & Publish Game'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Developer Publishing Helper Section */}
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
              Your HTTPS Play URL is rendered inside a high-speed iFrame container. Ensure your game server allows cross-origin embedding.
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
              <span>3. Features & Platforms</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              List key feature tags and supported platforms so players on mobile and desktop know what to expect.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0b0d18] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Live Game Card & Page Preview</h3>
                  <p className="text-xs text-slate-400">Review how your game will appear to players on the portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Game Header Banner & Iframe Test */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 aspect-video flex items-center justify-center group">
                {previewIframeActive && formData.playUrl ? (
                  <iframe
                    src={formData.playUrl}
                    title={formData.gameTitle || 'Game Preview'}
                    className="w-full h-full border-0"
                    allow="autoplay; payment; fullscreen; microphone; camera; focus-without-user-activation"
                  />
                ) : (
                  <>
                    <img
                      src={
                        formData.thumbnailUrl ||
                        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={formData.gameTitle || 'Game Thumbnail'}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                      <div className="px-3 py-1 rounded-full bg-fuchsia-500/30 border border-fuchsia-400 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
                        {formData.category || 'Action'} • {formData.orientation.toUpperCase()}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                        {formData.gameTitle || 'Untitled Game'}
                      </h2>
                      {formData.playUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewIframeActive(true)}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shadow-lg"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Test Play Embedded Frame</span>
                        </button>
                      ) : (
                        <p className="text-xs text-amber-300 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30">
                          Enter a Play URL to test live embedding
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Developer</span>
                  <p className="font-bold text-white truncate">{formData.developerName || 'Developer Name'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Version</span>
                  <p className="font-bold text-cyan-400 font-mono">v{formData.version || '1.0.0'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Weight</span>
                  <p className="font-bold text-fuchsia-400 font-mono">{formData.weight || '10 MB'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Category</span>
                  <p className="font-bold text-amber-400 capitalize">{formData.category}</p>
                </div>
              </div>

              {/* Supported Platforms */}
              {formData.platforms.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    <span>Supported Platforms</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.platforms.map((plat) => (
                      <span
                        key={plat}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
                      >
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {formData.tags.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Game Tags</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Descriptions */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Short Summary</span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {formData.description || 'No short description provided yet.'}
                  </p>
                </div>

                {formData.longDescription && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Detailed Instructions & Gameplay
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {formData.longDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* AI Prompt Used Box */}
              {formData.aiPromptUsed && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>AI Prompt Used</span>
                    </span>
                    <button
                      type="button"
                      onClick={copyPromptToClipboard}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-black/60 text-slate-300 text-xs font-mono whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto border border-white/5">
                    {formData.aiPromptUsed}
                  </div>
                </div>
              )}
            </div>

            {/* Preview Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs uppercase cursor-pointer transition-all"
              >
                Close & Edit Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowPolicyModal(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Proceed to Submit Game</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Policy Acceptance Confirmation Modal Popup */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c0e1a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(217,70,239,0.3)] space-y-6">
            <button
              onClick={() => setShowPolicyModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close Popup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-cyan-500 p-[2px] shrink-0">
                <div className="w-full h-full bg-[#0a0b14] rounded-[14px] flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-fuchsia-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Accept Website Policies</h3>
                <p className="text-xs text-fuchsia-400 font-semibold uppercase tracking-wider">
                  Mandatory Submission Confirmation
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>
                Before submitting your game, please read and accept our policies. By continuing, you confirm that you own the rights to this game or have permission to submit it.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-xs text-slate-200">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-fuchsia-500 rounded cursor-pointer shrink-0"
                />
                <span className="leading-snug">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('submission-policy');
                    }}
                    className="text-fuchsia-400 font-bold underline hover:text-fuchsia-300 inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Game Submission Policy</span>
                    <ExternalLink className="w-3 h-3 inline" />
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate('community-guidelines');
                    }}
                    className="text-cyan-400 font-bold underline hover:text-cyan-300 inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Community Guidelines</span>
                    <ExternalLink className="w-3 h-3 inline" />
                  </button>
                  .
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!policyAccepted || submitting}
                onClick={handleAcceptAndSubmit}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>{submitting ? 'Submitting...' : 'Accept & Submit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

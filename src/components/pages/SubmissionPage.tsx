import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Send,
  CheckCircle2,
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
  Check,
  Play,
  Copy,
  Globe,
  Compass,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
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
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    gameTitle: '',
    version: '1.0.0',
    playUrl: '',
    thumbnailUrl: '',
    description: '',
    category: categories[0]?.slug || 'action',
    developerName: '',
    // Step 2
    platforms: ['Web Browser'] as string[],
    orientation: 'landscape' as 'portrait' | 'landscape',
    features: 'Touch Controls, 60 FPS Engine, Leaderboards',
    tags: ['Action', 'Arcade'] as string[],
    longDescription: '',
    // Step 3 (Optional)
    contactEmail: '',
    developerWebsite: '',
    aiPromptUsed: '',
  });

  const [customTagInput, setCustomTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [previewIframeActive, setPreviewIframeActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [stepAttempted, setStepAttempted] = useState<Record<number, boolean>>({});

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

  // Validation checkers
  const isStep1Valid = () => {
    return (
      formData.gameTitle.trim() !== '' &&
      formData.version.trim() !== '' &&
      formData.category.trim() !== '' &&
      formData.developerName.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.thumbnailUrl.trim() !== '' &&
      formData.playUrl.trim() !== ''
    );
  };

  const isStep2Valid = () => {
    return (
      formData.platforms.length > 0 &&
      formData.tags.length > 0 &&
      formData.longDescription.trim() !== ''
    );
  };

  const isStep3Valid = () => {
    // All step 3 fields are optional! If entered, validate URL format if present
    if (formData.aiPromptUsed.trim() !== '') {
      const val = formData.aiPromptUsed.trim();
      const isUrl = val.startsWith('http://') || val.startsWith('https://');
      if (!isUrl) return false;
    }
    if (formData.developerWebsite.trim() !== '') {
      const val = formData.developerWebsite.trim();
      const isUrl = val.startsWith('http://') || val.startsWith('https://');
      if (!isUrl) return false;
    }
    return true;
  };

  const isStepValid = (step: number) => {
    if (step === 1) return isStep1Valid();
    if (step === 2) return isStep2Valid();
    if (step === 3) return isStep3Valid();
    return true;
  };

  const handleNextStep = () => {
    setStepAttempted((prev) => ({ ...prev, [currentStep]: true }));
    if (!isStepValid(currentStep)) return;
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (targetStep: number) => {
    if (targetStep === currentStep) return;
    // Can navigate to previous steps or target step if prior steps are valid
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }
    // Checking all steps before targetStep
    for (let s = 1; s < targetStep; s++) {
      if (!isStepValid(s)) {
        setStepAttempted((prev) => ({ ...prev, [s]: true }));
        setCurrentStep(s);
        return;
      }
    }
    setCurrentStep(targetStep);
  };

  // Final submit handler
  const handleInitiateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isStep1Valid() || !isStep2Valid() || !isStep3Valid()) {
      alert('Please complete all required fields across steps 1 through 3 before submitting.');
      return;
    }
    setPolicyAccepted(false);
    setShowPolicyModal(true);
  };

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
        weight: 'N/A', // Weight removed from form, defaulted safely
        features: parsedFeatures,
        playUrl: formData.playUrl,
        thumbnailUrl:
          formData.thumbnailUrl ||
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        description: formData.description,
        longDescription: formData.longDescription || formData.description,
        category: formData.category,
        developerName: formData.developerName,
        contactEmail: formData.contactEmail || '',
        developerWebsite: formData.developerWebsite || '',
        orientation: formData.orientation,
        aiPromptUsed: formData.aiPromptUsed,
        platforms: formData.platforms,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        status: 'pending',
      });

      setShowPolicyModal(false);
      setSubmitted(true);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Failed to submit game:', err);
      alert('An error occurred while submitting your game. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setShowPolicyModal(false);
    setPolicyAccepted(false);
    setPreviewIframeActive(false);
    setCurrentStep(1);
    setStepAttempted({});
    setFormData({
      gameTitle: '',
      version: '1.0.0',
      playUrl: '',
      thumbnailUrl: '',
      description: '',
      category: categories[0]?.slug || 'action',
      developerName: '',
      platforms: ['Web Browser'],
      orientation: 'landscape',
      features: 'Touch Controls, 60 FPS Engine, Leaderboards',
      tags: ['Action', 'Arcade'],
      longDescription: '',
      contactEmail: '',
      developerWebsite: '',
      aiPromptUsed: '',
    });
  };

  const copyLinkToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const STEPS_CONFIG = [
    { number: 1, name: 'Basic Info', label: 'Basic Information (Required)' },
    { number: 2, name: 'Game Details', label: 'Game Details & Features' },
    { number: 3, name: 'Optional Info', label: 'Optional Contact & AI Links' },
    { number: 4, name: 'Preview', label: 'Review Submission Preview' },
    { number: 5, name: 'Submit', label: 'Final Confirmation & Publish' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-8">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
            WIZARD MODE
          </span>
        </div>
      </div>

      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
          <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
          <span>DEVELOPER GAME SUBMISSION PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Submit & Publish Your HTML5 Game
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Complete our 5-step submission wizard to publish your game on {settings.websiteName || 'GAMES TONIC'}. Review your live preview before final submission!
        </p>
      </div>

      {/* MULTI-STEP WIZARD PROGRESS BAR */}
      {!submitted && (
        <div className="glass-card p-4 sm:p-6 rounded-3xl border border-white/10 space-y-4 shadow-lg">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-black text-white uppercase tracking-wider">
                Step {currentStep} of 5
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-bold text-cyan-400">
                {STEPS_CONFIG[currentStep - 1].label}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-slate-400">
              {Math.round((currentStep / 5) * 100)}% Completed
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(217,70,239,0.5)]"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Step Badges Navigation */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 pt-2">
            {STEPS_CONFIG.map((step) => {
              const isActive = currentStep === step.number;
              const isPassed = currentStep > step.number;
              const isValid = isStepValid(step.number);

              return (
                <button
                  type="button"
                  key={step.number}
                  onClick={() => handleJumpToStep(step.number)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.25)]'
                      : isPassed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                      : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border ${
                      isActive
                        ? 'bg-fuchsia-500 border-fuchsia-300 text-slate-950 font-black'
                        : isPassed
                        ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300'
                        : 'bg-black/40 border-white/10 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : step.number}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold truncate hidden sm:block">
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* WIZARD CARD CONTAINER */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(217,70,239,0.1)]">
        {submitted ? (
          /* SUCCESS SCREEN */
          <div className="py-12 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Game Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for submitting <strong className="text-cyan-400">{formData.gameTitle}</strong> (v{formData.version})! Your game is currently in <span className="text-amber-400 font-bold">Pending Review</span> status.
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
          <div className="space-y-8">
            {/* STEP 1: BASIC INFORMATION (REQUIRED) */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <span>Step 1: Basic Information (Required)</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Enter core game title, version, category, and direct URLs.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                    Step 1 of 5
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Game Title */}
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
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-xs focus:outline-none transition-colors ${
                        stepAttempted[1] && !formData.gameTitle.trim()
                          ? 'border-red-500/80 focus:border-red-400'
                          : 'border-white/10 focus:border-cyan-400'
                      }`}
                    />
                    {stepAttempted[1] && !formData.gameTitle.trim() && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Game title is required
                      </p>
                    )}
                  </div>

                  {/* Version */}
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
                      placeholder="e.g. 1.0.0"
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-xs focus:outline-none font-mono transition-colors ${
                        stepAttempted[1] && !formData.version.trim()
                          ? 'border-red-500/80 focus:border-red-400'
                          : 'border-white/10 focus:border-purple-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Category *</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0d16] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
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
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-xs focus:outline-none transition-colors ${
                        stepAttempted[1] && !formData.developerName.trim()
                          ? 'border-red-500/80 focus:border-red-400'
                          : 'border-white/10 focus:border-purple-400'
                      }`}
                    />
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
                    placeholder="Write a catchy 1-2 sentence preview summary of the game..."
                    className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-xs focus:outline-none transition-colors ${
                      stepAttempted[1] && !formData.description.trim()
                        ? 'border-red-500/80 focus:border-red-400'
                        : 'border-white/10 focus:border-cyan-400'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Game Thumbnail URL */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Game Thumbnail URL *</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-xs focus:outline-none transition-colors ${
                        stepAttempted[1] && !formData.thumbnailUrl.trim()
                          ? 'border-red-500/80 focus:border-red-400'
                          : 'border-white/10 focus:border-fuchsia-400'
                      }`}
                    />
                    {formData.thumbnailUrl && (
                      <div className="mt-2 relative rounded-xl overflow-hidden h-20 border border-white/10 bg-black/50">
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <span className="absolute bottom-1 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                          Thumbnail Preview
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Play URL (Embed Link) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Play URL (Embed / Game URL) *</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.playUrl}
                      onChange={(e) => setFormData({ ...formData, playUrl: e.target.value })}
                      placeholder="https://play.gamepix.com/my-game/embed"
                      className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-xs focus:outline-none transition-colors ${
                        stepAttempted[1] && !formData.playUrl.trim()
                          ? 'border-red-500/80 focus:border-red-400'
                          : 'border-white/10 focus:border-cyan-400'
                      }`}
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Direct HTTPS link to embed or launch your HTML5 web game.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: GAME DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-fuchsia-400" />
                      <span>Step 2: Game Details</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure platform support, orientation, feature tags, and full instructions.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] font-bold uppercase">
                    Step 2 of 5
                  </span>
                </div>

                {/* Supported Platforms */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Supported Platforms (Multi-Select) *</span>
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PLATFORM_OPTIONS.map((plat) => {
                      const isSelected = formData.platforms.includes(plat);
                      return (
                        <button
                          type="button"
                          key={plat}
                          onClick={() => togglePlatform(plat)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
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

                {/* Screen Orientation */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                    Optimal Screen Orientation *
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
                      <span>Landscape Mode (Desktop & Tablet)</span>
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
                    placeholder="e.g. Touch Controls, 60 FPS Engine, Global Leaderboard"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Game Tags Input */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Game Tags *</span>
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
                      placeholder="Add custom tag (e.g. Speedrun, Cyberpunk)..."
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

                  {/* Selected Tags Pills */}
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

                {/* Detailed Gameplay Description & Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Detailed Gameplay Description & Instructions *</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    placeholder="Explain game mechanics, character controls (Arrow keys / WASD / Touch gestures), power-ups, level progression, and tips in detail..."
                    className={`w-full px-4 py-3 rounded-xl bg-black/40 border text-white text-xs focus:outline-none transition-colors ${
                      stepAttempted[2] && !formData.longDescription.trim()
                        ? 'border-red-500/80 focus:border-red-400'
                        : 'border-white/10 focus:border-fuchsia-400'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: OPTIONAL INFORMATION */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <span>Step 3: Optional Information</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      All fields in this step are completely optional. You can leave them blank or provide developer links.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase">
                    Step 3 of 5
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Contact Email (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Contact Email (Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="e.g. developer@studio.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Developer Website URL (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-fuchsia-400" />
                      <span>Developer Website URL (Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.developerWebsite}
                      onChange={(e) => setFormData({ ...formData, developerWebsite: e.target.value })}
                      placeholder="https://mygamestudio.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400 transition-colors"
                    />
                  </div>
                </div>

                {/* AI Project / Prompt Link (Optional) - URL ONLY */}
                <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                  <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span>AI Project / Prompt Link (Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.aiPromptUsed}
                    onChange={(e) => setFormData({ ...formData, aiPromptUsed: e.target.value })}
                    placeholder="https://ai.studio/... or https://chatgpt.com/share/... or https://github.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-purple-500/30 text-white text-xs font-mono focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <div className="text-[11px] text-slate-400 space-y-1 leading-relaxed">
                    <p className="flex items-center gap-1 text-purple-300 font-semibold">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Accepted link types:
                    </p>
                    <ul className="list-disc list-inside text-slate-400 pl-1 space-y-0.5">
                      <li>Google AI Studio Share Link</li>
                      <li>ChatGPT Shared Conversation Link</li>
                      <li>GitHub Repository / Gist</li>
                      <li>Other project / prompt URL</li>
                    </ul>
                    <p className="text-slate-500 text-[10px] pt-1">
                      Note: Only valid URLs starting with http:// or https:// are stored in Firebase to save database storage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PREVIEW */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      <span>Step 4: Submission Preview</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Review how your game listing will appear to players before publishing.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                    Step 4 of 5
                  </span>
                </div>

                {/* Preview Banner & Interactive Frame Test */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 aspect-video flex items-center justify-center group shadow-xl">
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

                {/* Metadata Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Developer</span>
                    <p className="font-bold text-white truncate">{formData.developerName || 'N/A'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Version</span>
                    <p className="font-bold text-cyan-400 font-mono">v{formData.version || '1.0.0'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Category</span>
                    <p className="font-bold text-amber-400 capitalize">{formData.category}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Orientation</span>
                    <p className="font-bold text-fuchsia-400 capitalize">{formData.orientation}</p>
                  </div>
                </div>

                {/* Platforms & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5" />
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

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
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
                </div>

                {/* Descriptions */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Short Description
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {formData.description || 'No short description provided.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Detailed Instructions & Mechanics
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {formData.longDescription || 'No detailed instructions provided.'}
                    </p>
                  </div>
                </div>

                {/* Optional Links Display */}
                {(formData.contactEmail || formData.developerWebsite || formData.aiPromptUsed) && (
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3 text-xs">
                    <span className="font-bold text-purple-300 uppercase text-[10px] tracking-wider block">
                      Developer Contact & AI Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.contactEmail && (
                        <div>
                          <span className="text-slate-500 text-[10px] block">Contact Email</span>
                          <span className="text-white font-mono">{formData.contactEmail}</span>
                        </div>
                      )}
                      {formData.developerWebsite && (
                        <div>
                          <span className="text-slate-500 text-[10px] block">Developer Website</span>
                          <a
                            href={formData.developerWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fuchsia-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <span className="truncate">{formData.developerWebsite}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                      {formData.aiPromptUsed && (
                        <div className="sm:col-span-2">
                          <span className="text-slate-500 text-[10px] block">AI Project / Prompt Link</span>
                          <a
                            href={formData.aiPromptUsed}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-1 font-mono font-bold"
                          >
                            <Bot className="w-3.5 h-3.5 text-purple-400" />
                            <span className="break-all">{formData.aiPromptUsed}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Jump to step edit buttons */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">Need to modify any detail before publishing?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 font-bold transition-all cursor-pointer"
                    >
                      Edit Step 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-fuchsia-300 border border-fuchsia-500/30 font-bold transition-all cursor-pointer"
                    >
                      Edit Step 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/30 font-bold transition-all cursor-pointer"
                    >
                      Edit Step 3
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FINAL CONFIRMATION & SUBMIT */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in text-center py-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-purple-600 p-[2px] mx-auto shadow-[0_0_30px_rgba(217,70,239,0.4)]">
                  <div className="w-full h-full bg-[#0b0d18] rounded-full flex items-center justify-center">
                    <Send className="w-7 h-7 text-fuchsia-400" />
                  </div>
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] font-bold uppercase tracking-wider">
                    Step 5 of 5 • Ready to Publish
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Submit Your Game for Review
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    You are submitting <strong className="text-cyan-400">{formData.gameTitle}</strong> to {settings.websiteName || 'GAMES TONIC'}. Once accepted, your game will be assigned <span className="text-amber-400 font-bold">Pending Review</span> status for moderation before appearing live.
                  </p>
                </div>

                {/* Summary Box */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 max-w-lg mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Game Title:</span>
                    <span className="font-bold text-white">{formData.gameTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Developer:</span>
                    <span className="font-bold text-purple-300">{formData.developerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-bold text-amber-300 uppercase">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Supported Platforms:</span>
                    <span className="font-bold text-cyan-300">{formData.platforms.join(', ')}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleInitiateSubmit}
                    className="w-full sm:w-2/3 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-sm uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(217,70,239,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="w-5 h-5 text-slate-950" />
                    <span>Submit & Publish Game</span>
                  </button>
                </div>
              </div>
            )}

            {/* WIZARD NAVIGATION FOOTER (PREVIOUS / NEXT BUTTONS) */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:scale-105 transition-all cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleInitiateSubmit}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Submit & Publish</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
                Before submitting your game, please read and accept our policies. By continuing, you confirm that you own the rights to this game or have permission to submit it for publication.
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

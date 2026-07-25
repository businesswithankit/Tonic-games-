import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  ExternalLink,
  Maximize2,
  Smartphone,
  Monitor,
  Gamepad2,
  HardDrive,
  Sparkles,
  Layers,
  Info,
  Tag,
  Star,
  User,
  Calendar,
  Share2,
  Check,
} from 'lucide-react';
import { Game, NetworkAd, SiteSettings, SponsorAd } from '../../types';
import { addRecentlyPlayed } from '../../utils/localStorage';
import { AdSlot } from '../AdSlot';

interface GamePlayPageProps {
  game: Game;
  allGames: Game[];
  sponsorAds?: SponsorAd[];
  networkAds?: NetworkAd[];
  settings: SiteSettings;
  onBack: () => void;
  onSelectGame: (game: Game) => void;
}

export const GamePlayPage: React.FC<GamePlayPageProps> = ({
  game,
  allGames = [],
  sponsorAds = [],
  networkAds = [],
  settings,
  onBack,
  onSelectGame,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (game) {
      addRecentlyPlayed(game);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [game]);

  if (!game) return null;

  const handleOpenExternalDirectly = () => {
    if (game.playUrl) {
      window.open(game.playUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('game-iframe-player');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Recommendations: exclude current game, prioritize same category
  const recommendations = allGames
    .filter((g) => g.id !== game.id && g.status === 'active')
    .sort((a, b) => {
      if (a.category === game.category && b.category !== game.category) return -1;
      if (a.category !== game.category && b.category === game.category) return 1;
      return 0;
    })
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in space-y-8">
      {/* Page Header Navigation & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to All Games</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Home</span>
            <span>/</span>
            <span className="text-purple-400 uppercase">{game.category}</span>
            <span>/</span>
            <span className="text-white truncate max-w-[200px]">{game.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Share Game Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-purple-400" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleOpenExternalDirectly}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Open Direct Game URL"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Direct Link</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Fullscreen Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GAME DETAILS TOP AD SLOT */}
      <AdSlot position="game_details_top" sponsorAds={sponsorAds} networkAds={networkAds} />

      {/* Main Dedicated iFrame Game Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1.5px] shrink-0">
              <div className="w-full h-full bg-[#0a0c14] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{game.title}</h1>
                <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/30">
                  v{game.version || '1.0.0'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                by <strong className="text-purple-300 font-semibold">{game.developer || 'Indie Game Studio'}</strong> • {game.category.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              {game.orientation === 'portrait' ? (
                <Smartphone className="w-4 h-4 text-pink-400" />
              ) : (
                <Monitor className="w-4 h-4 text-cyan-400" />
              )}
              <span className="capitalize">{game.orientation} orientation</span>
            </span>
            {game.weight && (
              <span className="flex items-center gap-1 font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>{game.weight}</span>
              </span>
            )}
          </div>
        </div>

        {/* Dedicated Game iFrame Screen */}
        <div
          id="game-iframe-player"
          className="relative w-full aspect-video min-h-[380px] sm:min-h-[540px] lg:min-h-[620px] bg-black rounded-3xl border border-white/15 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] group"
        >
          <iframe
            src={game.playUrl}
            title={game.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad"
            allowFullScreen
          />
        </div>
      </div>

      {/* Detailed Game Information Panel */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-5">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-2xl border border-white/15 shadow-xl shrink-0"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black text-white">{game.title}</h2>
                <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 text-slate-950 font-black text-[10px] uppercase font-mono tracking-wider">
                  v{game.version || '1.0.0'}
                </span>
                {game.weight && (
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-cyan-400" />
                    <span>{game.weight}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>Developer: {game.developer || 'Indie Studio'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <span className="uppercase">{game.category}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-pink-400" />
                  <span>Released: {game.releaseDate || '2026'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleOpenExternalDirectly}
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-pink-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Direct Link</span>
            </button>
          </div>
        </div>

        {/* Features Tags Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Key Game Features & Highlights</span>
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {game.features && game.features.length > 0 ? (
              game.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </span>
              ))
            ) : (
              <>
                <span className="px-3.5 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant HTML5 WebGL Playback</span>
                </span>
                <span className="px-3.5 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Touch & Keyboard Controls</span>
                </span>
                <span className="px-3.5 py-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-pink-400" />
                  <span>No Download Required</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Short & Long Description Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-fuchsia-400" />
            <span>About & Gameplay Details</span>
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed font-medium bg-black/40 p-4 rounded-2xl border border-white/5">
            {game.description}
          </p>

          {game.longDescription && (
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 bg-white/5 p-5 rounded-2xl border border-white/5">
              <h5 className="font-bold uppercase text-[11px] tracking-wide text-cyan-400">
                Detailed Gameplay Mechanics & Controls:
              </h5>
              <p className="whitespace-pre-line text-slate-300">{game.longDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR AD SLOT */}
      <AdSlot position="sidebar" sponsorAds={sponsorAds} networkAds={networkAds} />

      {/* GAME DETAILS BOTTOM AD SLOT */}
      <AdSlot position="game_details_bottom" sponsorAds={sponsorAds} networkAds={networkAds} />

      {/* Recommendations Related Games Section */}
      {recommendations.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>More Related Games</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Instant play on {settings.websiteName || 'GAMES TONIC'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onSelectGame(rec)}
                className="group relative cursor-pointer rounded-2xl bg-black/60 border border-white/10 p-2.5 hover:border-cyan-500/50 hover:bg-white/5 transition-all shadow-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900 mb-2 relative">
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                  {rec.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span className="uppercase text-purple-400">{rec.category}</span>
                  <span>v{rec.version || '1.0'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

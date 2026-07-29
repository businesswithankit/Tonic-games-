import React, { useEffect, useState, useMemo } from 'react';
import {
  ArrowLeft,
  Play,
  ExternalLink,
  Heart,
  Share2,
  Check,
  Star,
  Tag,
  User,
  Calendar,
  Layers,
  Info,
  Sparkles,
  Gamepad2,
  Clock,
  Smartphone,
  Monitor,
  CheckCircle,
  Eye,
  Flag,
  Globe,
  Mail,
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  RefreshCw,
  HelpCircle,
  Sliders,
  Maximize2,
  Minimize2,
  AlertTriangle,
} from 'lucide-react';
import { Game, NetworkAd, PageView, SiteSettings, SponsorAd } from '../../types';
import {
  addRecentlyPlayed,
  getRecentlyPlayed,
  isGameFavorite,
  toggleFavoriteGame,
} from '../../utils/localStorage';
import { incrementGameViews } from '../../firebase';
import { AdSlot } from '../AdSlot';
import { GameCard } from '../GameCard';
import { ReportModal } from '../ReportModal';

interface GamePlayPageProps {
  game: Game;
  allGames: Game[];
  sponsorAds?: SponsorAd[];
  networkAds?: NetworkAd[];
  settings: SiteSettings;
  onBack: () => void;
  onSelectGame: (game: Game) => void;
  onNavigate: (page: PageView) => void;
}

export const GamePlayPage: React.FC<GamePlayPageProps> = ({
  game,
  allGames = [],
  sponsorAds = [],
  networkAds = [],
  settings,
  onBack,
  onSelectGame,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [viewsCount, setViewsCount] = useState<number>(game?.views || 100);
  const [recentlyPlayedList, setRecentlyPlayedList] = useState(getRecentlyPlayed());

  // In-Site Embedded Player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [embedError, setEmbedError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const playerContainerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (game) {
      addRecentlyPlayed(game);
      setIsFav(isGameFavorite(game.id));
      setRecentlyPlayedList(getRecentlyPlayed());
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset player states when active game changes
      setIsPlaying(false);
      setIsLoading(false);
      setLoadingPercent(0);
      setEmbedError(false);
      setIsFullscreen(false);

      // Automatically increment views count
      incrementGameViews(game.id).then((updatedViews) => {
        if (updatedViews) setViewsCount(updatedViews);
      });
    }
  }, [game]);

  // Handle Play Now click - start loading embedded player in-site
  const handleStartPlay = () => {
    setIsPlaying(true);
    setIsLoading(true);
    setLoadingPercent(15);
    setEmbedError(false);

    // Simulated progress tick until frame triggers onLoad
    const interval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 15 + 10);
      });
    }, 200);
  };

  const handleFrameLoad = () => {
    setLoadingPercent(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleRefreshGame = () => {
    setIframeKey((prev) => prev + 1);
    setIsLoading(true);
    setLoadingPercent(20);
    setEmbedError(false);
  };

  const handleToggleFullscreen = async () => {
    if (!playerContainerRef.current) return;
    const elem = playerContainerRef.current as any;
    const isFullNow = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      isFullscreen
    );

    if (isFullNow) {
      if (document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (err) {
        // Fallback to overlay fullscreen if native API fails
        setIsFullscreen(true);
      }
    }
  };

  // Rating value (default 4.8 if not specified)
  const ratingValue = game?.rating ? game.rating.toFixed(1) : '4.8';

  // Game size check (only display if available and not empty/NA)
  const rawSize = game?.size || game?.weight;
  const gameSizeAvailable = Boolean(
    rawSize && rawSize.trim() !== '' && rawSize.toLowerCase() !== 'n/a'
  );

  // Tags list
  const tagsList = useMemo(() => {
    if (game?.tags && game.tags.length > 0) return game.tags;
    return [
      game?.category || 'Arcade',
      game?.orientation === 'portrait' ? 'Mobile Friendly' : 'Desktop Optimized',
      'Free HTML5',
      game?.developer || 'Indie Game',
      'Instant Play',
      'Browser Game',
    ];
  }, [game]);

  // 9. Related Games (Same category, at least 8 games)
  const relatedGames = useMemo(() => {
    if (!game) return [];
    const sameCategoryGames = allGames.filter(
      (g) =>
        g.id !== game.id &&
        g.status === 'active' &&
        g.category.toLowerCase() === game.category.toLowerCase()
    );

    // Ensure at least 8 related games are shown by supplementing with other active games if needed
    if (sameCategoryGames.length >= 8) {
      return sameCategoryGames.slice(0, 12);
    } else {
      const extraGames = allGames.filter(
        (g) =>
          g.id !== game.id &&
          g.status === 'active' &&
          g.category.toLowerCase() !== game.category.toLowerCase()
      );
      return [...sameCategoryGames, ...extraGames].slice(0, 12);
    }
  }, [allGames, game]);

  // 13. More Games ("You May Also Like" - Random games selection)
  const randomMoreGames = useMemo(() => {
    if (!game) return [];
    const relatedIds = new Set(relatedGames.map((r) => r.id));
    const available = allGames.filter(
      (g) => g.id !== game.id && g.status === 'active' && !relatedIds.has(g.id)
    );
    // Shuffle deterministic sample or fallback
    return [...available].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [allGames, game, relatedGames]);

  if (!game) return null;

  const handlePlayNow = () => {
    if (game.playUrl) {
      window.open(game.playUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleFavorite = () => {
    const newState = toggleFavoriteGame(game.id);
    setIsFav(newState);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${game.title} - ${settings.websiteName || 'TONIC GAMES'}`,
          text: `Play ${game.title} online for free!`,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Home</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span
            onClick={onBack}
            className="hover:text-cyan-400 cursor-pointer transition-colors"
          >
            Home
          </span>
          <span>/</span>
          <span className="text-purple-400 uppercase">{game.category}</span>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{game.title}</span>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        game={game}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* -------------------------------------------------------------
          SECTION 1: HERO & IN-SITE GAME PLAYER CONTAINER
      ------------------------------------------------------------- */}
      <section className="glass-card p-4 sm:p-6 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-5">
        {/* Game Title & Meta Bar Above Player */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-[10px] uppercase tracking-wider">
                {game.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                v{game.version || '1.0.0'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] uppercase">
                HTML5 Instant Play
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {game.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                {game.developer || 'Indie Game Studio'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {ratingValue} / 5.0
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                {viewsCount.toLocaleString()} Views
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {game.releaseDate || '2026'}
              </span>
            </div>
          </div>

          {/* Quick Toolbar for Player controls when playing */}
          {isPlaying && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleRefreshGame}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Restart Game"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>

              <a
                href={game.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Open directly in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
                <span className="hidden sm:inline">New Tab</span>
              </a>
            </div>
          )}
        </div>

        {/* Player Box Container */}
        <div
          ref={playerContainerRef}
          className={`relative w-full transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-[99999] w-screen h-screen bg-black rounded-none border-0 p-0 m-0 overflow-hidden flex flex-col justify-between'
              : 'rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.25)]'
          }`}
        >
          {isFullscreen && (
            <div className="absolute top-3 right-3 z-[60] flex items-center gap-2 bg-black/85 backdrop-blur-md p-1.5 px-3 rounded-2xl border border-white/20 shadow-2xl animate-fade-in">
              <span className="text-xs font-bold text-white px-2 truncate max-w-[140px] sm:max-w-xs">
                {game.title}
              </span>
              <button
                onClick={handleRefreshGame}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Refresh Game"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleToggleFullscreen}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Exit Fullscreen"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          )}

          {!isPlaying ? (
            /* --- STATE 1: COVER THUMBNAIL WITH CENTERED PLAY BUTTON --- */
            <div className="relative w-full aspect-[16/9] min-h-[260px] sm:min-h-[440px] group flex items-center justify-center">
              <img
                src={
                  game.thumbnail ||
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
                }
                alt={game.title}
                loading="eager"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Cover Badges */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  <span>Ready to Play</span>
                </span>
              </div>

              {/* CENTERED POKI-STYLE PLAY BUTTON OVER COVER */}
              <div className="absolute z-20 flex flex-col items-center justify-center p-4 text-center">
                <button
                  onClick={handleStartPlay}
                  className="group/play flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
                  aria-label="Play now"
                >
                  {/* Glassy Translucent Circular Button */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-white/50 shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(0,156,255,0.6)] flex items-center justify-center transition-all duration-300 group-hover/play:rotate-3">
                    <Play className="w-9 h-9 sm:w-13 sm:h-13 fill-[#0092ff] text-[#0092ff] ml-1.5 transition-transform duration-300 group-hover/play:scale-110" />
                  </div>

                  {/* "Play now" Label Below Circle */}
                  <span className="mt-3 sm:mt-4 font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] transition-colors duration-200 group-hover/play:text-cyan-300">
                    Play now
                  </span>
                </button>
              </div>

              {/* Bottom Cover Info */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-2 z-10 text-xs font-bold text-slate-300">
                <span className="text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Orientation: {game.orientation || 'Landscape'}
                </span>
              </div>
            </div>
          ) : (
            /* --- STATE 2: EMBEDDED IFRAME PLAYER IN-SITE --- */
            <div
              className={`relative bg-black transition-all ${
                isFullscreen
                  ? 'w-full h-full flex-1 aspect-auto max-w-none min-h-0'
                  : game.orientation === 'portrait'
                  ? 'w-full aspect-[3/4] max-w-md mx-auto min-h-[500px]'
                  : 'w-full aspect-[16/9] min-h-[350px] sm:min-h-[520px] lg:min-h-[600px]'
              }`}
            >
              {/* Loading Overlay with progress percentage */}
              {isLoading && (
                <div className="absolute inset-0 z-30 bg-[#080910] flex flex-col items-center justify-center p-6 space-y-4 text-center animate-fade-in">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-cyan-400 animate-spin" />
                    <Gamepad2 className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-white tracking-wide">
                      Loading Game Assets...
                    </h3>
                    <p className="text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      {loadingPercent}%
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${loadingPercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 font-medium max-w-sm">
                    Connecting to secure HTML5 frame player for {game.title}...
                  </p>
                </div>
              )}

              {/* Embedded Game Iframe */}
              <iframe
                key={iframeKey}
                src={game.playUrl}
                title={game.title}
                className="w-full h-full border-0 bg-black shadow-inner"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; execution-while-out-of-viewport; execution-while-not-rendered; web-share; fullscreen"
                allowFullScreen
                onLoad={handleFrameLoad}
                onError={() => {
                  setEmbedError(true);
                  setIsLoading(false);
                }}
              />

              {/* Fallback Error Overlay if Embedding is blocked */}
              {embedError && (
                <div className="absolute inset-0 z-40 bg-[#0c0d18] flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="text-lg font-bold text-white">External Embedding Blocked</h3>
                    <p className="text-xs text-slate-300">
                      The game provider restricts embedding this title directly inside an iframe. You can open it in a clean external tab to play.
                    </p>
                  </div>
                  <a
                    href={game.playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
                  >
                    <span>Open Game in New Tab</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Player Controls Bar below box */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified HTTPS Safe • Zero Downloads • Free HTML5 Gameplay</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isFav
                  ? 'bg-pink-500/20 border-pink-500/60 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isFav ? 'fill-pink-400 text-pink-400' : 'text-slate-300'}`}
              />
              <span>{isFav ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/15 hover:border-red-500/40 text-slate-200 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Flag className="w-4 h-4 text-red-400" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 2: SPONSOR ADVERTISEMENT (Below Hero)
      ------------------------------------------------------------- */}
      <section className="w-full">
        <AdSlot
          position="below_hero"
          sponsorAds={sponsorAds}
          networkAds={networkAds}
        />
        <AdSlot
          position="game_details_top"
          sponsorAds={sponsorAds}
          networkAds={networkAds}
        />
      </section>

      {/* -------------------------------------------------------------
          SECTION 3: BASIC INFORMATION CARD
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Basic Information</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm">
          {/* Game Name */}
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              🎮 Game Name
            </span>
            <span className="text-white font-bold truncate block">{game.title}</span>
          </div>

          {/* Developer Name */}
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              👨‍💻 Developer Name
            </span>
            <span className="text-cyan-300 font-semibold truncate block">
              {game.developer || 'Indie Game Studio'}
            </span>
          </div>

          {/* Category */}
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              📂 Category
            </span>
            <span className="text-purple-300 font-bold uppercase truncate block">
              {game.category}
            </span>
          </div>

          {/* Version */}
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              🔢 Version
            </span>
            <span className="text-pink-300 font-mono font-bold block">
              v{game.version || '1.0.0'}
            </span>
          </div>

          {/* Release Date */}
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              📅 Release Date
            </span>
            <span className="text-slate-200 font-semibold block">
              {game.releaseDate || '2026'}
            </span>
          </div>

          {/* Last Updated */}
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              🔄 Last Updated
            </span>
            <span className="text-emerald-300 font-semibold block">
              {game.updatedTime
                ? new Date(game.updatedTime).toLocaleDateString()
                : 'Recently'}
            </span>
          </div>

          {/* Game Size - HIDDEN AUTOMATICALLY IF EMPTY */}
          {gameSizeAvailable && (
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                📦 Game Size
              </span>
              <span className="text-amber-300 font-mono font-bold block">{rawSize}</span>
            </div>
          )}

          {/* Tags preview */}
          <div className="col-span-2 sm:col-span-4 pt-2 border-t border-white/10">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
              🏷️ Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tagsList.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold capitalize"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 4: SHORT DESCRIPTION (2-5 lines summary)
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <span>Short Summary</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-black/40 p-4 rounded-2xl border border-white/5">
          {game.description}
        </p>
      </section>

      {/* -------------------------------------------------------------
          SECTION 5: FULL GAMEPLAY DESCRIPTION
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-fuchsia-400" />
          <span>Full Gameplay Description</span>
        </h2>

        <div className="p-4 sm:p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {game.longDescription ? (
            <p className="whitespace-pre-line text-slate-200">{game.longDescription}</p>
          ) : (
            <div className="space-y-3 text-slate-300">
              <h3 className="text-sm font-bold text-cyan-300">About {game.title}</h3>
              <p>
                Experience {game.title}, a high-octane HTML5 game designed for instant browser play with no downloads required. Challenge yourself across levels, master tight controls, and compete for high scores directly on your desktop or mobile device.
              </p>
              <h3 className="text-sm font-bold text-purple-300">Core Features & Objectives</h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                <li>Responsive layout for both desktop keyboard and mobile touch screens.</li>
                <li>Smooth WebGL rendering with zero latency.</li>
                <li>Progressive difficulty curves and continuous score tracking.</li>
              </ul>
            </div>
          )}

          {/* Features list if present */}
          {game.features && game.features.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Key Gameplay Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {game.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200"
                  >
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 6: CONTROLS
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-400" />
          <span>Game Controls</span>
        </h2>

        {game.controls ? (
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-200 whitespace-pre-line">
            {game.controls}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Desktop Controls */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Monitor className="w-5 h-5" />
                <span>Desktop Controls</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                  <span>Movement / Steering</span>
                  <span className="font-mono text-cyan-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                    WASD / Arrow Keys
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                  <span>Action / Primary Attack</span>
                  <span className="font-mono text-cyan-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                    Mouse Click / Spacebar
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                  <span>Pause / Menu</span>
                  <span className="font-mono text-cyan-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                    ESC Key
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                <Smartphone className="w-5 h-5" />
                <span>Mobile Controls</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                  <span>Touch Control</span>
                  <span className="font-mono text-pink-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                    Virtual Buttons / D-Pad
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                  <span>Swipe Gesture</span>
                  <span className="font-mono text-pink-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                    Directional Swipe
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                  <span>Screen Tap</span>
                  <span className="font-mono text-pink-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                    Tap to Jump / Shoot
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* -------------------------------------------------------------
          SECTION 7: COMPATIBILITY
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Platform Compatibility</span>
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Android Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Android Compatible</span>
          </div>

          {/* Desktop Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Desktop Compatible</span>
          </div>

          {/* Landscape / Portrait Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="capitalize">{game.orientation || 'Landscape'} Mode</span>
          </div>

          {/* Browser Support Badge */}
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Browser Support (HTML5 / WebGL)</span>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 8: STATISTICS
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <span>Game Statistics</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Total Views */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Total Views</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">
              {viewsCount.toLocaleString()}
            </p>
            <p className="text-[10px] text-cyan-400">Recorded Live</p>
          </div>

          {/* Rating Score */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>User Rating</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
              {ratingValue} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </p>
            <p className="text-[10px] text-amber-400">High Player Satisfaction</p>
          </div>

          {/* Performance Status */}
          <div className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Performance</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-purple-300">
              60 FPS WebGL
            </p>
            <p className="text-[10px] text-purple-400">Instant Load Supported</p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 9: RELATED GAMES (At least 8 games)
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wide">
              Related Games ({game.category})
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {relatedGames.length} Games
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {relatedGames.map((relGame) => (
            <GameCard key={relGame.id} game={relGame} onPlayGame={onSelectGame} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 10: REPORT SECTION
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-950/20 via-[#0c0d18] to-purple-950/20 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
            <Flag className="w-5 h-5 text-red-400" />
            <span>Found a problem with this game?</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Let us know if you encounter broken links, loading errors, missing assets, or inappropriate content.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 transition-all shrink-0 cursor-pointer"
        >
          <Flag className="w-4 h-4 fill-white" />
          <span>🚩 Report Game</span>
        </button>
      </section>

      {/* -------------------------------------------------------------
          SECTION 11: DEVELOPER CREDITS
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" />
          <span>Developer Credits</span>
        </h2>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Creator / Developer</p>
              <h3 className="text-base font-bold text-white">
                {game.developer || 'Indie Game Studio'}
              </h3>
            </div>
          </div>

          {/* Optional Developer Website - AUTO HIDE IF EMPTY */}
          {game.developerWebsite && (
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-cyan-300">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <a
                href={game.developerWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                {game.developerWebsite}
              </a>
            </div>
          )}

          {/* Optional Developer Email - AUTO HIDE IF EMPTY */}
          {game.developerEmail && (
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-pink-400 shrink-0" />
              <a href={`mailto:${game.developerEmail}`} className="hover:underline truncate">
                {game.developerEmail}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 12: LEGAL INFORMATION
      ------------------------------------------------------------- */}
      <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <span>Legal & Policy Links</span>
        </h2>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 {settings.websiteName || 'TONIC GAMES'}. All game titles, assets, and trademarks belong to their respective copyright holders.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
            <button
              onClick={() => onNavigate('terms')}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 text-cyan-300 hover:text-cyan-200 border border-white/5 flex items-center gap-2 text-left transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Terms & Conditions</span>
            </button>

            <button
              onClick={() => onNavigate('privacy')}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 text-cyan-300 hover:text-cyan-200 border border-white/5 flex items-center gap-2 text-left transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Privacy Policy</span>
            </button>

            <button
              onClick={() => onNavigate('dmca')}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 text-purple-300 hover:text-purple-200 border border-white/5 flex items-center gap-2 text-left transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">DMCA Policy</span>
            </button>

            <button
              onClick={() => onNavigate('copyright-removal')}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 text-red-300 hover:text-red-200 border border-white/5 flex items-center gap-2 text-left transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Copyright Removal</span>
            </button>

            <button
              onClick={() => onNavigate('submission-policy')}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 text-pink-300 hover:text-pink-200 border border-white/5 flex items-center gap-2 text-left transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Submission Policy</span>
            </button>

            <button
              onClick={() => onNavigate('community-guidelines')}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 text-emerald-300 hover:text-emerald-200 border border-white/5 flex items-center gap-2 text-left transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Community Guidelines</span>
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          SECTION 13: MORE GAMES ("You May Also Like")
      ------------------------------------------------------------- */}
      {randomMoreGames.length > 0 && (
        <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wide">
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {randomMoreGames.map((moreGame) => (
              <GameCard key={moreGame.id} game={moreGame} onPlayGame={onSelectGame} />
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------
          SECTION 14: FOOTER SPONSOR BANNER
      ------------------------------------------------------------- */}
      <section className="w-full pt-4">
        <AdSlot
          position="game_details_bottom"
          sponsorAds={sponsorAds}
          networkAds={networkAds}
        />
        <AdSlot
          position="footer"
          sponsorAds={sponsorAds}
          networkAds={networkAds}
        />
      </section>
    </div>
  );
};

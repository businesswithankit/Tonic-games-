import React, { useEffect, useState } from 'react';
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
  HelpCircle,
  Sliders,
  Clock,
  Smartphone,
  Star as StarIcon,
} from 'lucide-react';
import { Game, NetworkAd, SiteSettings, SponsorAd } from '../../types';
import {
  addRecentlyPlayed,
  getRecentlyPlayed,
  isGameFavorite,
  toggleFavoriteGame,
} from '../../utils/localStorage';
import { AdSlot } from '../AdSlot';
import { GameCard } from '../GameCard';

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
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [recentlyPlayedList, setRecentlyPlayedList] = useState(getRecentlyPlayed());

  useEffect(() => {
    if (game) {
      addRecentlyPlayed(game);
      setIsFav(isGameFavorite(game.id));
      setRecentlyPlayedList(getRecentlyPlayed());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [game]);

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
        // Fallback to copy
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 11. Continue Playing games (recently played excluding current game)
  const continuePlayingGames = recentlyPlayedList.filter((item) => item.id !== game.id);

  // 12. Related Games (Same category)
  const relatedGames = allGames
    .filter(
      (g) =>
        g.id !== game.id &&
        g.status === 'active' &&
        g.category.toLowerCase() === game.category.toLowerCase()
    )
    .slice(0, 6);

  // 18. Similar Games (Other active games)
  const similarGames = allGames
    .filter(
      (g) =>
        g.id !== game.id &&
        g.status === 'active' &&
        !relatedGames.some((r) => r.id === g.id)
    )
    .slice(0, 6);

  // Rating
  const ratingValue = game.rating || 4.8;

  // Tags list
  const tagsList =
    game.tags && game.tags.length > 0
      ? game.tags
      : [
          game.category,
          game.orientation === 'portrait' ? 'Mobile Friendly' : 'Desktop Optimized',
          'Free HTML5',
          game.developer || 'Indie Game',
          'Browser Game',
          'Instant Play',
        ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
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

      {/* Main Game Details Panel */}
      <div className="glass-card p-4 sm:p-8 rounded-3xl border border-white/10 space-y-8 bg-[#0c0d18]/90 backdrop-blur-xl shadow-2xl">
        {/* 1. Large Game Thumbnail */}
        <div className="relative w-full aspect-[21/9] min-h-[220px] sm:min-h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-[0_0_40px_rgba(6,182,212,0.15)] group">
          <img
            src={
              game.thumbnail ||
              'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
            }
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-black/40 to-transparent" />

          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/80 backdrop-blur-md text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
              {game.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/80 backdrop-blur-md text-white font-mono text-xs font-bold shadow-lg">
              v{game.version || '1.0.0'}
            </span>
          </div>
        </div>

        {/* 2. Game Title */}
        <div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {game.title}
          </h1>
        </div>

        {/* 3, 4, 5, 6, 7. Category, Version, Developer, Release Date, Rating */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Category
            </span>
            <span className="text-cyan-300 font-bold uppercase flex items-center gap-1 truncate">
              <Tag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {game.category}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Version
            </span>
            <span className="text-purple-300 font-mono font-bold">
              v{game.version || '1.0.0'}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Developer
            </span>
            <span className="text-slate-200 font-semibold truncate flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {game.developer || 'Indie Game Studio'}
            </span>
          </div>

          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Release Date
            </span>
            <span className="text-slate-200 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              {game.releaseDate || '2026'}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
              Rating
            </span>
            <span className="text-amber-300 font-black flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span>{ratingValue} / 5.0</span>
            </span>
          </div>
        </div>

        {/* 8, 9, 10. Play Now Button, Favorite Button, Share Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* 8. Play Now Button */}
          <button
            onClick={handlePlayNow}
            className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            <span>PLAY NOW</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </button>

          {/* 9. Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`px-6 py-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isFav
                ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isFav ? 'fill-pink-400 text-pink-400' : 'text-slate-300'}`}
            />
            <span>{isFav ? 'Favorited' : 'Favorite'}</span>
          </button>

          {/* 10. Share Button */}
          <button
            onClick={handleShare}
            className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5 text-purple-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* 11. Continue Playing (if available) */}
        {continuePlayingGames.length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Continue Playing
              </h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {continuePlayingGames.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const found = allGames.find((g) => g.id === item.id);
                    if (found) onSelectGame(found);
                  }}
                  className="shrink-0 w-36 sm:w-44 group cursor-pointer p-2 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/40 transition-all"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full aspect-[4/3] object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                  />
                  <p className="text-xs font-bold text-white truncate">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. Related Games */}
        {relatedGames.length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Related Games ({game.category})
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3.5">
              {relatedGames.map((relGame) => (
                <GameCard key={relGame.id} game={relGame} onPlayGame={onSelectGame} />
              ))}
            </div>
          </div>
        )}

        {/* 13. Game Description */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-fuchsia-400" />
            <span>Game Description</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-black/40 p-4 rounded-2xl border border-white/5">
            {game.description}
          </p>
          {game.longDescription && (
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-2xl border border-white/5">
              {game.longDescription}
            </p>
          )}
        </div>

        {/* 14. Game Features */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Game Features</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {game.features && game.features.length > 0 ? (
              game.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </span>
              ))
            ) : (
              <>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant HTML5 WebGL Playback</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Touch & Keyboard Responsive</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold flex items-center gap-1.5">
                  <StarIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Zero Downloads Needed</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* 15. How to Play */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>How to Play</span>
          </h3>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-300 space-y-2">
            {game.howToPlay ? (
              <p className="whitespace-pre-line">{game.howToPlay}</p>
            ) : (
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                <li>
                  Click the <strong>PLAY NOW</strong> button above to launch the game.
                </li>
                <li>Follow the on-screen instructions or tutorial levels to get started.</li>
                <li>Complete challenges and beat high scores to master the game!</li>
              </ol>
            )}
          </div>
        </div>

        {/* 16. Controls */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Controls</span>
          </h3>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-300 space-y-2">
            {game.controls ? (
              <p className="whitespace-pre-line">{game.controls}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-bold text-cyan-400 block mb-1">Desktop Controls</span>
                  <p className="text-slate-300 text-xs">
                    WASD / Arrow Keys to move, Mouse Click to interact or shoot.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-bold text-pink-400 block mb-1">Mobile Controls</span>
                  <p className="text-slate-300 text-xs">
                    Touch and drag on screen buttons or virtual joystick.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-bold text-purple-400 block mb-1">Pause / Settings</span>
                  <p className="text-slate-300 text-xs">
                    Press ESC or click the in-game settings gear icon to pause.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 17. Tags */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>Tags</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {tagsList.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold capitalize transition-all"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 18. Similar Games */}
        {similarGames.length > 0 && (
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                <span>Similar Games You Might Like</span>
              </h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3.5">
              {similarGames.map((simGame) => (
                <GameCard key={simGame.id} game={simGame} onPlayGame={onSelectGame} />
              ))}
            </div>
          </div>
        )}

        {/* 19. Sponsor Banner */}
        <div className="pt-6 border-t border-white/10">
          <AdSlot position="game_details_bottom" sponsorAds={sponsorAds} networkAds={networkAds} />
        </div>
      </div>
    </div>
  );
};

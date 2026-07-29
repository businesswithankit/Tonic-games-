import React from 'react';
import { Play, Flame, Sparkles, Clock } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onPlayGame: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlayGame }) => {
  // Determine small badge if enabled
  let badgeLabel = '';
  let badgeStyle = '';
  let badgeIcon = null;

  if (game.trending) {
    badgeLabel = 'HOT';
    badgeStyle = 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    badgeIcon = <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-slate-950" />;
  } else if (game.featured) {
    badgeLabel = 'FEATURED';
    badgeStyle = 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
    badgeIcon = <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-slate-950" />;
  } else if (game.recentlyAdded) {
    badgeLabel = 'NEW';
    badgeStyle = 'bg-fuchsia-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]';
    badgeIcon = <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />;
  }

  return (
    <div
      onClick={() => onPlayGame(game)}
      className="group relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl bg-[#0c0d16]/90 border border-white/10 p-1.5 sm:p-2 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:-translate-y-1"
    >
      {/* Game Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:rounded-xl bg-[#050508]">
        <img
          src={
            game.thumbnail ||
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
          }
          alt={game.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Small Badge */}
        {badgeLabel && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <span
              className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${badgeStyle}`}
            >
              {badgeIcon}
              <span>{badgeLabel}</span>
            </span>
          </div>
        )}

        {/* Play Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[1px]">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/85 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-[#0092ff] text-[#0092ff] ml-0.5" />
          </div>
        </div>
      </div>

      {/* Game Title */}
      <div className="pt-2 px-1 pb-1">
        <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-cyan-300 transition-colors tracking-tight">
          {game.title}
        </h3>
      </div>
    </div>
  );
};


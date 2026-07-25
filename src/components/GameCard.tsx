import React from 'react';
import { Play, Flame, Sparkles, Smartphone, Monitor, HardDrive } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onPlayGame: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlayGame }) => {
  return (
    <div
      onClick={() => onPlayGame(game)}
      className="group relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0d0d14]/80 border border-white/10 p-3 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:-translate-y-1.5"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#050508]">
        <img
          src={game.thumbnail || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'}
          alt={game.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges Top Left & Right */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {game.trending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
              <Flame className="w-3 h-3 fill-slate-950" />
              HOT
            </span>
          )}
          {game.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              FEATURED
            </span>
          )}
        </div>

        {/* Orientation Badge Top Right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase backdrop-blur-md border ${
              game.orientation === 'portrait'
                ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300'
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
            }`}
            title={`Optimized for ${game.orientation} orientation`}
          >
            {game.orientation === 'portrait' ? (
              <Smartphone className="w-3 h-3" />
            ) : (
              <Monitor className="w-3 h-3" />
            )}
            {game.orientation}
          </span>
        </div>

        {/* Play Overlay Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 p-[2px] shadow-[0_0_25px_rgba(34,211,238,0.6)] scale-90 group-hover:scale-100 transition-transform duration-300">
            <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center text-white">
              <Play className="w-6 h-6 fill-white ml-1 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Game Details */}
      <div className="pt-3 px-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase truncate">
            {game.category}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">v{game.version || '1.0'}</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
          {game.title}
        </h3>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {/* Card Footer Info */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate max-w-[130px]">{game.developer || 'Indie Studio'}</span>
          {game.weight ? (
            <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
              <HardDrive className="w-3 h-3 text-cyan-400" />
              <span>{game.weight}</span>
            </div>
          ) : (
            <span className="text-[10px] text-cyan-400 font-bold uppercase">HTML5</span>
          )}
        </div>
      </div>
    </div>
  );
};

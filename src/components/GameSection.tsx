import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Game } from '../types';
import { GameCard } from './GameCard';

interface GameSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badgeText?: string;
  badgeColor?: 'purple' | 'amber' | 'cyan' | 'pink';
  games: Game[];
  onPlayGame: (game: Game) => void;
  emptyMessage?: string;
}

export const GameSection: React.FC<GameSectionProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = 'purple',
  games,
  onPlayGame,
  emptyMessage = 'No games available in this section.',
}) => {
  const badgeColors = {
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    pink: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
  };

  return (
    <section id={id} className="w-full my-10 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          {badgeText && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-2 ${badgeColors[badgeColor]}`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{badgeText}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            {!badgeText && Icon && <Icon className="w-6 h-6 text-cyan-400" />}
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>

        <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          {games.length} {games.length === 1 ? 'Game' : 'Games'}
        </span>
      </div>

      {/* Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3.5 lg:gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} onPlayGame={onPlayGame} />
          ))}
        </div>
      ) : (
        <div className="w-full py-12 px-6 rounded-2xl bg-[#0d0e16] border border-white/5 text-center">
          <p className="text-slate-400 text-sm font-medium">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
};

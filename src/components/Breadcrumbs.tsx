import React from 'react';
import { ChevronRight, Home, Gamepad2 } from 'lucide-react';

interface BreadcrumbsProps {
  category: string;
  gameTitle: string;
  onNavigate: (page: string, extra?: string | null) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  category,
  gameTitle,
  onNavigate,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center flex-wrap gap-1.5 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-slate-400 select-none max-w-max mb-6"
    >
      {/* Home link */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

      {/* Games link */}
      <button
        onClick={() => onNavigate('games')}
        className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <Gamepad2 className="w-3.5 h-3.5" />
        <span>Games</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

      {/* Category link */}
      <button
        onClick={() => onNavigate('category', category.toLowerCase())}
        className="hover:text-fuchsia-400 capitalize transition-colors cursor-pointer"
      >
        {category}
      </button>

      <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />

      {/* Game title text (active) */}
      <span className="text-white font-bold truncate max-w-[120px] sm:max-w-[200px]">
        {gameTitle}
      </span>
    </nav>
  );
};

import React from 'react';
import {
  Swords,
  Car,
  Gamepad2,
  Brain,
  Compass,
  Trophy,
  Sparkles,
  Zap,
  Target,
  LucideIcon,
} from 'lucide-react';
import { Category, Game } from '../types';

interface CategoryGridProps {
  categories: Category[];
  games: Game[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Swords,
  Car,
  Gamepad2,
  Brain,
  Compass,
  Trophy,
  Sparkles,
  Zap,
  Target,
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  games,
  selectedCategory,
  onSelectCategory,
}) => {
  const visibleCategories = categories.filter((c) => !c.hidden);

  return (
    <div id="categories-section" className="w-full my-12 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>GAME DISCOVERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Explore Game Categories
          </h2>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all"
          >
            Clear Filter (Show All Games)
          </button>
        )}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {visibleCategories.map((cat) => {
          const IconComp = iconMap[cat.icon] || Gamepad2;
          const gameCount = games.filter(
            (g) => g.category.toLowerCase() === cat.slug.toLowerCase() && g.status === 'active'
          ).length;
          const isSelected = selectedCategory === cat.slug;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between border ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-900/60 to-cyan-900/60 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105'
                  : 'bg-[#10121d]/80 border-white/10 hover:border-purple-500/40 hover:bg-[#181a2b] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]'
              }`}
            >
              {/* Category Background Image Overlay */}
              {cat.image && (
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-35 transition-opacity">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="relative z-10 flex flex-col items-start gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-white/5 border-white/10 text-cyan-400 group-hover:bg-purple-500/20 group-hover:text-purple-300'
                  } transition-all`}
                >
                  <IconComp className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {gameCount} {gameCount === 1 ? 'Game' : 'Games'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, X, Trash2, Gamepad2, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { Category, Game } from '../types';
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from '../utils/localStorage';

interface SearchModalProps {
  games: Game[];
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (game: Game) => void;
  selectedCategory: string | null;
  onSelectCategory: (categorySlug: string | null) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  games,
  categories,
  isOpen,
  onClose,
  onSelectGame,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategory || 'all');

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const updated = addRecentSearch(searchQuery.trim());
      setRecentSearches(updated);
    }
  };

  const handleTagClick = (query: string) => {
    setSearchQuery(query);
    const updated = addRecentSearch(query);
    setRecentSearches(updated);
  };

  const handleClearSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Filter games based on search query & category filter
  const filteredGames = games.filter((game) => {
    if (game.status !== 'active') return false;

    const matchesQuery =
      !searchQuery.trim() ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || game.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0b0d16] border border-white/15 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Bar Input Header */}
        <form onSubmit={handleSearchSubmit} className="p-4 bg-[#0f111e] border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, genres, developers..."
            autoFocus
            className="w-full bg-transparent text-white text-base font-semibold placeholder:text-slate-500 focus:outline-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Filters & Tags */}
        <div className="p-4 bg-[#090a12] border-b border-white/5 space-y-3">
          {/* Category Dropdown & Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              <span>Category Filter:</span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  onSelectCategory(e.target.value === 'all' ? null : e.target.value);
                }}
                className="bg-white/5 border border-white/10 text-cyan-300 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="all" className="bg-[#0b0d16] text-white">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-[#0b0d16] text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {recentSearches.length > 0 && (
              <button
                onClick={handleClearSearches}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {/* Recent Searches History Tags */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 mr-1">Recent:</span>
              {recentSearches.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 text-slate-300 hover:text-purple-300 text-xs font-medium transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => {
                    if (searchQuery.trim()) {
                      addRecentSearch(searchQuery.trim());
                    }
                    onSelectGame(game);
                    onClose();
                  }}
                  className="group flex items-center gap-3 p-2.5 rounded-2xl bg-[#10121d] border border-white/5 hover:border-cyan-500/50 hover:bg-[#16192a] cursor-pointer transition-all"
                >
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      {game.category}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {game.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{game.developer}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">No games match your search query.</p>
              <p className="text-xs text-slate-500">Try searching for alternative keywords or categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

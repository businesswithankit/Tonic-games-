import React from 'react';
import { Sparkles, Calendar, HardDrive, ExternalLink, Tag, Clock, ArrowRight } from 'lucide-react';
import { UpcomingGame } from '../types';

interface UpcomingGamesSectionProps {
  upcomingGames: UpcomingGame[];
}

export const UpcomingGamesSection: React.FC<UpcomingGamesSectionProps> = ({ upcomingGames }) => {
  const activeUpcoming = upcomingGames.filter((g) => g.status === 'active');

  if (activeUpcoming.length === 0) return null;

  return (
    <section className="space-y-6 animate-fade-in my-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>COMING SOON</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Upcoming Releases & Exclusives</span>
          </h2>
          <p className="text-xs text-slate-400">
            Preview upcoming web games currently in development. Pre-register or watch official trailers!
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span className="text-cyan-400 font-bold">{activeUpcoming.length}</span> Upcoming Titles Announced
        </div>
      </div>

      {/* Grid of Upcoming Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {activeUpcoming.map((game) => (
          <div
            key={game.id}
            className="glass-card rounded-3xl border border-white/10 hover:border-pink-500/40 p-5 flex flex-col justify-between space-y-4 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all group relative overflow-hidden"
          >
            {/* Ambient Background Blur */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/20 transition-all" />

            <div className="space-y-4 relative z-10">
              {/* Thumbnail & Badges */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-pink-500/50 text-pink-300 font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <Calendar className="w-3 h-3 text-pink-400" />
                    <span>{game.expectedReleaseDate || 'COMING SOON'}</span>
                  </span>

                  {game.weight && (
                    <span className="px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-cyan-400" />
                      <span>{game.weight}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white group-hover:text-pink-300 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {game.description}
                </p>
              </div>

              {/* Features List */}
              {game.features && game.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Planned Highlights</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {game.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-[11px] font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
              <span className="text-[11px] text-slate-400 font-mono">
                Development In Progress
              </span>

              {game.link ? (
                <a
                  href={game.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all shadow-md shadow-pink-500/20 cursor-pointer"
                >
                  <span>Pre-Register / Trailer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold font-mono">
                  Wishlist Soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

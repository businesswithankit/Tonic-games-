import React from 'react';
import { Gamepad2, Home, Flame, Sparkles, HelpCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: string, extra?: string | null) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center relative z-10 animate-fade-in">
      {/* 404 Indicator & Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-fuchsia-500 to-purple-600 p-[2px] shadow-[0_0_30px_rgba(217,70,239,0.3)] mx-auto relative">
          <div className="w-full h-full bg-[#050505] rounded-[22px] flex items-center justify-center">
            <HelpCircle className="w-12 h-12 text-cyan-400" />
          </div>
        </div>
      </div>

      <span className="text-cyan-400 font-extrabold tracking-widest text-sm uppercase mb-3 block">
        Error Code: 404
      </span>
      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4 leading-tight">
        Game Not Found
      </h1>
      <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
        The gaming realm you are looking for does not exist or has been relocated to another galaxy. Explore our trending catalog instead!
      </p>

      {/* Button cluster */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
        {/* Back to Home */}
        <button
          onClick={() => onNavigate('home')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 hover:scale-[1.02] active:scale-[0.98] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Explore Games */}
        <button
          onClick={() => onNavigate('games')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Gamepad2 className="w-4 h-4 text-cyan-400" />
          <span>Explore Games</span>
        </button>

        {/* Trending Games */}
        <button
          onClick={() => onNavigate('trending')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-fuchsia-500/40 text-purple-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Trending Games</span>
        </button>
      </div>
    </div>
  );
};
